import React, { useCallback, useEffect, useState } from 'react';
import { GalleryWorkItem, PageRoute } from '../types/photobooth';
import {
  clearAllGalleryWorks,
  deleteGalleryWork,
  getAllGalleryWorks,
  renameGalleryWork,
} from '../utils/storage';
import { buildExportFilename } from '../utils/canvasComposer';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from './ToastProvider';
import {
  Download,
  Trash2,
  Edit3,
  Eye,
  Camera,
  HardDrive,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

interface PhotoGalleryProps {
  onNavigate: (page: PageRoute) => void;
  onGalleryCountChange: (count: number) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  onNavigate,
  onGalleryCountChange,
}) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<GalleryWorkItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Lightbox preview modal state
  const [previewItem, setPreviewItem] = useState<GalleryWorkItem | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);

  // Rename inline state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState<string>('');

  // Confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    mode: 'single' | 'all';
    targetId?: string;
    targetTitle?: string;
  }>({ open: false, mode: 'single' });

  const loadGallery = useCallback(async () => {
    setLoading(true);
    setStorageError(null);
    try {
      const works = await getAllGalleryWorks();
      setItems(works);
      onGalleryCountChange(works.length);
    } catch (err) {
      setStorageError(
        err instanceof Error
          ? err.message
          : 'Local browser storage is unavailable or blocked in private mode.'
      );
    } finally {
      setLoading(false);
    }
  }, [onGalleryCountChange]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // Manage ObjectURL lifecycle for full-resolution modal preview
  useEffect(() => {
    if (!previewItem) {
      setPreviewObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(previewItem.blob);
    setPreviewObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [previewItem]);

  const handleDownloadWork = (item: GalleryWorkItem) => {
    try {
      const url = URL.createObjectURL(item.blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      a.download = buildExportFilename('png', safeName || 'mochi-booth');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      showToast('success', 'Downloaded!', `Saved "${item.title}" to your device.`);
    } catch {
      showToast('error', 'Download Failed', 'Could not download this gallery item.');
    }
  };

  const handleSaveRename = async (id: string) => {
    const trimmed = renameDraft.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }
    try {
      await renameGalleryWork(id, trimmed);
      setRenamingId(null);
      await loadGallery();
      showToast('success', 'Renamed ✨', `Updated title to "${trimmed}".`);
    } catch (err) {
      showToast(
        'error',
        'Rename Failed',
        err instanceof Error ? err.message : 'Could not rename item.'
      );
    }
  };

  const handleConfirmDeleteAction = async () => {
    const { mode, targetId } = confirmDelete;
    setConfirmDelete({ open: false, mode: 'single' });

    try {
      if (mode === 'single' && targetId) {
        await deleteGalleryWork(targetId);
        if (previewItem?.id === targetId) setPreviewItem(null);
        await loadGallery();
        showToast('info', 'Creation Deleted', 'Removed item from your local gallery.');
      } else if (mode === 'all') {
        await clearAllGalleryWorks();
        setPreviewItem(null);
        await loadGallery();
        showToast('info', 'Gallery Cleared', 'All local gallery creations have been deleted.');
      }
    } catch (err) {
      showToast(
        'error',
        'Delete Error',
        err instanceof Error ? err.message : 'Could not delete from IndexedDB.'
      );
    }
  };

  return (
    <div className="gallery-page-wrapper">
      <div className="page-hero-header">
        <div className="hero-pill">
          <HardDrive size={15} />
          <span>Stored Privately in Browser IndexedDB</span>
        </div>
        <h1>My Mochi Photo Gallery 🖼️</h1>
        <p>
          All saved photobooth strips live locally on this browser and device. No cloud uploads,
          ever!
        </p>
      </div>

      {/* LOCAL STORAGE TRANSPARENCY NOTICE */}
      <div className="local-storage-banner">
        <AlertTriangle size={18} />
        <div>
          <strong>Local Device Notice:</strong> This gallery is saved inside your current browser’s
          local IndexedDB storage (using efficient binary Blobs). Clearing your browser site data or
          switching devices will not carry these photos over—remember to download your favorites!
        </div>
        {items.length > 0 && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() =>
              setConfirmDelete({
                open: true,
                mode: 'all',
              })
            }
          >
            <Trash2 size={15} />
            <span>Delete All ({items.length})</span>
          </button>
        )}
      </div>

      {storageError && (
        <div className="camera-error-box" role="alert">
          <h3>Storage Unavailable</h3>
          <p>{storageError}</p>
        </div>
      )}

      {loading ? (
        <div className="empty-state-card">
          <div className="empty-emoji">🌸⏳</div>
          <h3>Loading your cute memories...</h3>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-emoji">📸🐰✨</div>
          <h3>Your Mochi Gallery is Empty!</h3>
          <p>
            You haven’t saved any photobooth strips yet. Head to the studio, snap a cute 4-cut
            strip, and click <strong>“Save to Local Gallery”</strong>!
          </p>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('studio')}
          >
            <Camera size={19} />
            <span>Take My First Photobooth Strip</span>
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {items.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <article key={item.id} className="gallery-card">
                <div
                  className="gallery-thumb-box"
                  onClick={() => setPreviewItem(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.title} in full size`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setPreviewItem(item);
                    }
                  }}
                >
                  <img
                    src={item.thumbnailDataUrl}
                    alt={item.title}
                    className="gallery-thumb-img"
                  />
                  <div className="gallery-thumb-hover">
                    <Eye size={22} />
                    <span>View Large</span>
                  </div>
                </div>

                <div className="gallery-card-body">
                  {renamingId === item.id ? (
                    <div className="rename-inline-row">
                      <input
                        type="text"
                        className="text-input-field"
                        value={renameDraft}
                        onChange={(e) => setRenameDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(item.id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        autoFocus
                        aria-label="New title"
                      />
                      <button
                        type="button"
                        className="btn btn-chip btn-chip-primary"
                        onClick={() => handleSaveRename(item.id)}
                        aria-label="Save new title"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-chip"
                        onClick={() => setRenamingId(null)}
                        aria-label="Cancel rename"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="gallery-title-row">
                      <h3>{item.title}</h3>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => {
                          setRenamingId(item.id);
                          setRenameDraft(item.title);
                        }}
                        title="Rename creation"
                        aria-label={`Rename ${item.title}`}
                      >
                        <Edit3 size={15} />
                      </button>
                    </div>
                  )}

                  <div className="gallery-meta-info">
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{item.frameName}</span>
                    <span>•</span>
                    <span>
                      {item.width}×{item.height}px
                    </span>
                  </div>

                  <div className="gallery-card-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDownloadWork(item)}
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setPreviewItem(item)}
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-chip btn-chip-danger"
                      onClick={() =>
                        setConfirmDelete({
                          open: true,
                          mode: 'single',
                          targetId: item.id,
                          targetTitle: item.title,
                        })
                      }
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* FULL-SIZE LIGHTBOX PREVIEW MODAL */}
      {previewItem && previewObjectUrl && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${previewItem.title}`}
          onClick={() => setPreviewItem(null)}
        >
          <div className="lightbox-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div>
                <h3>{previewItem.title}</h3>
                <small>
                  {previewItem.frameName} • {previewItem.width}×{previewItem.height}px
                </small>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setPreviewItem(null)}
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="lightbox-image-stage">
              <img src={previewObjectUrl} alt={previewItem.title} />
            </div>

            <div className="lightbox-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleDownloadWork(previewItem)}
              >
                <Download size={17} />
                <span>Download Full Resolution PNG</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPreviewItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR SINGLE OR BULK DELETE */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        title={
          confirmDelete.mode === 'all'
            ? 'Delete All Saved Gallery Photos? ⚠️'
            : `Delete "${confirmDelete.targetTitle}"?`
        }
        message={
          confirmDelete.mode === 'all'
            ? 'This will permanently remove all saved photobooth creations from your browser storage. Make sure you have downloaded any photos you want to keep!'
            : 'This photobooth strip will be permanently removed from your local browser gallery.'
        }
        confirmLabel={confirmDelete.mode === 'all' ? 'Yes, Delete Everything' : 'Delete Photo'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteAction}
        onCancel={() => setConfirmDelete({ open: false, mode: 'single' })}
      />
    </div>
  );
};

