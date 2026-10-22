import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ARFilterId,
  CameraColorToneId,
  SmoothedFaceMetrics,
} from '../types/photobooth';
import { CAMERA_RESOLUTIONS } from '../utils/constants';
import {
  extractFaceMetrics,
  getARFilterById,
  getCameraColorTone,
  renderActiveARFilters,
  smoothFaceMetricsList,
} from '../utils/arFilters';
import { faceTrackerService, FaceTrackerStatus } from '../utils/faceTracker';
import {
  Camera,
  CameraOff,
  RefreshCw,
  FlipHorizontal,
  AlertCircle,
  Upload,
  Sparkles,
  ShieldAlert,
  Wand2,
} from 'lucide-react';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  arOverlayCanvasRef: React.RefObject<HTMLCanvasElement>;
  smoothedFacesRef: React.MutableRefObject<SmoothedFaceMetrics[]>;
  isCameraActive: boolean;
  onCameraStateChange: (active: boolean) => void;
  mirrorPreview: boolean;
  onToggleMirror: () => void;
  isCapturing: boolean;
  countdownNumber: number | null;
  isFlashing: boolean;
  currentShotIndex: number;
  totalShotsRequired: number;
  onUploadFallbackPhotos: (files: FileList) => void;
  onLoadDemoPhotos: () => void;
  activeARFilters: ARFilterId[];
  activeColorTone: CameraColorToneId;
  litePerformanceMode: boolean;
  onTrackerStatusChange: (status: FaceTrackerStatus, error: string | null) => void;
  onDetectedFaceCountChange: (count: number) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  arOverlayCanvasRef,
  smoothedFacesRef,
  isCameraActive,
  onCameraStateChange,
  mirrorPreview,
  onToggleMirror,
  isCapturing,
  countdownNumber,
  isFlashing,
  currentShotIndex,
  totalShotsRequired,
  onUploadFallbackPhotos,
  onLoadDemoPhotos,
  activeARFilters,
  activeColorTone,
  litePerformanceMode,
  onTrackerStatusChange,
  onDetectedFaceCountChange,
}) => {
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastInferenceTimeRef = useRef<number>(0);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [resolutionIdx, setResolutionIdx] = useState<number>(0);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<{
    title: string;
    message: string;
    hint: string;
  } | null>(null);

  const isSecureContextAvailable =
    typeof window !== 'undefined' &&
    (window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  const stopCameraStream = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore track stop error
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    smoothedFacesRef.current = [];
    onDetectedFaceCountChange(0);
    onCameraStateChange(false);
  }, [onCameraStateChange, onDetectedFaceCountChange, smoothedFacesRef, videoRef]);

  // Clean up camera and animation frames when unmounting studio
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Initialize MediaPipe Face Landmarker when camera is started or when any face-tracked AR filter is chosen
  useEffect(() => {
    const needsTracker =
      isCameraActive &&
      (activeARFilters.length === 0 ||
        activeARFilters.some((id) => getARFilterById(id)?.requiresFaceTracking));

    if (!needsTracker && !isCameraActive) return;

    let mounted = true;
    onTrackerStatusChange(faceTrackerService.getStatus(), faceTrackerService.getErrorMessage());

    faceTrackerService.initialize().then(() => {
      if (!mounted) return;
      onTrackerStatusChange(
        faceTrackerService.getStatus(),
        faceTrackerService.getErrorMessage()
      );
    });

    return () => {
      mounted = false;
    };
  }, [isCameraActive, activeARFilters, onTrackerStatusChange]);

  // Real-time Face Tracking + AR Overlay Render Loop
  useEffect(() => {
    if (!isCameraActive) {
      const overlay = arOverlayCanvasRef.current;
      if (overlay) {
        const ctx = overlay.getContext('2d');
        ctx?.clearRect(0, 0, overlay.width, overlay.height);
      }
      return;
    }

    let running = true;
    let lastReportedFaceCount = -1;

    const renderLoop = (nowMs: number) => {
      if (!running) return;

      const video = videoRef.current;
      const overlay = arOverlayCanvasRef.current;

      if (video && overlay && video.readyState >= 2 && video.videoWidth > 0) {
        if (overlay.width !== video.videoWidth || overlay.height !== video.videoHeight) {
          overlay.width = video.videoWidth;
          overlay.height = video.videoHeight;
        }

        const ctx = overlay.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, overlay.width, overlay.height);

          // Throttle landmark inference interval (e.g., ~33ms in High FPS mode, ~65ms in Lite mode)
          const minIntervalMs = litePerformanceMode ? 65 : 30;
          if (
            faceTrackerService.getStatus() === 'ready' &&
            nowMs - lastInferenceTimeRef.current >= minIntervalMs
          ) {
            lastInferenceTimeRef.current = nowMs;
            const rawLandmarksList = faceTrackerService.detectFaces(video, nowMs);
            if (rawLandmarksList !== null) {
              const extracted: SmoothedFaceMetrics[] = [];
              for (const lm of rawLandmarksList) {
                const m = extractFaceMetrics(lm, overlay.width, overlay.height);
                if (m) extracted.push(m);
              }
              smoothedFacesRef.current = smoothFaceMetricsList(
                smoothedFacesRef.current,
                extracted,
                0.48
              );
              if (smoothedFacesRef.current.length !== lastReportedFaceCount) {
                lastReportedFaceCount = smoothedFacesRef.current.length;
                onDetectedFaceCountChange(lastReportedFaceCount);
              }
            }
          }

          // Render active AR filters onto the transparent overlay canvas
          if (activeARFilters.length > 0) {
            renderActiveARFilters(
              ctx,
              overlay.width,
              overlay.height,
              smoothedFacesRef.current,
              activeARFilters,
              nowMs
            );
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      running = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [
    activeARFilters,
    arOverlayCanvasRef,
    isCameraActive,
    litePerformanceMode,
    onDetectedFaceCountChange,
    smoothedFacesRef,
    videoRef,
  ]);

  const refreshDeviceList = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      setAvailableCameras(videoDevices);
    } catch {
      // Ignore enumeration errors
    }
  }, []);

  const startCamera = useCallback(
    async (
      overrideFacing?: 'user' | 'environment',
      overrideResIdx?: number,
      overrideDeviceId?: string
    ) => {
      setCameraError(null);

      if (!isSecureContextAvailable) {
        setCameraError({
          title: 'HTTPS or Localhost Required 🔒',
          message:
            'Browser security rules only allow camera access on HTTPS websites or localhost.',
          hint: 'Please open this site via https:// or http://localhost, or use the "Upload Photos / Load Cute Demo Shots" buttons below!',
        });
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError({
          title: 'Camera API Not Supported',
          message: 'Your current browser does not support navigator.mediaDevices.getUserMedia().',
          hint: 'Try opening Mochi Booth in Chrome, Edge, Firefox, or Safari—or upload photos directly below.',
        });
        return;
      }

      setIsLoadingCamera(true);
      stopCameraStream();

      const targetFacing = overrideFacing ?? facingMode;
      const resOption =
        CAMERA_RESOLUTIONS[overrideResIdx ?? resolutionIdx] || CAMERA_RESOLUTIONS[0];
      const targetDevice = overrideDeviceId !== undefined ? overrideDeviceId : selectedDeviceId;

      const videoConstraints: MediaTrackConstraints = {
        width: { ideal: resOption.width },
        height: { ideal: resOption.height },
      };

      if (targetDevice) {
        videoConstraints.deviceId = { exact: targetDevice };
      } else {
        videoConstraints.facingMode = { ideal: targetFacing };
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        onCameraStateChange(true);
        await refreshDeviceList();
      } catch (err: unknown) {
        const domErr = err as { name?: string; message?: string };
        const errName = domErr?.name || '';

        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError({
            title: 'Camera Permission Denied 🚫',
            message: 'You declined camera access, or your browser blocked permission.',
            hint: 'Click the lock/camera icon in your browser address bar to allow camera access, then press "Start Camera" again.',
          });
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError({
            title: 'No Camera Detected 📷',
            message: 'We could not find an active webcam or phone camera on your device.',
            hint: 'Connect a camera, or click "Load Cute Demo Photos" / "Upload Photos" below to try the full photobooth & AR effects right away!',
          });
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          setCameraError({
            title: 'Camera Busy in Another App ⚠️',
            message:
              'Your camera is currently being used by another application (Zoom, Meet, etc.).',
            hint: 'Close other apps using the camera and click "Start Camera" again.',
          });
        } else if (errName === 'OverconstrainedError') {
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
            streamRef.current = fallbackStream;
            if (videoRef.current) {
              videoRef.current.srcObject = fallbackStream;
              await videoRef.current.play().catch(() => {});
            }
            onCameraStateChange(true);
            await refreshDeviceList();
          } catch {
            setCameraError({
              title: 'Could Not Start Camera',
              message: 'Your camera did not accept the requested video settings.',
              hint: 'Try selecting "Compact Fast (640×480)" resolution or use the photo upload option.',
            });
          }
        } else {
          setCameraError({
            title: 'Camera Connection Issue',
            message: domErr?.message || 'An unexpected error occurred while starting the camera.',
            hint: 'You can retry starting the camera or use "Load Cute Demo Photos" below.',
          });
        }
      } finally {
        setIsLoadingCamera(false);
      }
    },
    [
      facingMode,
      isSecureContextAvailable,
      onCameraStateChange,
      refreshDeviceList,
      resolutionIdx,
      selectedDeviceId,
      stopCameraStream,
      videoRef,
    ]
  );

  const handleSwitchCamera = async () => {
    if (availableCameras.length > 1) {
      const currentIdx = availableCameras.findIndex((d) => d.deviceId === selectedDeviceId);
      const nextIdx = (currentIdx + 1) % availableCameras.length;
      const nextDevice = availableCameras[nextIdx];
      setSelectedDeviceId(nextDevice.deviceId);
      if (isCameraActive) {
        await startCamera(facingMode, resolutionIdx, nextDevice.deviceId);
      }
    } else {
      const nextFacing = facingMode === 'user' ? 'environment' : 'user';
      setFacingMode(nextFacing);
      setSelectedDeviceId('');
      if (isCameraActive) {
        await startCamera(nextFacing, resolutionIdx, '');
      }
    }
  };

  const handleResolutionChange = async (newIdx: number) => {
    setResolutionIdx(newIdx);
    if (isCameraActive) {
      await startCamera(facingMode, newIdx, selectedDeviceId);
    }
  };

  const toneDef = getCameraColorTone(activeColorTone);

  return (
    <div className="camera-module-card">
      {/* TOP CAMERA TOOLBAR */}
      <div className="camera-toolbar">
        <div className="camera-status-indicator">
          <span className={`status-dot ${isCameraActive ? 'live' : 'idle'}`} />
          <span className="status-text">
            {isLoadingCamera
              ? 'Starting camera...'
              : isCameraActive
              ? 'Camera & Live AR Active'
              : 'Camera Standby'}
          </span>
        </div>

        <div className="camera-settings-group">
          <label className="sr-only" htmlFor="camera-res-select">
            Camera Resolution
          </label>
          <select
            id="camera-res-select"
            className="select-pill"
            value={resolutionIdx}
            onChange={(e) => handleResolutionChange(Number(e.target.value))}
            disabled={isCapturing}
            title="Select camera resolution"
          >
            {CAMERA_RESOLUTIONS.map((res, i) => (
              <option key={res.label} value={i}>
                {res.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={`btn btn-chip ${mirrorPreview ? 'active' : ''}`}
            onClick={onToggleMirror}
            title="Flip / Mirror camera horizontally"
            aria-label="Mirror camera horizontally"
          >
            <FlipHorizontal size={15} />
            <span>Mirror</span>
          </button>

          <button
            type="button"
            className="btn btn-chip"
            onClick={handleSwitchCamera}
            disabled={!isCameraActive || isCapturing}
            title="Switch Front / Back or secondary camera"
            aria-label="Switch Camera"
          >
            <RefreshCw size={15} />
            <span>Switch Cam</span>
          </button>

          {isCameraActive ? (
            <button
              type="button"
              className="btn btn-chip btn-chip-danger"
              onClick={stopCameraStream}
              disabled={isCapturing}
            >
              <CameraOff size={15} />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-chip btn-chip-primary"
              onClick={() => startCamera()}
              disabled={isLoadingCamera}
            >
              <Camera size={15} />
              <span>Start Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEWPORT CONTAINER */}
      <div className="camera-viewport-frame">
        <video
          ref={videoRef}
          style={{
            filter: toneDef.cssFilter !== 'none' ? toneDef.cssFilter : undefined,
          }}
          className={`camera-video-el ${mirrorPreview ? 'mirrored' : ''} ${
            isCameraActive ? 'visible' : 'hidden'
          }`}
          playsInline
          muted
          autoPlay
        />

        {/* LIVE COLOR TINT OVERLAY */}
        {isCameraActive && toneDef.tintColor && toneDef.tintAlpha > 0 && (
          <div
            className="camera-color-tint-overlay"
            style={{
              backgroundColor: toneDef.tintColor,
              opacity: toneDef.tintAlpha,
            }}
            aria-hidden="true"
          />
        )}

        {/* REAL-TIME AR FACE FILTER OVERLAY CANVAS */}
        <canvas
          ref={arOverlayCanvasRef}
          className={`camera-ar-overlay-canvas ${mirrorPreview ? 'mirrored' : ''} ${
            isCameraActive ? 'visible' : 'hidden'
          }`}
          aria-hidden="true"
        />

        {/* SESSION PROGRESS BADGE */}
        {isCameraActive && (
          <div className="camera-progress-pill" aria-live="polite">
            📸 Photo {Math.min(currentShotIndex + 1, totalShotsRequired)} of {totalShotsRequired}
          </div>
        )}

        {/* ACTIVE AR FILTER INDICATOR PILL ON CAMERA */}
        {isCameraActive && (activeARFilters.length > 0 || activeColorTone !== 'original') && (
          <div className="camera-active-ar-badge" aria-live="polite">
            <Wand2 size={13} />
            <span>
              {activeARFilters.length > 0
                ? `${activeARFilters
                    .map((id) => getARFilterById(id)?.icon || '')
                    .join(' ')} ${activeARFilters.length} AR Effect${
                    activeARFilters.length > 1 ? 's' : ''
                  }`
                : ''}{' '}
              {activeColorTone !== 'original' ? `• ${toneDef.name}` : ''}
            </span>
          </div>
        )}

        {/* BIG COUNTDOWN OVERLAY */}
        {countdownNumber !== null && (
          <div className="countdown-overlay" role="timer" aria-live="assertive">
            <div key={countdownNumber} className="countdown-bubble">
              {countdownNumber}
            </div>
            <p className="countdown-subtext">Hold your cutest pose! ✨</p>
          </div>
        )}

        {/* WHITE SCREEN FLASH EFFECT */}
        {isFlashing && <div className="camera-flash-overlay" aria-hidden="true" />}

        {/* STANDBY / PERMISSION PROMPT / ERROR FALLBACK */}
        {!isCameraActive && (
          <div className="camera-placeholder-overlay">
            {!isSecureContextAvailable && (
              <div className="https-warning-banner">
                <ShieldAlert size={18} />
                <span>
                  Note: Camera access requires <strong>HTTPS</strong> or <strong>localhost</strong>.
                </span>
              </div>
            )}

            {cameraError ? (
              <div className="camera-error-box" role="alert">
                <AlertCircle size={32} className="error-icon" />
                <h3>{cameraError.title}</h3>
                <p>{cameraError.message}</p>
                <p className="error-hint">{cameraError.hint}</p>
                <div className="placeholder-cta-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => startCamera()}
                    disabled={isLoadingCamera}
                  >
                    <Camera size={17} />
                    <span>Try Camera Again</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onLoadDemoPhotos}
                  >
                    <Sparkles size={17} />
                    <span>Load Cute Demo Photos (with Active AR!)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="camera-welcome-box">
                <div className="camera-cute-illustration">📸🐰✨</div>
                <h3>Ready for Live AR Photobooth?</h3>
                <p>
                  Turn on your camera to try <strong>51 real-time AR face filters</strong> (Bunny
                  Ears, Wigs, Glasses, Blush & Sparkles) tracked to your face via MediaPipe!
                </p>
                <div className="placeholder-cta-row">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => startCamera()}
                    disabled={isLoadingCamera}
                  >
                    <Camera size={20} />
                    <span>{isLoadingCamera ? 'Starting Camera...' : 'Start Camera Now'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={17} />
                    <span>Upload Photos Instead</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={onLoadDemoPhotos}
                  >
                    <Sparkles size={17} />
                    <span>Try with Cute Mochi Demo Shots</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUploadFallbackPhotos(e.target.files);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};
