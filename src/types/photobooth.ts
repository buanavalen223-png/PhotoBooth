export type PageRoute = 'home' | 'studio' | 'frames' | 'gallery' | 'about';

export type PhotoCountMode = 1 | 3 | 4 | 6 | 8;

export type CountdownDuration = 3 | 5 | 10;

export type LayoutId =
  | 'classic-strip-4'
  | 'mini-strip-3'
  | 'double-strip-8'
  | 'square-collage-4'
  | 'grid-2x2'
  | 'grid-2x3'
  | 'grid-3x2'
  | 'single-portrait'
  | 'polaroid-style'
  | 'free-collage';

export interface PhotoSlotRect {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number; // in degrees, used by free-collage
  borderRadius?: number;
}

export interface LayoutConfig {
  id: LayoutId;
  name: string;
  subtitle: string;
  photoCount: PhotoCountMode;
  canvasWidth: number;
  canvasHeight: number;
  aspectLabel: string;
  defaultPadding: number;
  defaultGap: number;
  bottomFooterHeight: number;
}

export type FrameCategory =
  | 'All'
  | 'Pink Cute'
  | 'Korean Classic'
  | 'Purple Dream'
  | 'Blue Sky'
  | 'Strawberry Milk'
  | 'Coquette Ribbon'
  | 'Minimalist White'
  | 'Black Chic'
  | 'Retro Film'
  | 'Flower Garden'
  | 'Birthday'
  | 'Best Friends'
  | 'Couple Memories'
  | 'Graduation'
  | 'Halloween'
  | 'Holiday';

export interface FrameTheme {
  id: string;
  name: string;
  category: Exclude<FrameCategory, 'All'>;
  bgColor: string;
  secondaryBg?: string;
  patternType:
    | 'solid'
    | 'dots'
    | 'grid'
    | 'stripes'
    | 'gradient'
    | 'film'
    | 'stars'
    | 'hearts'
    | 'flowers'
    | 'ribbons';
  borderColor: string;
  textColor: string;
  accentColor: string;
  defaultHeaderText: string;
  defaultFooterText: string;
  badgeIcon: string;
  description: string;
}

export type FilterId =
  | 'original'
  | 'warm'
  | 'cool'
  | 'vintage'
  | 'retro'
  | 'soft-pink'
  | 'lavender'
  | 'grayscale'
  | 'sepia'
  | 'bright'
  | 'contrast'
  | 'film'
  | 'dreamy-pastel';

// ==========================================
// LIVE AR CAMERA FILTERS & MULTI-EFFECT TYPES
// ==========================================
export type ARFilterCategoryTab =
  | 'All'
  | 'Cute'
  | 'Animal'
  | 'Hair'
  | 'Accessories'
  | 'Makeup'
  | 'Fantasy'
  | 'Seasonal'
  | 'Favorites';

/**
 * Each AR filter belongs to an attachment slot so users can combine compatible effects
 * (e.g. Bunny Ears + Rosy Cheeks + Floating Hearts) without colliding two wigs or two glasses.
 */
export type AREffectSlot =
  | 'ears'
  | 'nose'
  | 'hair'
  | 'headwear'
  | 'eyewear'
  | 'cheeks'
  | 'ambient';

export type ARFilterId =
  // A. Animal Filters (9)
  | 'bunny-ears'
  | 'cat-ears-ar'
  | 'puppy-ears'
  | 'bear-ears'
  | 'fox-ears'
  | 'deer-antlers'
  | 'cat-nose-whiskers'
  | 'bunny-nose'
  | 'puppy-nose'
  // B. Hair and Wig Filters (8)
  | 'fluffy-curly-brown-hair'
  | 'curly-black-hair'
  | 'soft-wavy-hair'
  | 'cute-blonde-bob'
  | 'pink-curly-hair'
  | 'purple-wavy-hair'
  | 'straight-hair-bangs'
  | 'fluffy-short-hair'
  // C. Cute Accessories (10)
  | 'coquette-pink-bow'
  | 'double-hair-bows'
  | 'flower-crown'
  | 'sparkling-tiara'
  | 'angel-halo'
  | 'butterfly-hair-clips'
  | 'heart-glasses'
  | 'round-glasses'
  | 'star-glasses'
  | 'cute-beret'
  // D. Cute Makeup Effects (8)
  | 'rosy-pink-cheeks'
  | 'peach-blush'
  | 'tiny-nose-blush'
  | 'cute-freckles'
  | 'heart-cheeks'
  | 'star-cheek-stickers'
  | 'glitter-under-eyes'
  | 'soft-pink-makeup'
  // E. Fantasy Filters (8)
  | 'floating-hearts'
  | 'magical-sparkles'
  | 'fairy-dust'
  | 'butterfly-sparkles'
  | 'cherry-blossom-petals'
  | 'angel-sparkles'
  | 'rainbow-glow'
  | 'floating-stars'
  // F. Fun and Seasonal Filters (8)
  | 'birthday-crown'
  | 'party-confetti'
  | 'graduation-cap'
  | 'santa-hat'
  | 'witch-hat'
  | 'retro-film-ar'
  | 'vhs-effect-ar'
  | 'dreamy-glow-ar';

