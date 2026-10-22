import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ARFilterId,
  CameraColorToneId,
  CapturedPhoto,
  CountdownDuration,
  EditorState,
  LayoutId,
  PhotoCountMode,
  SmoothedFaceMetrics,
} from '../types/photobooth';
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_CUSTOMIZATION,
  getFrameById,
  getLayoutById,
  LAYOUT_CONFIGS,
} from '../utils/constants';
import {
  getCameraColorTone,
  renderActiveARFilters,
  toggleCompatibleARFilter,
} from '../utils/arFilters';
import { faceTrackerService, FaceTrackerStatus } from '../utils/faceTracker';
import { renderPhotoboothCanvas } from '../utils/canvasComposer';
import { generateCuteDemoPhotos } from '../utils/demoPhotos';
import { soundEngine } from '../utils/sound';
import { CameraPreview } from './CameraPreview';
import { ARFilterPanel } from './ARFilterPanel';
import { FrameGallery } from './FrameGallery';
import { PhotoEditor } from './PhotoEditor';
import { ExportPanel } from './ExportPanel';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from './ToastProvider';
import {
  Camera,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  HelpCircle,
  Palette,
  Sliders,
  Download,
  RefreshCw,
  Upload,
  XCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface PhotoboothStudioProps {
  initialFrameId?: string | null;
  onGalleryUpdated: () => void;
}

const PREFS_STORAGE_KEY = 'mochi_booth_studio_prefs_v1';
const TUTORIAL_SEEN_KEY = 'mochi_booth_tutorial_seen_v1';
const FAV_FILTERS_STORAGE_KEY = 'mochi_booth_fav_ar_filters_v1';

export const PhotoboothStudio: React.FC<PhotoboothStudioProps> = ({
  initialFrameId,
  onGalleryUpdated,
}) => {
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const arOverlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const smoothedFacesRef = useRef<SmoothedFaceMetrics[]>([]);
  const liveCanvasRef = useRef<HTMLCanvasElement>(null);
  const slotReplaceInputRef = useRef<HTMLInputElement>(null);

  // Studio Step Indicator: 1 = Capture & Live AR, 2 = Frame & Layout, 3 = Edit & Export
  const [studioStep, setStudioStep] = useState<1 | 2 | 3>(1);

  // Camera & Session state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [mirrorPreview, setMirrorPreview] = useState<boolean>(true);
  const [countdownSec, setCountdownSec] = useState<CountdownDuration>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if ([3, 5, 10].includes(parsed.countdownSec)) return parsed.countdownSec;
      }
    } catch {
      // ignore
    }
    return 3;
  });
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Live AR Face Filters & Camera Color Tone State
  const [activeARFilters, setActiveARFilters] = useState<ARFilterId[]>(['bunny-ears', 'rosy-pink-cheeks']);
  const [activeColorTone, setActiveColorTone] = useState<CameraColorToneId>('original');
  const [favoriteARFilters, setFavoriteARFilters] = useState<ARFilterId[]>(() => {
    try {
      const raw = localStorage.getItem(FAV_FILTERS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return ['bunny-ears', 'coquette-pink-bow', 'rosy-pink-cheeks', 'heart-glasses'];
  });
  const [trackerStatus, setTrackerStatus] = useState<FaceTrackerStatus>('idle');
  const [trackerError, setTrackerError] = useState<string | null>(null);
  const [detectedFaceCount, setDetectedFaceCount] = useState<number>(0);
  const [litePerformanceMode, setLitePerformanceMode] = useState<boolean>(false);

  // Editor & Customization state with Undo/Redo history
  const [editorState, setEditorState] = useState<EditorState>(() => ({
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    stickers: [],
    texts: [],
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      frameId: initialFrameId || DEFAULT_CUSTOMIZATION.frameId,
    },
  }));

  const [historyPast, setHistoryPast] = useState<EditorState[]>([]);
  const [historyFuture, setHistoryFuture] = useState<EditorState[]>([]);

  useEffect(() => {
    if (initialFrameId) {
      const frame = getFrameById(initialFrameId);
      setEditorState((prev) => ({
        ...prev,
        customization: {
          ...prev.customization,
          frameId: frame.id,
          customFooterCaption: frame.defaultFooterText,
        },
      }));
    }
  }, [initialFrameId]);

  const currentLayout = getLayoutById(editorState.customization.layoutId);
  const requiredPhotoCount: PhotoCountMode = currentLayout.photoCount;

  // Captured photos array matching slots (up to 8 slots preserved)
  const [photos, setPhotos] = useState<(CapturedPhoto | null)[]>(() =>
    Array(8).fill(null)
  );

  // Active capture session state
  const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [activeSlotCapturing, setActiveSlotCapturing] = useState<number>(0);
  const [slotToUploadIndex, setSlotToUploadIndex] = useState<number | null>(null);
  const cancelSessionFlagRef = useRef<boolean>(false);
  const sessionLockRef = useRef<boolean>(false);

  // Selected sticker / text for interactive canvas drag
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const dragStateRef = useRef<{
    kind: 'sticker' | 'text';
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Modals & Onboarding Tutorial
  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(TUTORIAL_SEEN_KEY);
    } catch {
      return false;
    }
  });
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Save user preferences
  useEffect(() => {
    try {
      localStorage.setItem(
        PREFS_STORAGE_KEY,
        JSON.stringify({ countdownSec, soundMuted })
      );
    } catch {
      // ignore
    }
  }, [countdownSec, soundMuted]);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_FILTERS_STORAGE_KEY, JSON.stringify(favoriteARFilters));
    } catch {
      // ignore
    }
  }, [favoriteARFilters]);

  const handleToggleARFilter = useCallback((filterId: ARFilterId) => {
    setActiveARFilters((prev) => toggleCompatibleARFilter(prev, filterId));
  }, []);

  const handleToggleFavoriteAR = useCallback((filterId: ARFilterId) => {
    setFavoriteARFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  }, []);

  const handleTrackerStatusChange = useCallback(
    (status: FaceTrackerStatus, error: string | null) => {
      setTrackerStatus(status);
      setTrackerError(error);
    },
    []
  );

  const handleRetryTracker = useCallback(async () => {
    setTrackerStatus('loading');
    setTrackerError(null);
    await faceTrackerService.retryInitialize();
    setTrackerStatus(faceTrackerService.getStatus());
    setTrackerError(faceTrackerService.getErrorMessage());
  }, []);

  // Helper to update EditorState and push to bounded Undo history
  const updateEditorState = useCallback(
    (updater: (prev: EditorState) => EditorState, recordHistory = true) => {
      setEditorState((prev) => {
        const next = updater(prev);
        if (recordHistory) {
          setHistoryPast((h) => [...h.slice(-24), prev]);
          setHistoryFuture([]);
        }
        return next;
      });
    },
    []
  );

  const handleUndo = useCallback(() => {
    setHistoryPast((past) => {
      if (past.length === 0) return past;
      const previous = past[past.length - 1];
      setHistoryFuture((f) => [editorState, ...f.slice(0, 24)]);
      setEditorState(previous);
      return past.slice(0, -1);
    });
  }, [editorState]);

  const handleRedo = useCallback(() => {
    setHistoryFuture((future) => {
      if (future.length === 0) return future;
      const next = future[0];
      setHistoryPast((p) => [...p.slice(-24), editorState]);
      setEditorState(next);
      return future.slice(1);
    });
  }, [editorState]);

  // Live Canvas Re-render whenever photos or editorState change
  useEffect(() => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    renderPhotoboothCanvas(canvas, photos, editorState, 1).catch(() => {
      if (!cancelled) {
        // non-blocking preview error
      }
    });
    return () => {
      cancelled = true;
    };
  }, [photos, editorState]);

  /**
   * Captures a single photo from the active video element AND composites:
   * 1) Active camera color tone (CSS filter + tint)
   * 2) Active real-time AR face accessories & ambient effects
   * 3) Consistent mirror/flip rules matching the live preview!
   */
  const captureVideoFrame = useCallback((): CapturedPhoto | null => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const offscreen = document.createElement('canvas');
    offscreen.width = vw;
    offscreen.height = vh;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return null;

    const toneDef = getCameraColorTone(activeColorTone);

    ctx.save();
    if (mirrorPreview) {
      ctx.translate(vw, 0);
      ctx.scale(-1, 1);
    }

    // 1. Draw camera frame with active live color filter
    if (toneDef.cssFilter && toneDef.cssFilter !== 'none') {
      ctx.filter = toneDef.cssFilter;
    }
    ctx.drawImage(video, 0, 0, vw, vh);
    ctx.filter = 'none';

    // 2. Draw AR Face Filter overlays in the exact same coordinate space (mirrored together with video)
    if (activeARFilters.length > 0) {
      renderActiveARFilters(
        ctx,
        vw,
        vh,
        smoothedFacesRef.current,
        activeARFilters,
        performance.now()
      );
    }
    ctx.restore();

    // 3. Apply live color tone pastel tint if active
    if (toneDef.tintColor && toneDef.tintAlpha > 0) {
      ctx.save();
      ctx.fillStyle = toneDef.tintColor;
      ctx.globalAlpha = toneDef.tintAlpha;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();
    }

    return {
      id: `shot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      dataUrl: offscreen.toDataURL('image/jpeg', 0.94),
      timestamp: Date.now(),
      width: vw,
      height: vh,
      appliedEffects: [...activeARFilters],
      appliedColorTone: activeColorTone,
    };
  }, [activeARFilters, activeColorTone, mirrorPreview]);

  const waitMsAbortable = (ms: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const start = Date.now();
      const timer = window.setInterval(() => {
        if (cancelSessionFlagRef.current) {
          clearInterval(timer);
          resolve(false);
          return;
        }
        if (Date.now() - start >= ms) {
          clearInterval(timer);
          resolve(true);
        }
      }, 80);
    });
  };

  const runCaptureSequence = useCallback(
    async (slotIndices: number[]) => {
      if (sessionLockRef.current) return;
      if (!isCameraActive) {
        showToast(
          'warning',
          'Start Camera First 📷',
          'Please press "Start Camera" or click "Demo Shots" to test with your active AR filters!'
        );
        return;
      }

      sessionLockRef.current = true;
      cancelSessionFlagRef.current = false;
      setIsSessionRunning(true);

      for (const slotIdx of slotIndices) {
        if (cancelSessionFlagRef.current) break;
        setActiveSlotCapturing(slotIdx);

        for (let sec: number = countdownSec; sec >= 1; sec--) {
          if (cancelSessionFlagRef.current) break;
          setCountdownNumber(sec);
          soundEngine.playCountdownBeep(sec === 1, soundMuted);
          const ok = await waitMsAbortable(1000);
          if (!ok) break;
        }

        if (cancelSessionFlagRef.current) break;
        setCountdownNumber(null);

        setIsFlashing(true);
        soundEngine.playShutter(soundMuted);
        window.setTimeout(() => setIsFlashing(false), 260);

        const captured = captureVideoFrame();
        if (captured) {
          setPhotos((prev) => {
            const copy = [...prev];
            copy[slotIdx] = captured;
            return copy;
          });
        } else {
          showToast(
            'error',
            'Frame Capture Failed',
            'Video stream was not ready in time. Please try retaking this shot.'
          );
        }

        if (slotIdx !== slotIndices[slotIndices.length - 1]) {
          const okPause = await waitMsAbortable(650);
          if (!okPause) break;
        }
      }

      setCountdownNumber(null);
      setIsSessionRunning(false);
      sessionLockRef.current = false;

      if (!cancelSessionFlagRef.current) {
        showToast(
          'success',
          'Photo Session Complete! ✨',
          'All shots captured with your active AR filters & camera color tone!'
        );
      }
    },
    [captureVideoFrame, countdownSec, isCameraActive, showToast, soundMuted]
  );

  const handleStartFullSession = () => {
    const indices = Array.from({ length: requiredPhotoCount }, (_, i) => i);
    runCaptureSequence(indices);
  };

  const handleRetakeSingleSlot = (slotIdx: number) => {
    if (isCameraActive) {
      runCaptureSequence([slotIdx]);
    } else {
      setSlotToUploadIndex(slotIdx);
      slotReplaceInputRef.current?.click();
    }
  };

  const handleCancelSession = () => {
    cancelSessionFlagRef.current = true;
    setCountdownNumber(null);
    setIsSessionRunning(false);
    sessionLockRef.current = false;
    showToast('info', 'Session Cancelled', 'Photo countdown was stopped.');
  };

  const handleRetakeAllConfirm = () => {
    setConfirmModal({
      open: true,
      title: 'Retake All Photos? 📸',
      message:
        'This will clear your current captured photos so you can start a fresh session. Your active AR filters, frame, and layout choices will stay intact.',
      onConfirm: () => {
        setConfirmModal((c) => ({ ...c, open: false }));
        setPhotos(Array(8).fill(null));
        if (isCameraActive) {
          handleStartFullSession();
        } else {
          showToast('info', 'Photos Cleared', 'Ready for a fresh photo session!');
        }
      },
    });
  };

  const handleStartOverConfirm = () => {
    setConfirmModal({
      open: true,
      title: 'Start Over From Scratch? 🌸',
      message:
        'This will clear all captured photos, stickers, text, and filter edits back to default.',
      onConfirm: () => {
        setConfirmModal((c) => ({ ...c, open: false }));
        setPhotos(Array(8).fill(null));
        setActiveARFilters([]);
        setActiveColorTone('original');
        setEditorState({
          adjustments: { ...DEFAULT_ADJUSTMENTS },
          stickers: [],
          texts: [],
          customization: { ...DEFAULT_CUSTOMIZATION },
        });
        setHistoryPast([]);
        setHistoryFuture([]);
        setStudioStep(1);
        showToast('info', 'Studio Reset ✨', 'All settings and photos have been reset to default.');
      },
    });
  };

  const handleLoadDemoPhotos = () => {
    const demoShots = generateCuteDemoPhotos(8, activeARFilters, activeColorTone);
    setPhotos(demoShots);
    showToast(
      'success',
      'Cute Mochi Demo Shots Loaded! 🐰✨',
      activeARFilters.length > 0
        ? `Generated with your ${activeARFilters.length} active AR effect(s) baked right into the photos!`
        : 'You can now test all 10 layouts, 16 frames, filters, stickers, and high-res download!'
    );
  };

  const handleUploadFiles = (files: FileList, targetSlot: number | null = null) => {
    const fileArray = Array.from(files).slice(0, 8);
    if (fileArray.length === 0) return;

    fileArray.forEach((file, idx) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const shot: CapturedPhoto = {
            id: `upload-${Date.now()}-${idx}`,
            dataUrl,
            timestamp: Date.now() + idx,
            width: img.width,
            height: img.height,
          };
          setPhotos((prev) => {
            const next = [...prev];
            if (targetSlot !== null && idx === 0) {
              next[targetSlot] = shot;
            } else {
              const emptyIdx = next.findIndex((p, i) => i < requiredPhotoCount && p === null);
              const destIdx = emptyIdx !== -1 ? emptyIdx : idx % requiredPhotoCount;
              next[destIdx] = shot;
            }
            return next;
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

    showToast('success', 'Photos Added! 🖼️', 'Your uploaded photos are now in the booth strip.');
  };

  const handleSelectPhotoCountMode = (mode: PhotoCountMode) => {
    const matchingLayout =
      LAYOUT_CONFIGS.find((l) => l.photoCount === mode) || LAYOUT_CONFIGS[0];
    updateEditorState((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        layoutId: matchingLayout.id,
        photoGap: matchingLayout.defaultGap,
      },
    }));
  };

  const handleSelectLayout = (layoutId: LayoutId) => {
    const cfg = getLayoutById(layoutId);
    updateEditorState((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        layoutId,
        photoGap: cfg.defaultGap,
      },
    }));
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;

    for (let i = editorState.texts.length - 1; i >= 0; i--) {
      const t = editorState.texts[i];
      const dx = Math.abs(t.x - normX);
      const dy = Math.abs(t.y - normY);
      if (dx < 0.18 && dy < 0.06) {
        setSelectedTextId(t.id);
        setSelectedStickerId(null);
        dragStateRef.current = {
          kind: 'text',
          id: t.id,
          startX: normX,
          startY: normY,
          origX: t.x,
          origY: t.y,
        };
        canvas.setPointerCapture(e.pointerId);
        return;
      }
    }

    for (let i = editorState.stickers.length - 1; i >= 0; i--) {
      const s = editorState.stickers[i];
      const dx = Math.abs(s.x - normX);
      const dy = Math.abs(s.y - normY);
      if (dx < 0.09 * s.scale && dy < 0.07 * s.scale) {
        setSelectedStickerId(s.id);
        setSelectedTextId(null);
        dragStateRef.current = {
          kind: 'sticker',
          id: s.id,
          startX: normX,
          startY: normY,
          origX: s.x,
          origY: s.y,
        };
        canvas.setPointerCapture(e.pointerId);
        return;
      }
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragStateRef.current;
    const canvas = liveCanvasRef.current;
    if (!drag || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;
    const nextX = Math.max(0.05, Math.min(0.95, drag.origX + (normX - drag.startX)));
    const nextY = Math.max(0.05, Math.min(0.95, drag.origY + (normY - drag.startY)));

    if (drag.kind === 'sticker') {
      updateEditorState(
        (prev) => ({
          ...prev,
          stickers: prev.stickers.map((s) =>
            s.id === drag.id ? { ...s, x: nextX, y: nextY } : s
          ),
        }),
        false
      );
    } else {
      updateEditorState(
        (prev) => ({
          ...prev,
          texts: prev.texts.map((t) =>
            t.id === drag.id ? { ...t, x: nextX, y: nextY } : t
          ),
        }),
        false
      );
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragStateRef.current) {
      dragStateRef.current = null;
      try {
        liveCanvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const filledShotCount = photos
    .slice(0, requiredPhotoCount)
    .filter((p) => p !== null).length;

  return (
    <div className="studio-page-container">
      {/* FIRST-TIME QUICK ONBOARDING TUTORIAL BANNER */}
      {showTutorial && (
        <div className="studio-tutorial-banner" role="region" aria-label="Quick Studio Guide">
          <div className="tutorial-content">
            <span className="tutorial-badge">✨ Live AR Guide</span>
            <p>
              <strong>1.</strong> Start camera & pick from <strong>51 Live AR Face Filters</strong>{' '}
              (combine Bunny Ears + Glasses + Blush!) → <strong>2.</strong> Choose 10 layouts & 16
              frames → <strong>3.</strong> Decorate & download high-res PNG/JPEG!
            </p>
          </div>
          <button
            type="button"
            className="btn btn-chip"
            onClick={() => {
              setShowTutorial(false);
              try {
                localStorage.setItem(TUTORIAL_SEEN_KEY, '1');
              } catch {
                // ignore
              }
            }}
          >
            Got it! 🌸
          </button>
        </div>
      )}

      {/* TOP STEPPER & GLOBAL STUDIO CONTROLS */}
      <div className="studio-top-bar">
        <div className="studio-stepper" role="tablist" aria-label="Photobooth Steps">
          <button
            type="button"
            role="tab"
            aria-selected={studioStep === 1}
            className={`step-pill ${studioStep === 1 ? 'active' : ''}`}
            onClick={() => setStudioStep(1)}
          >
            <Camera size={16} />
            <span>1. Camera & Live AR ({filledShotCount}/{requiredPhotoCount})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={studioStep === 2}
            className={`step-pill ${studioStep === 2 ? 'active' : ''}`}
            onClick={() => setStudioStep(2)}
          >
            <Palette size={16} />
            <span>2. Layout & Frame</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={studioStep === 3}
            className={`step-pill ${studioStep === 3 ? 'active' : ''}`}
            onClick={() => setStudioStep(3)}
          >
            <Sliders size={16} />
            <span>3. Edit & Download</span>
          </button>
        </div>

        <div className="studio-quick-actions">
          <button
            type="button"
            className="btn btn-chip"
            onClick={() => setShowTutorial((v) => !v)}
            title="Toggle studio tips"
          >
            <HelpCircle size={15} />
            <span>Tips</span>
          </button>

          <button
            type="button"
            className="btn btn-chip"
            onClick={handleLoadDemoPhotos}
            disabled={isSessionRunning}
            title="Fill all photo slots with cute illustrated Mochi demo shots + active AR filters"
          >
            <Sparkles size={15} />
            <span>Demo Shots</span>
          </button>

          <button
            type="button"
            className="btn btn-chip btn-chip-danger"
            onClick={handleStartOverConfirm}
            disabled={isSessionRunning}
          >
            <RotateCcw size={15} />
            <span>Start Over</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN STUDIO WORKSPACE */}
      <div className="studio-main-grid">
        {/* LEFT COLUMN: CAMERA / AR FILTER CATALOG / CONTROLS / EDITOR TABS */}
        <div className="studio-left-workspace">
          {studioStep === 1 && (
            <>
              {/* SESSION CONFIGURATION BAR */}
              <div className="session-config-card">
                <div className="config-group">
                  <span className="config-label">Photo Mode</span>
                  <div className="segmented-pills" role="group" aria-label="Number of photos">
                    {([1, 3, 4, 6, 8] as PhotoCountMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        className={`seg-pill ${requiredPhotoCount === mode ? 'active' : ''}`}
                        onClick={() => handleSelectPhotoCountMode(mode)}
                        disabled={isSessionRunning}
                      >
                        {mode} {mode === 1 ? 'Photo' : 'Photos'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="config-group">
                  <span className="config-label">Countdown</span>
                  <div className="segmented-pills" role="group" aria-label="Countdown timer">
                    {([3, 5, 10] as CountdownDuration[]).map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        className={`seg-pill ${countdownSec === sec ? 'active' : ''}`}
                        onClick={() => setCountdownSec(sec)}
                        disabled={isSessionRunning}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                <div className="config-group">
                  <span className="config-label">Sound</span>
                  <button
                    type="button"
                    className={`btn btn-chip ${!soundMuted ? 'active' : ''}`}
                    onClick={() => setSoundMuted((m) => !m)}
                    aria-label={soundMuted ? 'Unmute countdown sound' : 'Mute countdown sound'}
                  >
                    {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    <span>{soundMuted ? 'Muted' : 'Chime On'}</span>
                  </button>
                </div>
              </div>

              {/* LIVE CAMERA VIEWPORT WITH REAL-TIME AR OVERLAY */}
              <CameraPreview
                videoRef={videoRef}
                arOverlayCanvasRef={arOverlayCanvasRef}
                smoothedFacesRef={smoothedFacesRef}
                isCameraActive={isCameraActive}
                onCameraStateChange={setIsCameraActive}
                mirrorPreview={mirrorPreview}
                onToggleMirror={() => setMirrorPreview((m) => !m)}
                isCapturing={isSessionRunning}
                countdownNumber={countdownNumber}
                isFlashing={isFlashing}
                currentShotIndex={activeSlotCapturing}
                totalShotsRequired={requiredPhotoCount}
                onUploadFallbackPhotos={(files) => handleUploadFiles(files, null)}
                onLoadDemoPhotos={handleLoadDemoPhotos}
                activeARFilters={activeARFilters}
                activeColorTone={activeColorTone}
                litePerformanceMode={litePerformanceMode}
                onTrackerStatusChange={handleTrackerStatusChange}
                onDetectedFaceCountChange={setDetectedFaceCount}
              />

              {/* SHUTTER & SESSION ACTION BAR */}
              <div className="shutter-action-bar">
                {!isSessionRunning ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary btn-lg btn-shutter-main"
                      onClick={handleStartFullSession}
                    >
                      <Camera size={22} />
                      <span>
                        Start Photo Session ({requiredPhotoCount}{' '}
                        {requiredPhotoCount === 1 ? 'Shot' : 'Shots'})
                      </span>
                    </button>

                    {filledShotCount > 0 && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleRetakeAllConfirm}
                      >
                        <RefreshCw size={17} />
                        <span>Retake All</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setStudioStep(2)}
                    >
                      <span>Next: Frame & Layout</span>
                      <ArrowRight size={17} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger btn-lg"
                    onClick={handleCancelSession}
                  >
                    <XCircle size={20} />
                    <span>Cancel Session (Capturing #{activeSlotCapturing + 1}...)</span>
                  </button>
                )}
              </div>

              {/* LIVE AR FACE FILTERS & CAMERA COLOR TONES CATALOG PANEL */}
              <ARFilterPanel
                activeFilters={activeARFilters}
                onToggleFilter={handleToggleARFilter}
                onClearAllFilters={() => setActiveARFilters([])}
                favoriteFilterIds={favoriteARFilters}
                onToggleFavorite={handleToggleFavoriteAR}
                activeColorTone={activeColorTone}
                onSelectColorTone={setActiveColorTone}
                trackerStatus={trackerStatus}
                trackerError={trackerError}
                detectedFaceCount={detectedFaceCount}
                onRetryTracker={handleRetryTracker}
                litePerformanceMode={litePerformanceMode}
                onToggleLiteMode={() => setLitePerformanceMode((v) => !v)}
              />

              {/* CAPTURED SHOTS FILMSTRIP WITH INDIVIDUAL RETAKE / UPLOAD */}
              <div className="captured-filmstrip-card">
                <div className="filmstrip-header">
                  <h4>
                    🎞️ Captured Shots ({filledShotCount} of {requiredPhotoCount})
                  </h4>
                  <span className="filmstrip-hint">
                    Click <strong>Retake</strong> on any slot to redo just that photo!
                  </span>
                </div>

                <div className="filmstrip-slots-grid">
                  {Array.from({ length: requiredPhotoCount }, (_, idx) => {
                    const shot = photos[idx];
                    return (
                      <div
                        key={idx}
                        className={`filmstrip-slot-item ${shot ? 'filled' : 'empty'}`}
                      >
                        <div className="filmstrip-slot-badge">#{idx + 1}</div>
                        {shot ? (
                          <img
                            src={shot.dataUrl}
                            alt={`Captured shot ${idx + 1}`}
                            className="filmstrip-thumb-img"
                          />
                        ) : (
                          <div className="filmstrip-empty-placeholder">
                            <span>Empty</span>
                          </div>
                        )}

                        <div className="filmstrip-slot-actions">
                          <button
                            type="button"
                            className="btn btn-chip btn-xs"
                            onClick={() => handleRetakeSingleSlot(idx)}
                            disabled={isSessionRunning}
                            title={`Retake photo #${idx + 1}`}
                          >
                            <RefreshCw size={12} />
                            <span>{isCameraActive ? 'Retake' : 'Replace'}</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-chip btn-xs"
                            onClick={() => {
                              setSlotToUploadIndex(idx);
                              slotReplaceInputRef.current?.click();
                            }}
                            disabled={isSessionRunning}
                            title={`Upload image for slot #${idx + 1}`}
                            aria-label={`Upload image for slot ${idx + 1}`}
                          >
                            <Upload size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <input
                  ref={slotReplaceInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleUploadFiles(e.target.files, slotToUploadIndex);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </>
          )}

          {/* STEP 2: CHOOSE LAYOUT (10 LAYOUTS) & FRAME CUSTOMIZATION */}
          {studioStep === 2 && (
            <div className="studio-step-card">
              <div className="step-card-nav-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setStudioStep(1)}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Camera & AR</span>
                </button>
                <h3>Choose Layout & Cute Frame 🎀</h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setStudioStep(3)}
                >
                  <span>Next: Filters & Stickers</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* 10 PHOTOBOOTH LAYOUTS */}
              <div className="customization-section">
                <h4>1. Photobooth Layout (10 Styles)</h4>
                <div className="layouts-selector-grid">
                  {LAYOUT_CONFIGS.map((l) => {
                    const isSelected = editorState.customization.layoutId === l.id;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        className={`layout-option-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectLayout(l.id)}
                        aria-pressed={isSelected}
                      >
                        <div className="layout-option-top">
                          <strong>{l.name}</strong>
                          <span className="layout-badge">{l.photoCount} shots</span>
                        </div>
                        <small>{l.subtitle}</small>
                        {isSelected && <Check size={15} className="layout-check-icon" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FRAME SPACING, BORDER, BACKGROUND COLOR, & CAPTION */}
              <div className="customization-section">
                <h4>2. Strip Border, Spacing & Caption</h4>
                <div className="custom-sliders-grid">
                  <div className="slider-control-group">
                    <div className="slider-label-row">
                      <label htmlFor="gap-slider">Photo Spacing (Gap)</label>
                      <span>{editorState.customization.photoGap}px</span>
                    </div>
                    <input
                      id="gap-slider"
                      type="range"
                      min={8}
                      max={48}
                      value={editorState.customization.photoGap}
                      onChange={(e) =>
                        updateEditorState((prev) => ({
                          ...prev,
                          customization: {
                            ...prev.customization,
                            photoGap: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="slider-control-group">
                    <div className="slider-label-row">
                      <label htmlFor="border-slider">Photo Border Thickness</label>
                      <span>{editorState.customization.borderThickness}px</span>
                    </div>
                    <input
                      id="border-slider"
                      type="range"
                      min={0}
                      max={20}
                      value={editorState.customization.borderThickness}
                      onChange={(e) =>
                        updateEditorState((prev) => ({
                          ...prev,
                          customization: {
                            ...prev.customization,
                            borderThickness: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="slider-control-group">
                    <div className="slider-label-row">
                      <label htmlFor="radius-slider">Corner Roundness</label>
                      <span>{editorState.customization.borderRadius}px</span>
                    </div>
                    <input
                      id="radius-slider"
                      type="range"
                      min={0}
                      max={36}
                      value={editorState.customization.borderRadius}
                      onChange={(e) =>
                        updateEditorState((prev) => ({
                          ...prev,
                          customization: {
                            ...prev.customization,
                            borderRadius: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="form-field-grid-2 mt-3">
                  <div>
                    <label htmlFor="custom-bg-color">Custom Background Override</label>
                    <div className="color-override-row">
                      <input
                        id="custom-bg-color"
                        type="color"
                        className="color-picker-input"
                        value={
                          editorState.customization.customBgColor ||
                          getFrameById(editorState.customization.frameId).bgColor
                        }
                        onChange={(e) =>
                          updateEditorState((prev) => ({
                            ...prev,
                            customization: {
                              ...prev.customization,
                              customBgColor: e.target.value,
                            },
                          }))
                        }
                      />
                      {editorState.customization.customBgColor && (
                        <button
                          type="button"
                          className="btn btn-chip"
                          onClick={() =>
                            updateEditorState((prev) => ({
                              ...prev,
                              customization: {
                                ...prev.customization,
                                customBgColor: null,
                              },
                            }))
                          }
                        >
                          Use Frame Theme Color
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="footer-caption-input">Bottom Strip Caption</label>
                    <input
                      id="footer-caption-input"
                      type="text"
                      className="text-input-field"
                      value={editorState.customization.customFooterCaption}
                      onChange={(e) =>
                        updateEditorState((prev) => ({
                          ...prev,
                          customization: {
                            ...prev.customization,
                            customFooterCaption: e.target.value,
                          },
                        }))
                      }
                      placeholder="Little moments, forever memories ♡"
                    />
                  </div>
                </div>

                <div className="checkbox-row-group mt-2">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={editorState.customization.showDateStamp}
                      onChange={(e) =>
                        updateEditorState((prev) => ({
                          ...prev,
                          customization: {
                            ...prev.customization,
                            showDateStamp: e.target.checked,
                          },
                        }))
                      }
                    />
                    <span>Include date stamp on strip footer</span>
                  </label>

                  <button
                    type="button"
                    className="btn btn-chip"
                    onClick={() =>
                      updateEditorState((prev) => ({
                        ...prev,
                        customization: { ...DEFAULT_CUSTOMIZATION },
                      }))
                    }
                  >
                    <RotateCcw size={14} />
                    <span>Reset Frame Settings</span>
                  </button>
                </div>
              </div>

              {/* 16 CUTE FRAMES PICKER */}
              <div className="customization-section">
                <h4>3. Select Frame Design (16 Themes)</h4>
                <FrameGallery
                  compactMode
                  selectedFrameId={editorState.customization.frameId}
                  onSelectFrame={(fId) => {
                    const f = getFrameById(fId);
                    updateEditorState((prev) => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        frameId: fId,
                        customBgColor: null,
                        customFooterCaption: f.defaultFooterText,
                      },
                    }));
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: PHOTO EDITOR (FILTERS, ADJUSTMENTS, STICKERS, TEXT) & EXPORT */}
          {studioStep === 3 && (
            <div className="studio-step-3-stack">
              <div className="step-card-nav-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setStudioStep(2)}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Frame & Layout</span>
                </button>
                <h3>Edit Photos & Download ✨</h3>
              </div>

              <PhotoEditor
                editorState={editorState}
                onUpdateState={updateEditorState}
                selectedStickerId={selectedStickerId}
                onSelectSticker={setSelectedStickerId}
                selectedTextId={selectedTextId}
                onSelectText={setSelectedTextId}
                canUndo={historyPast.length > 0}
                canRedo={historyFuture.length > 0}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onResetEditor={() =>
                  updateEditorState((prev) => ({
                    ...prev,
                    adjustments: { ...DEFAULT_ADJUSTMENTS },
                    stickers: [],
                    texts: [],
                  }))
                }
              />

              <ExportPanel
                photos={photos}
                editorState={editorState}
                onUpdateTransparentBg={(transparent) =>
                  updateEditorState((prev) => ({
                    ...prev,
                    customization: {
                      ...prev.customization,
                      transparentBg: transparent,
                    },
                  }))
                }
                onSavedToGallery={onGalleryUpdated}
              />
            </div>
          )}
        </div>

        {/* RIGHT STICKY COLUMN: INTERACTIVE LIVE PHOTOBOOTH STRIP PREVIEW */}
        <aside className="studio-right-preview" aria-label="Live Photobooth Strip Preview">
          <div className="preview-sticky-card">
            <div className="preview-card-header">
              <div>
                <span className="preview-live-badge">● LIVE STRIP PREVIEW</span>
                <h4>
                  {currentLayout.name} • {getFrameById(editorState.customization.frameId).name}
                </h4>
              </div>
              {studioStep !== 3 && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setStudioStep(3)}
                >
                  <Download size={15} />
                  <span>Edit & Download</span>
                </button>
              )}
            </div>

            <div className="canvas-stage-wrapper">
              <canvas
                ref={liveCanvasRef}
                className="live-booth-canvas"
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
              />
            </div>

            <p className="preview-drag-tip">
              💡 Tip: Added stickers or text? Drag them directly on this strip preview to reposition!
            </p>
          </div>
        </aside>
      </div>

      {/* CONFIRMATION MODAL FOR DESTRUCTIVE ACTIONS */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel="Yes, Continue"
        cancelLabel="Keep Current"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((c) => ({ ...c, open: false }))}
      />
    </div>
  );
};
