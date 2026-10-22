import React, { useState } from 'react';
import { CapturedPhoto, EditorState } from '../types/photobooth';
import { getFrameById, getLayoutById } from '../utils/constants';
import {
  buildExportFilename,
  exportCanvasToBlob,
  renderPhotoboothCanvas,
} from '../utils/canvasComposer';
import { saveWorkToGallery } from '../utils/storage';
import { useToast } from './ToastProvider';
import {
  Download,
  Printer,
  BookmarkPlus,
  CheckCircle2,
  Sparkles,
  FileImage,
} from 'lucide-react';

interface ExportPanelProps {
  photos: (CapturedPhoto | null)[];
  editorState: EditorState;
  onUpdateTransparentBg: (transparent: boolean) => void;
  onSavedToGallery: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  photos,
  editorState,
  onUpdateTransparentBg,
  onSavedToGallery,
}) => {
  const { showToast } = useToast();
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [jpegQuality, setJpegQuality] = useState<number>(0.94);
  const [resolutionScale, setResolutionScale] = useState<1 | 1.5 | 2>(1.5);
  const [workTitle, setWorkTitle] = useState<string>('Mochi Strip Memory');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSavingGallery, setIsSavingGallery] = useState<boolean>(false);

  const layout = getLayoutById(editorState.customization.layoutId);
  const frame = getFrameById(editorState.customization.frameId);
  const outWidth = Math.round(layout.canvasWidth * resolutionScale);
  const outHeight = Math.round(layout.canvasHeight * resolutionScale);

  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const offscreen = document.createElement('canvas');
      await renderPhotoboothCanvas(offscreen, photos, editorState, resolutionScale);

      const effectiveFormat =
        editorState.customization.transparentBg ? 'image/png' : format;
      const blob = await exportCanvasToBlob(offscreen, effectiveFormat, jpegQuality);
      const ext = effectiveFormat === 'image/png' ? 'png' : 'jpg';
      const filename = buildExportFilename(ext);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);

      showToast(
        'success',
        'Downloaded Successfully! 🎉',
        `Saved as ${filename} (${outWidth}×${outHeight}px)`
      );
    } catch (err) {
      showToast(
        'error',
        'Export Failed',
        err instanceof Error ? err.message : 'Could not generate download image.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (isSavingGallery) return;
    setIsSavingGallery(true);
    try {
      const offscreen = document.createElement('canvas');
      await renderPhotoboothCanvas(offscreen, photos, editorState, 1);
      const blob = await exportCanvasToBlob(offscreen, 'image/png', 0.92);

      // Generate lightweight thumbnail for fast gallery grid browsing
      const thumbCanvas = document.createElement('canvas');
      const thumbScale = 320 / offscreen.width;
      thumbCanvas.width = 320;
      thumbCanvas.height = Math.round(offscreen.height * thumbScale);
      const tCtx = thumbCanvas.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(offscreen, 0, 0, thumbCanvas.width, thumbCanvas.height);
      }

      await saveWorkToGallery({
        id: `work-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: workTitle.trim() || `${frame.name} Strip`,
        createdAt: Date.now(),
        layoutId: layout.id,
        frameName: frame.name,
        blob,
        thumbnailDataUrl: thumbCanvas.toDataURL('image/jpeg', 0.82),
        width: offscreen.width,
        height: offscreen.height,
      });

      onSavedToGallery();
      showToast(
        'success',
        'Saved to Local Gallery! 💖',
        'Your photobooth creation is safely stored in this browser.'
      );
    } catch (err) {
      showToast(
        'error',
        'Gallery Save Error',
        err instanceof Error ? err.message : 'Could not save to local storage.'
      );
    } finally {
      setIsSavingGallery(false);
    }
  };

  const handlePrint = async () => {
    try {
      const offscreen = document.createElement('canvas');
      await renderPhotoboothCanvas(offscreen, photos, editorState, 1.5);
      const dataUrl = offscreen.toDataURL('image/png');

      const printWin = window.open('', '_blank', 'width=800,height=900');
      if (!printWin) {
        showToast(
          'warning',
          'Popup Blocked',
          'Please allow popups for this site to open the print dialog, or download the PNG first.'
        );
        return;
      }

      printWin.document.write(`
        <!doctype html>
        <html>
          <head>
            <title>Print — ${workTitle || 'MOCHI BOOTH'}</title>
            <style>
              @page { margin: 12mm; }
              body {
                margin: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 95vh;
                background: #fff;
                font-family: sans-serif;
              }
              img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
                box-shadow: 0 0 1px rgba(0,0,0,0.2);
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print();" />
          </body>
        </html>
      `);
      printWin.document.close();
    } catch {
      showToast('error', 'Print Failed', 'Could not prepare image for printing.');
    }
  };

  return (
    <div className="export-panel-card">
      <div className="export-header">
        <Sparkles size={18} />
        <h3>Export, Save & Print</h3>
      </div>

      <div className="export-controls-grid">
        {/* ARTWORK TITLE FOR GALLERY */}
        <div className="form-field-row">
          <label htmlFor="export-work-title">Creation Title</label>
          <input
            id="export-work-title"
            type="text"
            className="text-input-field"
            value={workTitle}
            onChange={(e) => setWorkTitle(e.target.value)}
            placeholder="e.g., Besties Seoul Strip 💖"
          />
        </div>

        {/* FORMAT SELECTION */}
        <div className="form-field-grid-2">
          <div>
            <label htmlFor="export-format">File Format</label>
            <select
              id="export-format"
              className="select-pill full-width"
              value={editorState.customization.transparentBg ? 'image/png' : format}
              onChange={(e) => {
                const nextFmt = e.target.value as 'image/png' | 'image/jpeg';
                setFormat(nextFmt);
                if (nextFmt === 'image/jpeg' && editorState.customization.transparentBg) {
                  onUpdateTransparentBg(false);
                }
              }}
            >
              <option value="image/png">PNG (Lossless Crisp)</option>
              <option value="image/jpeg">JPEG (Compact Photo)</option>
            </select>
          </div>

          <div>
            <label htmlFor="export-scale">Output Resolution</label>
            <select
              id="export-scale"
              className="select-pill full-width"
              value={resolutionScale}
              onChange={(e) => setResolutionScale(Number(e.target.value) as 1 | 1.5 | 2)}
            >
              <option value={1}>Standard ({layout.canvasWidth}×{layout.canvasHeight}px)</option>
              <option value={1.5}>High-Res 1.5× ({outWidth}×{outHeight}px)</option>
              <option value={2}>Ultra Print 2× ({layout.canvasWidth * 2}×{layout.canvasHeight * 2}px)</option>
            </select>
          </div>
        </div>

        {/* JPEG QUALITY SLIDER */}
        {format === 'image/jpeg' && !editorState.customization.transparentBg && (
          <div className="slider-control-group">
            <div className="slider-label-row">
              <label htmlFor="jpeg-quality-slider">JPEG Quality</label>
              <span>{Math.round(jpegQuality * 100)}%</span>
            </div>
            <input
              id="jpeg-quality-slider"
              type="range"
              min={0.6}
              max={1.0}
              step={0.02}
              value={jpegQuality}
              onChange={(e) => setJpegQuality(Number(e.target.value))}
            />
          </div>
        )}

        {/* TRANSPARENT BACKGROUND OPTION (PNG ONLY) */}
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={editorState.customization.transparentBg}
            onChange={(e) => {
              const checked = e.target.checked;
              onUpdateTransparentBg(checked);
              if (checked) setFormat('image/png');
            }}
          />
          <span>Transparent frame background (PNG only)</span>
        </label>

        <div className="export-spec-summary">
          <FileImage size={15} />
          <span>
            Output: <strong>{outWidth} × {outHeight} px</strong> • Layout: <strong>{layout.name}</strong>
          </span>
        </div>

        {/* PRIMARY DOWNLOAD & GALLERY ACTIONS */}
        <div className="export-actions-stack">
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={handleDownload}
            disabled={isExporting}
          >
            <Download size={19} />
            <span>
              {isExporting
                ? 'Rendering High-Res Photo...'
                : `Download Photo (${
                    editorState.customization.transparentBg || format === 'image/png' ? 'PNG' : 'JPEG'
                  })`}
            </span>
          </button>

          <div className="export-secondary-row">
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={handleSaveToGallery}
              disabled={isSavingGallery}
            >
              <BookmarkPlus size={17} />
              <span>{isSavingGallery ? 'Saving...' : 'Save to Local Gallery'}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrint}
              title="Open print-friendly sheet"
            >
              <Printer size={17} />
              <span>Print</span>
            </button>
          </div>
        </div>

        <p className="privacy-micro-note">
          <CheckCircle2 size={13} /> Rendered 100% locally via HTML5 Canvas—including all filters,
          frames, stickers, and text.
        </p>
      </div>
    </div>
  );
};

