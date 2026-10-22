import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { NormalizedPoint } from '../types/photobooth';

export type FaceTrackerStatus = 'idle' | 'loading' | 'ready' | 'error';

class FaceTrackerService {
  private landmarker: FaceLandmarker | null = null;
  private status: FaceTrackerStatus = 'idle';
  private errorMessage: string | null = null;
  private initPromise: Promise<boolean> | null = null;
  private lastVideoTime = -1;

  public getStatus(): FaceTrackerStatus {
    return this.status;
  }

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }

  public async initialize(): Promise<boolean> {
    if (this.status === 'ready' && this.landmarker) {
      return true;
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.status = 'loading';
    this.errorMessage = null;

    this.initPromise = (async () => {
      try {
        // First try loading local self-hosted WASM and model from /mediapipe
        const vision = await FilesetResolver.forVisionTasks('/mediapipe');

        try {
          this.landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/mediapipe/face_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 3,
            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        } catch {
          // Fallback to CPU delegate if WebGL/GPU delegate is restricted
          this.landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/mediapipe/face_landmarker.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numFaces: 3,
            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        }

        this.status = 'ready';
        return true;
      } catch (err) {
        this.status = 'error';
        this.errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load MediaPipe Face Landmarker model.';
        this.initPromise = null;
        return false;
      }
    })();

    return this.initPromise;
  }

  public async retryInitialize(): Promise<boolean> {
    this.dispose();
    return this.initialize();
  }

  /**
   * Detects up to 3 faces in the current video frame.
   * Avoids re-running inference on the exact same video frame timestamp.
   */
  public detectFaces(
    video: HTMLVideoElement,
    timestampMs: number
  ): NormalizedPoint[][] | null {
    if (
      this.status !== 'ready' ||
      !this.landmarker ||
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      return null;
    }

    if (video.currentTime === this.lastVideoTime) {
      // Return null to signify "keep previous frame's landmarks"
      return null;
    }
    this.lastVideoTime = video.currentTime;

    try {
      const result = this.landmarker.detectForVideo(video, timestampMs);
      if (!result || !result.faceLandmarks) return [];
      return result.faceLandmarks.map((face) =>
        face.map((pt) => ({ x: pt.x, y: pt.y, z: pt.z }))
      );
    } catch {
      return [];
    }
  }

  public dispose(): void {
    if (this.landmarker) {
      try {
        this.landmarker.close();
      } catch {
        // ignore close error
      }
      this.landmarker = null;
    }
    this.status = 'idle';
    this.initPromise = null;
    this.lastVideoTime = -1;
  }
}

export const faceTrackerService = new FaceTrackerService();