export interface ARFilterDefinition {
  id: ARFilterId;
  name: string;
  category: Exclude<ARFilterCategoryTab, 'All' | 'Favorites' | 'Cute'>;
  isCuteFeatured: boolean;
  slot: AREffectSlot;
  icon: string;
  accentColor: string;
  description: string;
  requiresFaceTracking: boolean;
}

export type CameraColorToneId =
  | 'original'
  | 'warm'
  | 'cool'
  | 'vintage'
  | 'soft-pink'
  | 'lavender'
  | 'film'
  | 'bw'
  | 'sepia'
  | 'dreamy-pastel';

export interface CameraColorToneDefinition {
  id: CameraColorToneId;
  name: string;
  badge: string;
  cssFilter: string;
  tintColor: string | null;
  tintAlpha: number;
}

export interface NormalizedPoint {
  x: number;
  y: number;
  z?: number;
}

export interface SmoothedFaceMetrics {
  faceCenter: NormalizedPoint;
  foreheadTop: NormalizedPoint;
  crownTop: NormalizedPoint;
  leftEye: NormalizedPoint;
  rightEye: NormalizedPoint;
  eyeCenter: NormalizedPoint;
  noseTip: NormalizedPoint;
  noseBridge: NormalizedPoint;
  leftCheek: NormalizedPoint;
  rightCheek: NormalizedPoint;
  leftTemple: NormalizedPoint;
  rightTemple: NormalizedPoint;
  chinBottom: NormalizedPoint;
  mouthCenter: NormalizedPoint;
  faceWidth: number;
  faceHeight: number;
  eyeDistance: number;
  rollAngleRad: number;
}

export interface ImageAdjustments {
  filter: FilterId;
  brightness: number; // -50 to 50, default 0
  contrast: number; // -50 to 50, default 0
  saturation: number; // -50 to 50, default 0
  zoom: number; // 1 to 2.5, default 1
  panX: number; // -0.5 to 0.5, default 0
  panY: number; // -0.5 to 0.5, default 0
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  width: number;
  height: number;
  appliedEffects?: string[];
  appliedColorTone?: CameraColorToneId;
}

export type StickerType =
  | 'heart-pink'
  | 'heart-sparkle'
  | 'star-gold'
  | 'star-pastel'
  | 'flower-cherry'
  | 'flower-daisy'
  | 'bow-coquette'
  | 'bow-lavender'
  | 'sparkle-magic'
  | 'face-mochi'
  | 'face-wink'
  | 'cat-ears'
  | 'bunny-ears'
  | 'doodle-crown'
  | 'doodle-cloud'
  | 'doodle-music';

export interface StickerItem {
  id: string;
  type: StickerType;
  label: string;
  x: number; // normalized 0..1 relative to canvas width
  y: number; // normalized 0..1 relative to canvas height
  scale: number; // 0.4 to 3.0, default 1
  rotation: number; // -180 to 180 degrees
}

export interface TextOverlayItem {
  id: string;
  text: string;
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  color: string;
  fontSize: number; // in canvas base px (e.g. 24 - 84)
  fontFamily: 'Nunito' | 'Quicksand' | 'Poppins' | 'Fredoka';
  rotation: number;
  bgPill: boolean;
}

export interface BoothCustomization {
  layoutId: LayoutId;
  frameId: string;
  customBgColor: string | null; // overrides frame bgColor if set
  photoGap: number; // 8 to 48
  borderThickness: number; // 0 to 20
  borderRadius: number; // 0 to 36
  showDateStamp: boolean;
  customFooterCaption: string;
  transparentBg: boolean;
}

export interface EditorState {
  adjustments: ImageAdjustments;
  stickers: StickerItem[];
  texts: TextOverlayItem[];
  customization: BoothCustomization;
}

export interface GalleryWorkItem {
  id: string;
  title: string;
  createdAt: number;
  layoutId: LayoutId;
  frameName: string;
  blob: Blob;
  thumbnailDataUrl: string;
  width: number;
  height: number;
}

export interface CameraResolutionOption {
  label: string;
  width: number;
  height: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
