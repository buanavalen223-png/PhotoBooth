import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';
import { BackgroundMode, getBackgroundById } from './backgroundLibrary';

export type SegmenterStatus = 'idle' | 'loading' | 'ready' | 'error';

class BackgroundSegmenterService {
  private segmenter: ImageSegmenter | null = null;
  private status: SegmenterStatus = 'idle';
  private errorMessage: string | null = null;
  private initPromise: Promise<boolean> | null = null;
  private lastVideoTime = -1;

  // Offscreen mask canvas & smoothed mask buffer
  private maskCanvas: HTMLCanvasElement | null = null;
  private maskCtx: CanvasRenderingContext2D | null = null;
  private maskImageData: ImageData | null = null;
  private smoothedMask: Float32Array | null = null;
  private maskWidth = 256;
  private maskHeight = 256;

  // Offscreen canvas for isolating the segmented person
  private personCanvas: HTMLCanvasElement | null = null;
  private personCtx: CanvasRenderingContext2D | null = null;

  // Offscreen canvas for blurred background
  private blurCanvas: HTMLCanvasElement | null = null;
  private blurCtx: CanvasRenderingContext2D | null = null;

  public getStatus(): SegmenterStatus {
    return this.status;
  }

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }

  public async initialize(): Promise<boolean> {
    if (this.status === 'ready' && this.segmenter) {
      return true;
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.status = 'loading';
    this.errorMessage = null;

    this.initPromise = (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          `${import.meta.env.BASE_URL}mediapipe`
        );

        const localModelPath = `${import.meta.env.BASE_URL}mediapipe/selfie_segmenter.tflite`;
        const cdnModelPath =
          'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite';

        let seg: ImageSegmenter | null = null;

        // Attempt 1: Local model with GPU delegate
        try {
          seg = await ImageSegmenter.createFromOptions(vision, {
            baseOptions: { modelAssetPath: localModelPath, delegate: 'GPU' },
            runningMode: 'VIDEO',
            outputConfidenceMasks: true,
            outputCategoryMask: false,
          });
        } catch {
          // Attempt 2: Local model with CPU delegate
          try {
            seg = await ImageSegmenter.createFromOptions(vision, {
              baseOptions: { modelAssetPath: localModelPath, delegate: 'CPU' },
              runningMode: 'VIDEO',
              outputConfidenceMasks: true,
              outputCategoryMask: false,
            });
          } catch {
            // Attempt 3: CDN model fallback
            try {
              seg = await ImageSegmenter.createFromOptions(vision, {
                baseOptions: { modelAssetPath: cdnModelPath, delegate: 'GPU' },
                runningMode: 'VIDEO',
                outputConfidenceMasks: true,
                outputCategoryMask: false,
              });
            } catch {
              seg = await ImageSegmenter.createFromOptions(vision, {
                baseOptions: { modelAssetPath: cdnModelPath, delegate: 'CPU' },
                runningMode: 'VIDEO',
                outputConfidenceMasks: true,
                outputCategoryMask: false,
              });
            }
          }
        }

        this.segmenter = seg;
        this.status = 'ready';
        this.initBuffers();
        return true;
      } catch (err) {
        this.status = 'error';
        this.errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize background segmentation.';
        this.initPromise = null;
        return false;
      }
    })();

    return this.initPromise;
  }

  private initBuffers() {
    if (typeof document === 'undefined') return;
    this.maskCanvas = document.createElement('canvas');
    this.maskCanvas.width = this.maskWidth;
    this.maskCanvas.height = this.maskHeight;
    this.maskCtx = this.maskCanvas.getContext('2d', { willReadFrequently: true });
    this.maskImageData = this.maskCtx?.createImageData(this.maskWidth, this.maskHeight) || null;
    this.smoothedMask = new Float32Array(this.maskWidth * this.maskHeight);

    this.personCanvas = document.createElement('canvas');
    this.personCtx = this.personCanvas.getContext('2d');

    this.blurCanvas = document.createElement('canvas');
    this.blurCtx = this.blurCanvas.getContext('2d');
  }

  /**
   * Processes a video frame and updates the internal smoothed segmentation mask.
   * Runs non-blocking and throttled.
   */
  public updateSegmentation(video: HTMLVideoElement, timestampMs: number): boolean {
    if (
      this.status !== 'ready' ||
      !this.segmenter ||
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      return false;
    }

    if (video.currentTime === this.lastVideoTime) {
      return false;
    }
    this.lastVideoTime = video.currentTime;

    try {
      this.segmenter.segmentForVideo(video, timestampMs, (result) => {
        if (!result.confidenceMasks || result.confidenceMasks.length === 0) return;
        const mask = result.confidenceMasks[0];
        const rawMask = mask.getAsFloat32Array();
        const mw = mask.width;
        const mh = mask.height;

        if (mw !== this.maskWidth || mh !== this.maskHeight || !this.smoothedMask) {
          this.maskWidth = mw;
          this.maskHeight = mh;
          this.initBuffers();
        }

        const smoothed = this.smoothedMask!;
        const imgData = this.maskImageData;
        if (!imgData || !this.maskCtx) return;

        const pixels = imgData.data;
        const len = rawMask.length;

        // Temporal exponential moving average for edge stabilization: 65% new, 35% past
        const alpha = 0.65;
        const invAlpha = 1 - alpha;

        for (let i = 0; i < len; i++) {
          const val = smoothed[i] * invAlpha + rawMask[i] * alpha;
          smoothed[i] = val;

          // Sigmoid contrast curve for crisp hair/edges without haloing
          // val < 0.25 -> 0, val > 0.75 -> 1, smooth in between
          let edgeVal = val;
          if (edgeVal > 0.55) {
            edgeVal = Math.min(1, edgeVal * 1.08);
          } else if (edgeVal < 0.35) {
            edgeVal = Math.max(0, edgeVal * 0.85);
          }

          const byteVal = Math.round(edgeVal * 255);
          const pIdx = i * 4;
          pixels[pIdx] = 255;
          pixels[pIdx + 1] = 255;
          pixels[pIdx + 2] = 255;
          pixels[pIdx + 3] = byteVal;
        }

        this.maskCtx.putImageData(imgData, 0, 0);
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Has a valid segmentation mask ready to composite.
   */
  public hasMask(): boolean {
    return this.status === 'ready' && this.maskCanvas !== null;
  }

  /**
   * Master Compositor:
   * Composites the video with the chosen background mode (Original, Blur, Replace)
   * onto any target Canvas 2D context.
   */
  public composite(
    targetCtx: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    mode: BackgroundMode,
    backgroundId: string,
    width: number,
    height: number,
    mirror = false
  ): void {
    if (mode === 'original' || !this.hasMask()) {
      // Direct camera rendering
      targetCtx.save();
      if (mirror) {
        targetCtx.translate(width, 0);
        targetCtx.scale(-1, 1);
      }
      targetCtx.drawImage(video, 0, 0, width, height);
      targetCtx.restore();
      return;
    }

    // Ensure personCanvas matches target dimensions
    if (
      !this.personCanvas ||
      this.personCanvas.width !== width ||
      this.personCanvas.height !== height
    ) {
      if (!this.personCanvas) this.personCanvas = document.createElement('canvas');
      this.personCanvas.width = width;
      this.personCanvas.height = height;
      this.personCtx = this.personCanvas.getContext('2d');
    }

    const pCtx = this.personCtx;
    if (!pCtx || !this.maskCanvas) return;

    // 1. Render Segmented Person onto personCanvas
    pCtx.clearRect(0, 0, width, height);
    pCtx.save();
    if (mirror) {
      pCtx.translate(width, 0);
      pCtx.scale(-1, 1);
    }
    pCtx.drawImage(video, 0, 0, width, height);
    pCtx.restore();

    // Mask the person with the segmentation alpha mask
    pCtx.save();
    pCtx.globalCompositeOperation = 'destination-in';
    if (mirror) {
      pCtx.translate(width, 0);
      pCtx.scale(-1, 1);
    }
    pCtx.drawImage(this.maskCanvas, 0, 0, width, height);
    pCtx.restore();

    // 2. Render Selected Background onto targetCtx
    targetCtx.save();
    if (mode === 'blur') {
      // Blur mode: Draw blurred video frame as environment background
      targetCtx.save();
      if (mirror) {
        targetCtx.translate(width, 0);
        targetCtx.scale(-1, 1);
      }
      // Apply browser hardware-accelerated blur
      targetCtx.filter = 'blur(18px)';
      // Overdraw slightly (5%) to prevent edge transparency from filter
      targetCtx.drawImage(video, -width * 0.03, -height * 0.03, width * 1.06, height * 1.06);
      targetCtx.restore();
    } else {
      // Replace mode: Render chosen solid color, gradient, or scene
      const bg = getBackgroundById(backgroundId);
      bg.draw(targetCtx, width, height);
    }
    targetCtx.restore();

    // 3. Draw segmented person on top of the background
    targetCtx.drawImage(this.personCanvas, 0, 0, width, height);
  }

  public dispose(): void {
    if (this.segmenter) {
      try {
        this.segmenter.close();
      } catch {
        // ignore
      }
      this.segmenter = null;
    }
    this.status = 'idle';
    this.initPromise = null;
    this.lastVideoTime = -1;
  }
}

export const backgroundSegmenterService = new BackgroundSegmenterService();
