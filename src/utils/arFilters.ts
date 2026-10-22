import {
  ARFilterCategoryTab,
  ARFilterDefinition,
  ARFilterId,
  CameraColorToneDefinition,
  CameraColorToneId,
  NormalizedPoint,
  SmoothedFaceMetrics,
} from '../types/photobooth';

export const AR_FILTER_TABS: ARFilterCategoryTab[] = [
  'All',
  'Cute',
  'Animal',
  'Hair',
  'Accessories',
  'Makeup',
  'Fantasy',
  'Seasonal',
  'Favorites',
];

export const CAMERA_COLOR_TONES: CameraColorToneDefinition[] = [
  {
    id: 'original',
    name: 'Original',
    badge: '✨',
    cssFilter: 'none',
    tintColor: null,
    tintAlpha: 0,
  },
  {
    id: 'warm',
    name: 'Warm',
    badge: '🍑',
    cssFilter: 'sepia(16%) saturate(118%) brightness(104%)',
    tintColor: '#FFB88C',
    tintAlpha: 0.1,
  },
  {
    id: 'cool',
    name: 'Cool',
    badge: '🧊',
    cssFilter: 'saturate(106%) brightness(103%) hue-rotate(8deg)',
    tintColor: '#99D6FF',
    tintAlpha: 0.12,
  },
  {
    id: 'vintage',
    name: 'Vintage',
    badge: '🎞️',
    cssFilter: 'sepia(36%) contrast(94%) brightness(99%) saturate(88%)',
    tintColor: '#F4E2C6',
    tintAlpha: 0.14,
  },
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    badge: '🌸',
    cssFilter: 'brightness(107%) contrast(97%) saturate(112%)',
    tintColor: '#FFB6D9',
    tintAlpha: 0.15,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    badge: '💜',
    cssFilter: 'brightness(105%) saturate(110%)',
    tintColor: '#C9B3FF',
    tintAlpha: 0.16,
  },
  {
    id: 'film',
    name: 'Film',
    badge: '📷',
    cssFilter: 'contrast(114%) saturate(118%) sepia(12%)',
    tintColor: '#FFE0B5',
    tintAlpha: 0.08,
  },
  {
    id: 'bw',
    name: 'Black & White',
    badge: '🖤',
    cssFilter: 'grayscale(100%) contrast(108%)',
    tintColor: null,
    tintAlpha: 0,
  },
  {
    id: 'sepia',
    name: 'Sepia',
    badge: '🍂',
    cssFilter: 'sepia(82%) contrast(104%) brightness(98%)',
    tintColor: null,
    tintAlpha: 0,
  },
  {
    id: 'dreamy-pastel',
    name: 'Dreamy Pastel',
    badge: '☁️',
    cssFilter: 'brightness(110%) contrast(94%) saturate(108%)',
    tintColor: '#FFD6F0',
    tintAlpha: 0.14,
  },
];

export function getCameraColorTone(id: CameraColorToneId): CameraColorToneDefinition {
  return CAMERA_COLOR_TONES.find((t) => t.id === id) || CAMERA_COLOR_TONES[0];
}

/**
 * 51 Distinct AR Filters grouped across Animal (9), Hair (8), Accessories (10),
 * Makeup (8), Fantasy (8), and Seasonal/Fun (8).
 */
export const AR_FILTER_CATALOG: ARFilterDefinition[] = [
  // ==========================================
  // A. ANIMAL FILTERS (9)
  // ==========================================
  {
    id: 'bunny-ears',
    name: 'Bunny Ears',
    category: 'Animal',
    isCuteFeatured: true,
    slot: 'ears',
    icon: '🐰',
    accentColor: '#FFC9DE',
    description: 'Plush white & baby-pink bunny ears that tilt with your head.',
    requiresFaceTracking: true,
  },
  {
    id: 'cat-ears-ar',
    name: 'Cat Ears',
    category: 'Animal',
    isCuteFeatured: true,
    slot: 'ears',
    icon: '🐱',
    accentColor: '#FFB3C6',
    description: 'Playful neko ears with soft pink inner fluff.',
    requiresFaceTracking: true,
  },
  {
    id: 'puppy-ears',
    name: 'Puppy Ears',
    category: 'Animal',
    isCuteFeatured: true,
    slot: 'ears',
    icon: '🐶',
    accentColor: '#D4A373',
    description: 'Floppy caramel puppy ears for sweet golden-retriever vibes.',
    requiresFaceTracking: true,
  },
  {
    id: 'bear-ears',
    name: 'Bear Ears',
    category: 'Animal',
    isCuteFeatured: true,
    slot: 'ears',
    icon: '🐻',
    accentColor: '#C68B59',
    description: 'Cozy round teddy bear ears on top of your head.',
    requiresFaceTracking: true,
  },
  {
    id: 'fox-ears',
    name: 'Fox Ears',
    category: 'Animal',
    isCuteFeatured: false,
    slot: 'ears',
    icon: '🦊',
    accentColor: '#FF8856',
    description: 'Pointed woodland fox ears with creamy tips.',
    requiresFaceTracking: true,
  },
  {
    id: 'deer-antlers',
    name: 'Deer Antlers',
    category: 'Animal',
    isCuteFeatured: false,
    slot: 'ears',
    icon: '🦌',
    accentColor: '#B08968',
    description: 'Woodland fawn antlers with tiny pastel blossoms.',
    requiresFaceTracking: true,
  },
  {
    id: 'cat-nose-whiskers',
    name: 'Cat Nose & Whiskers',
    category: 'Animal',
    isCuteFeatured: true,
    slot: 'nose',
    icon: '😺',
    accentColor: '#FF85A9',
    description: 'Pink button kitty nose and twitching cheek whiskers.',
    requiresFaceTracking: true,
  },
  {
    id: 'bunny-nose',
    name: 'Bunny Nose',
    category: 'Animal',
    isCuteFeatured: true,
    slot: 'nose',
    icon: '🐇',
    accentColor: '#FF9EBB',
    description: 'Sweet heart-shaped bunny nose and cute buck teeth.',
    requiresFaceTracking: true,
  },
  {
    id: 'puppy-nose',
    name: 'Puppy Nose',
    category: 'Animal',
    isCuteFeatured: false,
    slot: 'nose',
    icon: '🐾',
    accentColor: '#6D4C41',
    description: 'Glossy chocolate puppy nose with cute snout spots.',
    requiresFaceTracking: true,
  },

  // ==========================================
  // B. HAIR AND WIG FILTERS (8)
  // ==========================================
  {
    id: 'fluffy-curly-brown-hair',
    name: 'Fluffy Curly Brown Hair',
    category: 'Hair',
    isCuteFeatured: true,
    slot: 'hair',
    icon: '🧸',
    accentColor: '#8D5B4C',
    description: 'Voluminous teddy-brown curls framing your forehead & cheeks.',
    requiresFaceTracking: true,
  },
  {
    id: 'curly-black-hair',
    name: 'Curly Black Hair',
    category: 'Hair',
    isCuteFeatured: false,
    slot: 'hair',
    icon: '🖤',
    accentColor: '#2B2B36',
    description: 'Soft jet-black cloud curls that follow your head tilt.',
    requiresFaceTracking: true,
  },
  {
    id: 'soft-wavy-hair',
    name: 'Soft Wavy Hair',
    category: 'Hair',
    isCuteFeatured: true,
    slot: 'hair',
    icon: '🌊',
    accentColor: '#6F4E37',
    description: 'Romantic chestnut K-drama waves cascading past the temples.',
    requiresFaceTracking: true,
  },
  {
    id: 'cute-blonde-bob',
    name: 'Cute Blonde Bob',
    category: 'Hair',
    isCuteFeatured: true,
    slot: 'hair',
    icon: '🌼',
    accentColor: '#F4D35E',
    description: 'Honey-blonde chin-length bob with full bangs.',
    requiresFaceTracking: true,
  },
  {
    id: 'pink-curly-hair',
    name: 'Pink Curly Hair',
    category: 'Hair',
    isCuteFeatured: true,
    slot: 'hair',
    icon: '🌸',
    accentColor: '#FF85A9',
    description: 'Strawberry cotton-candy curls with anime twin volume.',
    requiresFaceTracking: true,
  },
  {
    id: 'purple-wavy-hair',
    name: 'Purple Wavy Hair',
    category: 'Hair',
    isCuteFeatured: true,
    slot: 'hair',
    icon: '🔮',
    accentColor: '#B388EB',
    description: 'Dreamy lilac-lavender idol waves with curtain bangs.',
    requiresFaceTracking: true,
  },
  {
    id: 'straight-hair-bangs',
    name: 'Straight Hair with Bangs',
    category: 'Hair',
    isCuteFeatured: false,
    slot: 'hair',
    icon: '💇‍♀️',
    accentColor: '#3D314A',
    description: 'Sleek hime-cut straight locks with neat full fringe.',
    requiresFaceTracking: true,
  },
  {
    id: 'fluffy-short-hair',
    name: 'Fluffy Short Hair',
    category: 'Hair',
    isCuteFeatured: false,
    slot: 'hair',
    icon: '☁️',
    accentColor: '#7F5539',
    description: 'Airy boyish/pixie layered fluff crown.',
    requiresFaceTracking: true,
  },

  // ==========================================
  // C. CUTE ACCESSORIES (10)
  // ==========================================
  {
    id: 'coquette-pink-bow',
    name: 'Coquette Pink Bow',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '🎀',
    accentColor: '#FF7AA8',
    description: 'Oversized satin coquette ribbon perched on your crown.',
    requiresFaceTracking: true,
  },
  {
    id: 'double-hair-bows',
    name: 'Double Hair Bows',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '💞',
    accentColor: '#FF9EBB',
    description: 'Twin pastel pink ribbons clipped on both sides of your hair.',
    requiresFaceTracking: true,
  },
  {
    id: 'flower-crown',
    name: 'Flower Crown',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '💐',
    accentColor: '#FFB3C6',
    description: 'Spring meadow garland of daisies, roses, and leaves.',
    requiresFaceTracking: true,
  },
  {
    id: 'sparkling-tiara',
    name: 'Sparkling Tiara',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '👑',
    accentColor: '#FFD166',
    description: 'Crystal princess tiara with pink heart gemstone.',
    requiresFaceTracking: true,
  },
  {
    id: 'angel-halo',
    name: 'Angel Halo',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '😇',
    accentColor: '#FFE066',
    description: 'Glowing golden halo floating above your head.',
    requiresFaceTracking: true,
  },
  {
    id: 'butterfly-hair-clips',
    name: 'Butterfly Hair Clips',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '🦋',
    accentColor: '#C8B6FF',
    description: 'Y2K pastel butterfly clips along your temples.',
    requiresFaceTracking: true,
  },
  {
    id: 'heart-glasses',
    name: 'Heart Glasses',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'eyewear',
    icon: '🕶️',
    accentColor: '#FF5C93',
    description: 'Translucent strawberry heart-shaped frames over your eyes.',
    requiresFaceTracking: true,
  },
  {
    id: 'round-glasses',
    name: 'Round Glasses',
    category: 'Accessories',
    isCuteFeatured: false,
    slot: 'eyewear',
    icon: '👓',
    accentColor: '#E0A96D',
    description: 'Aesthetic Seoul café gold-wire round spectacles.',
    requiresFaceTracking: true,
  },
  {
    id: 'star-glasses',
    name: 'Star Glasses',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'eyewear',
    icon: '🤩',
    accentColor: '#FFD166',
    description: 'Pop-star golden star-shaped tinted party glasses.',
    requiresFaceTracking: true,
  },
  {
    id: 'cute-beret',
    name: 'Cute Beret',
    category: 'Accessories',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '🎨',
    accentColor: '#F4A2B8',
    description: 'Pastel strawberry artist beret tilted stylishly.',
    requiresFaceTracking: true,
  },

  // ==========================================
  // D. CUTE MAKEUP EFFECTS (8)
  // ==========================================
  {
    id: 'rosy-pink-cheeks',
    name: 'Rosy Pink Cheeks',
    category: 'Makeup',
    isCuteFeatured: true,
    slot: 'cheeks',
    icon: '😊',
    accentColor: '#FF85A9',
    description: 'Soft airbrushed baby-pink K-beauty cheek blush.',
    requiresFaceTracking: true,
  },
  {
    id: 'peach-blush',
    name: 'Peach Blush',
    category: 'Makeup',
    isCuteFeatured: true,
    slot: 'cheeks',
    icon: '🍑',
    accentColor: '#FF9E6D',
    description: 'Warm sunkissed coral-peach glow across both cheeks.',
    requiresFaceTracking: true,
  },
  {
    id: 'tiny-nose-blush',
    name: 'Tiny Nose Blush',
    category: 'Makeup',
    isCuteFeatured: true,
    slot: 'cheeks',
    icon: '🌷',
    accentColor: '#FF7597',
    description: 'Dainty anime blush across the nose bridge and cheeks.',
    requiresFaceTracking: true,
  },
  {
    id: 'cute-freckles',
    name: 'Cute Freckles',
    category: 'Makeup',
    isCuteFeatured: true,
    slot: 'cheeks',
    icon: '🍪',
    accentColor: '#C68B59',
    description: 'Sun-dappled faux freckles across the nose and cheeks.',
    requiresFaceTracking: true,
  },
  {
    id: 'heart-cheeks',
    name: 'Heart Cheeks',
    category: 'Makeup',
    isCuteFeatured: true,
    slot: 'cheeks',
    icon: '🥰',
    accentColor: '#FF5C93',
    description: 'Adorable pastel pink heart stamps on both cheeks.',
    requiresFaceTracking: true,
  },
  {
    id: 'star-cheek-stickers',
    name: 'Star Cheek Stickers',
    category: 'Makeup',
    isCuteFeatured: true,
    slot: 'cheeks',
    icon: '⭐',
    accentColor: '#FFD166',
    description: 'Colorful Y2K star & mini sparkle stickers on your cheeks.',
    requiresFaceTracking: true,
  },
  {
    id: 'glitter-under-eyes',
    name: 'Glitter Under Eyes',
    category: 'Makeup',
    isCuteFeatured: true,
    slot: 'cheeks',
    icon: '✨',
    accentColor: '#E2C2FF',
    description: 'K-pop idol holographic gems and shimmer under the eyes.',
    requiresFaceTracking: true,
  },
  {
    id: 'soft-pink-makeup',
    name: 'Soft Pink Makeup',
    category: 'Makeup',
    isCuteFeatured: true,
    slot: 'cheeks',
    icon: '💄',
    accentColor: '#FF6B9E',
    description: 'Rosy cheeks paired with a subtle dewy lip & highlight tint.',
    requiresFaceTracking: true,
  },

  // ==========================================
  // E. FANTASY FILTERS (8)
  // ==========================================
  {
    id: 'floating-hearts',
    name: 'Floating Hearts',
    category: 'Fantasy',
    isCuteFeatured: true,
    slot: 'ambient',
    icon: '💖',
    accentColor: '#FF75A0',
    description: 'Dreamy pastel hearts gently rising around your head.',
    requiresFaceTracking: false,
  },
  {
    id: 'magical-sparkles',
    name: 'Magical Sparkles',
    category: 'Fantasy',
    isCuteFeatured: true,
    slot: 'ambient',
    icon: '✨',
    accentColor: '#FFE066',
    description: 'Twinkling four-point golden & pink stars around you.',
    requiresFaceTracking: false,
  },
  {
    id: 'fairy-dust',
    name: 'Fairy Dust',
    category: 'Fantasy',
    isCuteFeatured: true,
    slot: 'ambient',
    icon: '🧚‍♀️',
    accentColor: '#DCCFFF',
    description: 'Luminous pixie shimmer aura trailing your face.',
    requiresFaceTracking: false,
  },
  {
    id: 'butterfly-sparkles',
    name: 'Butterfly Sparkles',
    category: 'Fantasy',
    isCuteFeatured: true,
    slot: 'ambient',
    icon: '🦋',
    accentColor: '#C8B6FF',
    description: 'Glowing pastel butterflies fluttering around the frame.',
    requiresFaceTracking: false,
  },
  {
    id: 'cherry-blossom-petals',
    name: 'Cherry Blossom Petals',
    category: 'Fantasy',
    isCuteFeatured: true,
    slot: 'ambient',
    icon: '🌸',
    accentColor: '#FFB3C6',
    description: 'Drifting pink sakura petals in a spring breeze.',
    requiresFaceTracking: false,
  },
  {
    id: 'angel-sparkles',
    name: 'Angel Sparkles',
    category: 'Fantasy',
    isCuteFeatured: false,
    slot: 'ambient',
    icon: '🪽',
    accentColor: '#FFF3B0',
    description: 'Ethereal pearl feathers and soft celestial light rays.',
    requiresFaceTracking: false,
  },
  {
    id: 'rainbow-glow',
    name: 'Rainbow Glow',
    category: 'Fantasy',
    isCuteFeatured: false,
    slot: 'ambient',
    icon: '🌈',
    accentColor: '#A8DADC',
    description: 'Soft pastel rainbow prism halo and lens flare.',
    requiresFaceTracking: false,
  },
  {
    id: 'floating-stars',
    name: 'Floating Stars',
    category: 'Fantasy',
    isCuteFeatured: true,
    slot: 'ambient',
    icon: '🌟',
    accentColor: '#FFD166',
    description: 'Little shooting stars and crescent moons orbiting around.',
    requiresFaceTracking: false,
  },

  // ==========================================
  // F. FUN AND SEASONAL FILTERS (8)
  // ==========================================
  {
    id: 'birthday-crown',
    name: 'Birthday Crown',
    category: 'Seasonal',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '🎂',
    accentColor: '#FF6B9E',
    description: 'Festive “HAPPY B-DAY” party crown with pastel candles.',
    requiresFaceTracking: true,
  },
  {
    id: 'party-confetti',
    name: 'Party Confetti',
    category: 'Seasonal',
    isCuteFeatured: false,
    slot: 'ambient',
    icon: '🎉',
    accentColor: '#FFD166',
    description: 'Celebration confetti ribbons & streamers popping live.',
    requiresFaceTracking: false,
  },
  {
    id: 'graduation-cap',
    name: 'Graduation Cap',
    category: 'Seasonal',
    isCuteFeatured: false,
    slot: 'headwear',
    icon: '🎓',
    accentColor: '#2B3A55',
    description: 'Academic mortarboard cap with golden tassel.',
    requiresFaceTracking: true,
  },
  {
    id: 'santa-hat',
    name: 'Santa Hat',
    category: 'Seasonal',
    isCuteFeatured: true,
    slot: 'headwear',
    icon: '🎅',
    accentColor: '#E63946',
    description: 'Cozy red & fluffy white winter holiday Santa hat.',
    requiresFaceTracking: true,
  },
  {
    id: 'witch-hat',
    name: 'Witch Hat',
    category: 'Seasonal',
    isCuteFeatured: false,
    slot: 'headwear',
    icon: '🧙‍♀️',
    accentColor: '#5A3E85',
    description: 'Spooky-cute plum Halloween witch hat with star buckle.',
    requiresFaceTracking: true,
  },
  {
    id: 'retro-film-ar',
    name: 'Retro Film',
    category: 'Seasonal',
    isCuteFeatured: false,
    slot: 'ambient',
    icon: '🎞️',
    accentColor: '#FF9E6D',
    description: '90s disposable camera viewfinder & warm light leak.',
    requiresFaceTracking: false,
  },
  {
    id: 'vhs-effect-ar',
    name: 'VHS Effect',
    category: 'Seasonal',
    isCuteFeatured: false,
    slot: 'ambient',
    icon: '📼',
    accentColor: '#99D6FF',
    description: 'Retro camcorder PLAY timestamp & scanline aesthetic.',
    requiresFaceTracking: false,
  },
  {
    id: 'dreamy-glow-ar',
    name: 'Dreamy Glow',
    category: 'Seasonal',
    isCuteFeatured: true,
    slot: 'ambient',
    icon: '💫',
    accentColor: '#FFC9DE',
    description: 'Soft-focusrose vignette and angel bloom border.',
    requiresFaceTracking: false,
  },
];

export function getARFilterById(id: ARFilterId): ARFilterDefinition | undefined {
  return AR_FILTER_CATALOG.find((f) => f.id === id);
}

/**
 * Toggle an AR filter inside the active set while preventing colliding items in the same slot.
 * For example, selecting 'cat-ears-ar' replaces 'bunny-ears' (both in 'ears' slot),
 * while keeping 'rosy-pink-cheeks' ('cheeks' slot) and 'floating-hearts' ('ambient' slot) active!
 */
export function toggleCompatibleARFilter(
  currentActive: ARFilterId[],
  targetId: ARFilterId
): ARFilterId[] {
  if (currentActive.includes(targetId)) {
    return currentActive.filter((id) => id !== targetId);
  }
  const targetDef = getARFilterById(targetId);
  if (!targetDef) return currentActive;

  // Remove any existing filter occupying the exact same slot so accessories don't collide
  const withoutSameSlot = currentActive.filter((id) => {
    const def = getARFilterById(id);
    return def && def.slot !== targetDef.slot;
  });

  return [...withoutSameSlot, targetId];
}

// ==========================================
// FACE LANDMARK GEOMETRY & SMOOTHING
// ==========================================
function avgPoint(points: NormalizedPoint[]): NormalizedPoint {
  const n = points.length || 1;
  let sx = 0;
  let sy = 0;
  let sz = 0;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
    sz += p.z || 0;
  }
  return { x: sx / n, y: sy / n, z: sz / n };
}

function dist2D(a: NormalizedPoint, b: NormalizedPoint, width: number, height: number): number {
  const dx = (a.x - b.x) * width;
  const dy = (a.y - b.y) * height;
  return Math.hypot(dx, dy);
}

/**
 * Extracts key anatomical anchors from MediaPipe 478 Face Landmarks in pixel coordinates.
 */
export function extractFaceMetrics(
  landmarks: NormalizedPoint[],
  canvasWidth: number,
  canvasHeight: number
): SmoothedFaceMetrics | null {
  if (!landmarks || landmarks.length < 400) return null;

  const toPx = (idx: number): NormalizedPoint => {
    const pt = landmarks[idx] || { x: 0.5, y: 0.5, z: 0 };
    return {
      x: pt.x * canvasWidth,
      y: pt.y * canvasHeight,
      z: pt.z || 0,
    };
  };

  const foreheadTop = toPx(10);
  const chinBottom = toPx(152);
  const leftEyeOuter = toPx(33);
  const leftEyeInner = toPx(133);
  const rightEyeInner = toPx(362);
  const rightEyeOuter = toPx(263);

  const leftEye = avgPoint([leftEyeOuter, leftEyeInner, toPx(159), toPx(145)]);
  const rightEye = avgPoint([rightEyeOuter, rightEyeInner, toPx(386), toPx(374)]);
  const eyeCenter = avgPoint([leftEye, rightEye]);

  const noseTip = toPx(1);
  const noseBridge = toPx(6);
  const leftCheek = avgPoint([toPx(205), toPx(50), toPx(187)]);
  const rightCheek = avgPoint([toPx(425), toPx(280), toPx(411)]);
  const leftTemple = toPx(234);
  const rightTemple = toPx(454);
  const mouthCenter = avgPoint([toPx(13), toPx(14)]);
  const faceCenter = avgPoint([foreheadTop, chinBottom, leftTemple, rightTemple]);

  const faceWidth = Math.max(40, dist2D(landmarks[234], landmarks[454], canvasWidth, canvasHeight));
  const faceHeight = Math.max(50, dist2D(landmarks[10], landmarks[152], canvasWidth, canvasHeight));
  const eyeDistance = Math.max(20, Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y));

  const rollAngleRad = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

  // Crown point sits slightly above the forehead top along the head's up-axis
  const upAngle = rollAngleRad - Math.PI / 2;
  const crownOffset = faceHeight * 0.28;
  const crownTop: NormalizedPoint = {
    x: foreheadTop.x + Math.cos(upAngle) * crownOffset,
    y: foreheadTop.y + Math.sin(upAngle) * crownOffset,
  };

  return {
    faceCenter,
    foreheadTop,
    crownTop,
    leftEye,
    rightEye,
    eyeCenter,
    noseTip,
    noseBridge,
    leftCheek,
    rightCheek,
    leftTemple,
    rightTemple,
    chinBottom,
    mouthCenter,
    faceWidth,
    faceHeight,
    eyeDistance,
    rollAngleRad,
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPoint(a: NormalizedPoint, b: NormalizedPoint, t: number): NormalizedPoint {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z || 0, b.z || 0, t),
  };
}

/**
 * Exponential moving average (EMA) smoothing between previous & current frame face metrics
 * so ears, wigs, glasses, and blush move fluidly without jitter.
 */
export function smoothFaceMetricsList(
  prevList: SmoothedFaceMetrics[],
  nextList: SmoothedFaceMetrics[],
  alpha = 0.48
): SmoothedFaceMetrics[] {
  return nextList.map((next, idx) => {
    const prev = prevList[idx];
    if (!prev) return next;
    // If face jumped a large distance, snap faster
    const jump = Math.hypot(
      next.faceCenter.x - prev.faceCenter.x,
      next.faceCenter.y - prev.faceCenter.y
    );
    const effectiveAlpha = jump > next.faceWidth * 0.45 ? 0.85 : alpha;

    return {
      faceCenter: lerpPoint(prev.faceCenter, next.faceCenter, effectiveAlpha),
      foreheadTop: lerpPoint(prev.foreheadTop, next.foreheadTop, effectiveAlpha),
      crownTop: lerpPoint(prev.crownTop, next.crownTop, effectiveAlpha),
      leftEye: lerpPoint(prev.leftEye, next.leftEye, effectiveAlpha),
      rightEye: lerpPoint(prev.rightEye, next.rightEye, effectiveAlpha),
      eyeCenter: lerpPoint(prev.eyeCenter, next.eyeCenter, effectiveAlpha),
      noseTip: lerpPoint(prev.noseTip, next.noseTip, effectiveAlpha),
      noseBridge: lerpPoint(prev.noseBridge, next.noseBridge, effectiveAlpha),
      leftCheek: lerpPoint(prev.leftCheek, next.leftCheek, effectiveAlpha),
      rightCheek: lerpPoint(prev.rightCheek, next.rightCheek, effectiveAlpha),
      leftTemple: lerpPoint(prev.leftTemple, next.leftTemple, effectiveAlpha),
      rightTemple: lerpPoint(prev.rightTemple, next.rightTemple, effectiveAlpha),
      chinBottom: lerpPoint(prev.chinBottom, next.chinBottom, effectiveAlpha),
      mouthCenter: lerpPoint(prev.mouthCenter, next.mouthCenter, effectiveAlpha),
      faceWidth: lerp(prev.faceWidth, next.faceWidth, effectiveAlpha),
      faceHeight: lerp(prev.faceHeight, next.faceHeight, effectiveAlpha),
      eyeDistance: lerp(prev.eyeDistance, next.eyeDistance, effectiveAlpha),
      rollAngleRad: lerp(prev.rollAngleRad, next.rollAngleRad, effectiveAlpha),
    };
  });
}

// ==========================================
// REAL-TIME CANVAS AR FILTER RENDERER
// ==========================================

function drawFourStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx - r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCuteHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.65);
  ctx.bezierCurveTo(cx - size * 1.1, cy - size * 0.15, cx - size * 0.55, cy - size * 0.95, cx, cy - size * 0.28);
  ctx.bezierCurveTo(cx + size * 0.55, cy - size * 0.95, cx + size * 1.1, cy - size * 0.15, cx, cy + size * 0.65);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFivePointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  fill: string,
  stroke?: string
) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1.5, outerR * 0.12);
    ctx.stroke();
  }
  ctx.restore();
}

function drawButterflyShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color1: string,
  color2: string,
  angle = 0
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = color1;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(1.5, size * 0.08);

  // Upper wings
  ctx.beginPath();
  ctx.ellipse(-size * 0.55, -size * 0.35, size * 0.55, size * 0.4, -0.4, 0, Math.PI * 2);
  ctx.ellipse(size * 0.55, -size * 0.35, size * 0.55, size * 0.4, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Lower wings
  ctx.fillStyle = color2;
  ctx.beginPath();
  ctx.ellipse(-size * 0.42, size * 0.35, size * 0.38, size * 0.3, 0.3, 0, Math.PI * 2);
  ctx.ellipse(size * 0.42, size * 0.35, size * 0.38, size * 0.3, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.fillStyle = '#393343';
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.1, size * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Renders a single face-tracked AR filter onto a detected face using its smoothed landmarks.
 */
function renderFaceTrackedFilterOnFace(
  ctx: CanvasRenderingContext2D,
  filterId: ARFilterId,
  face: SmoothedFaceMetrics,
  nowMs: number
) {
  const fw = face.faceWidth;
  const fh = face.faceHeight;
  const ed = face.eyeDistance;
  const roll = face.rollAngleRad;
  const bob = Math.sin(nowMs * 0.004) * (fw * 0.015);

  ctx.save();

  switch (filterId) {
    // ==========================================
    // A. ANIMAL FILTERS
    // ==========================================
    case 'bunny-ears': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      const earW = fw * 0.24;
      const earH = fh * 0.72;
      const spread = fw * 0.34;

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * spread, -earH * 0.62 + bob);
        ctx.rotate(dir * 0.14);

        // Outer white plush ear
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FFC9DE';
        ctx.lineWidth = Math.max(3, fw * 0.022);
        ctx.shadowColor = 'rgba(57,51,67,0.18)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(0, 0, earW, earH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner baby pink ear
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFB3C9';
        ctx.beginPath();
        ctx.ellipse(0, earH * 0.08, earW * 0.55, earH * 0.68, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    case 'cat-ears-ar': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      const spread = fw * 0.46;
      const size = fw * 0.42;

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * spread, -fh * 0.12 + bob);
        ctx.rotate(dir * 0.22);

        ctx.fillStyle = '#393343';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(3, fw * 0.02);
        ctx.beginPath();
        ctx.moveTo(-size * 0.55, size * 0.2);
        ctx.lineTo(0, -size * 0.85);
        ctx.lineTo(size * 0.55, size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FF9EBB';
        ctx.beginPath();
        ctx.moveTo(-size * 0.34, size * 0.12);
        ctx.lineTo(0, -size * 0.55);
        ctx.lineTo(size * 0.34, size * 0.12);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    case 'puppy-ears': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      const spread = fw * 0.58;
      const earW = fw * 0.26;
      const earH = fh * 0.45;

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * spread, fh * 0.02 + bob);
        ctx.rotate(dir * 0.52);

        ctx.fillStyle = '#C68B59';
        ctx.strokeStyle = '#8D5B4C';
        ctx.lineWidth = Math.max(3, fw * 0.02);
        ctx.beginPath();
        ctx.ellipse(0, 0, earW, earH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#E6B89C';
        ctx.beginPath();
        ctx.ellipse(0, earH * 0.1, earW * 0.55, earH * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    case 'bear-ears': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      const spread = fw * 0.48;
      const r = fw * 0.24;

      [-1, 1].forEach((dir) => {
        const cx = dir * spread;
        const cy = -fh * 0.16 + bob;
        ctx.fillStyle = '#9C6644';
        ctx.strokeStyle = '#582F0E';
        ctx.lineWidth = Math.max(3, fw * 0.02);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#E6CCB2';
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.56, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'fox-ears': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      const spread = fw * 0.46;
      const size = fw * 0.45;

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * spread, -fh * 0.14 + bob);
        ctx.rotate(dir * 0.26);

        ctx.fillStyle = '#FF7B39';
        ctx.strokeStyle = '#5C2C16';
        ctx.lineWidth = Math.max(2.5, fw * 0.018);
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, size * 0.2);
        ctx.lineTo(0, -size * 0.92);
        ctx.lineTo(size * 0.5, size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFF5EB';
        ctx.beginPath();
        ctx.moveTo(-size * 0.28, size * 0.14);
        ctx.lineTo(0, -size * 0.62);
        ctx.lineTo(size * 0.28, size * 0.14);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    case 'deer-antlers': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      const spread = fw * 0.36;
      ctx.strokeStyle = '#9C6644';
      ctx.lineWidth = Math.max(5, fw * 0.045);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * spread, -fh * 0.1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(dir * fw * 0.15, -fh * 0.35, dir * fw * 0.32, -fh * 0.62);
        ctx.moveTo(dir * fw * 0.12, -fh * 0.24);
        ctx.lineTo(dir * fw * 0.02, -fh * 0.46);
        ctx.moveTo(dir * fw * 0.22, -fh * 0.42);
        ctx.lineTo(dir * fw * 0.38, -fh * 0.44);
        ctx.stroke();

        // Little flower at base of antler
        ctx.fillStyle = '#FFB3C6';
        ctx.beginPath();
        ctx.arc(0, 0, fw * 0.07, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFD166';
        ctx.beginPath();
        ctx.arc(0, 0, fw * 0.03, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    case 'cat-nose-whiskers': {
      ctx.translate(face.noseTip.x, face.noseTip.y);
      ctx.rotate(roll);
      const r = fw * 0.075;

      // Whiskers
      ctx.strokeStyle = '#393343';
      ctx.lineWidth = Math.max(2.5, fw * 0.015);
      ctx.lineCap = 'round';
      [-1, 1].forEach((dir) => {
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(dir * fw * 0.16, i * r * 0.7 + r * 0.4);
          ctx.lineTo(dir * fw * 0.44, i * r * 1.4 + r * 0.4);
          ctx.stroke();
        }
      });

      // Cute cat mouth 'w'
      ctx.beginPath();
      ctx.moveTo(-r * 1.1, r * 1.2);
      ctx.quadraticCurveTo(-r * 0.55, r * 1.9, 0, r * 1.1);
      ctx.quadraticCurveTo(r * 0.55, r * 1.9, r * 1.1, r * 1.2);
      ctx.stroke();

      // Pink triangle nose
      ctx.fillStyle = '#FF7597';
      ctx.beginPath();
      ctx.moveTo(-r, -r * 0.4);
      ctx.lineTo(r, -r * 0.4);
      ctx.lineTo(0, r * 0.85);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'bunny-nose': {
      ctx.translate(face.noseTip.x, face.noseTip.y);
      ctx.rotate(roll);
      const r = fw * 0.085;

      // Bunny whiskers
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(2.5, fw * 0.014);
      ctx.lineCap = 'round';
      [-1, 1].forEach((dir) => {
        ctx.beginPath();
        ctx.moveTo(dir * fw * 0.14, 0);
        ctx.lineTo(dir * fw * 0.36, -r * 0.4);
        ctx.moveTo(dir * fw * 0.14, r * 0.5);
        ctx.lineTo(dir * fw * 0.36, r * 0.6);
        ctx.stroke();
      });

      drawCuteHeart(ctx, 0, 0, r * 1.15, '#FF85A9');
      break;
    }

    case 'puppy-nose': {
      ctx.translate(face.noseTip.x, face.noseTip.y);
      ctx.rotate(roll);
      const r = fw * 0.1;

      ctx.fillStyle = '#4A2C2A';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.15, r * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glossy highlight
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.35, -r * 0.25, r * 0.3, r * 0.16, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // ==========================================
    // B. HAIR & WIG FILTERS (8)
    // ==========================================
    case 'fluffy-curly-brown-hair':
    case 'curly-black-hair':
    case 'pink-curly-hair': {
      const colorMap: Record<string, { main: string; shade: string }> = {
        'fluffy-curly-brown-hair': { main: '#8D5B4C', shade: '#5C372C' },
        'curly-black-hair': { main: '#2B2B36', shade: '#16161D' },
        'pink-curly-hair': { main: '#FF9EBB', shade: '#E06C9F' },
      };
      const palette = colorMap[filterId] || colorMap['fluffy-curly-brown-hair'];

      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);

      ctx.fillStyle = palette.main;
      ctx.strokeStyle = palette.shade;
      ctx.lineWidth = Math.max(2.5, fw * 0.018);

      // Crown & side curly cloud puffs around top and temples (leaves face open!)
      const puffs = [
        { x: 0, y: -fh * 0.22, r: fw * 0.28 },
        { x: -fw * 0.26, y: -fh * 0.18, r: fw * 0.26 },
        { x: fw * 0.26, y: -fh * 0.18, r: fw * 0.26 },
        { x: -fw * 0.48, y: -fh * 0.04, r: fw * 0.24 },
        { x: fw * 0.48, y: -fh * 0.04, r: fw * 0.24 },
        { x: -fw * 0.58, y: fh * 0.18, r: fw * 0.22 },
        { x: fw * 0.58, y: fh * 0.18, r: fw * 0.22 },
        { x: -fw * 0.56, y: fh * 0.42, r: fw * 0.2 },
        { x: fw * 0.56, y: fh * 0.42, r: fw * 0.2 },
      ];

      for (const p of puffs) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'soft-wavy-hair':
    case 'purple-wavy-hair': {
      const isPurple = filterId === 'purple-wavy-hair';
      const mainColor = isPurple ? '#B388EB' : '#6F4E37';
      const strokeColor = isPurple ? '#7F5AF0' : '#4A3222';

      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      ctx.fillStyle = mainColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(3, fw * 0.02);

      // Left & right sweeping curtain bangs + long wavy side strands
      [-1, 1].forEach((dir) => {
        ctx.beginPath();
        ctx.moveTo(0, -fh * 0.24);
        ctx.bezierCurveTo(
          dir * fw * 0.45,
          -fh * 0.3,
          dir * fw * 0.72,
          fh * 0.05,
          dir * fw * 0.62,
          fh * 0.45
        );
        ctx.bezierCurveTo(
          dir * fw * 0.75,
          fh * 0.75,
          dir * fw * 0.48,
          fh * 0.98,
          dir * fw * 0.42,
          fh * 0.85
        );
        ctx.bezierCurveTo(
          dir * fw * 0.48,
          fh * 0.45,
          dir * fw * 0.44,
          fh * 0.08,
          0,
          -fh * 0.02
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      break;
    }

    case 'cute-blonde-bob':
    case 'straight-hair-bangs': {
      const isBlonde = filterId === 'cute-blonde-bob';
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);

      ctx.fillStyle = isBlonde ? '#F4D35E' : '#2F2938';
      ctx.strokeStyle = isBlonde ? '#D9A026' : '#18141E';
      ctx.lineWidth = Math.max(2.5, fw * 0.018);

      // Side bob locks framing cheeks
      [-1, 1].forEach((dir) => {
        ctx.beginPath();
        ctx.roundRect(
          dir > 0 ? fw * 0.44 : -fw * 0.68,
          -fh * 0.14,
          fw * 0.24,
          isBlonde ? fh * 0.82 : fh * 1.05,
          fw * 0.12
        );
        ctx.fill();
        ctx.stroke();
      });

      // Full straight bangs across top of forehead
      ctx.beginPath();
      ctx.roundRect(-fw * 0.56, -fh * 0.26, fw * 1.12, fh * 0.3, fw * 0.14);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'fluffy-short-hair': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);

      ctx.fillStyle = '#7F5539';
      ctx.strokeStyle = '#582F0E';
      ctx.lineWidth = Math.max(2.5, fw * 0.018);

      ctx.beginPath();
      ctx.ellipse(0, -fh * 0.14, fw * 0.62, fh * 0.24, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(fw * 0.58, fh * 0.16);
      ctx.quadraticCurveTo(fw * 0.3, -fh * 0.02, 0, fh * 0.04);
      ctx.quadraticCurveTo(-fw * 0.3, -fh * 0.02, -fw * 0.58, fh * 0.16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }

    // ==========================================
    // C. CUTE ACCESSORIES (10)
    // ==========================================
    case 'coquette-pink-bow': {
      ctx.translate(face.crownTop.x, face.crownTop.y + fh * 0.08);
      ctx.rotate(roll);
      const s = fw * 0.38;

      ctx.fillStyle = '#FF85A9';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(3, fw * 0.02);

      // Left & right ribbon loops
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 1.2, -s * 0.8, -s * 1.3, s * 0.65, 0, s * 0.18);
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(s * 1.2, -s * 0.8, s * 1.3, s * 0.65, 0, s * 0.18);
      ctx.fill();
      ctx.stroke();

      // Center pearl knot
      ctx.fillStyle = '#FFF0F6';
      ctx.beginPath();
      ctx.arc(0, s * 0.06, s * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'double-hair-bows': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      const spread = fw * 0.52;
      const s = fw * 0.22;

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * spread, -fh * 0.06);
        ctx.rotate(dir * 0.28);
        ctx.fillStyle = '#FF85A9';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s * 1.2, -s * 0.8, -s * 1.2, s * 0.7, 0, s * 0.15);
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s * 1.2, -s * 0.8, s * 1.2, s * 0.7, 0, s * 0.15);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
      break;
    }

    case 'flower-crown': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y - fh * 0.05);
      ctx.rotate(roll);
      const count = 5;
      const arcW = fw * 0.48;

      for (let i = 0; i < count; i++) {
        const t = (i / (count - 1)) * 2 - 1; // -1 to 1
        const fx = t * arcW;
        const fy = Math.pow(t, 2) * (fh * 0.08);
        const r = fw * 0.095;

        // Green leaf
        ctx.fillStyle = '#74C69D';
        ctx.beginPath();
        ctx.ellipse(fx - r * 0.6, fy + r * 0.2, r * 0.55, r * 0.25, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Petals
        ctx.fillStyle = i % 2 === 0 ? '#FFB3C6' : '#FFF9F2';
        for (let p = 0; p < 5; p++) {
          const a = (p * Math.PI * 2) / 5;
          ctx.beginPath();
          ctx.arc(fx + Math.cos(a) * r * 0.5, fy + Math.sin(a) * r * 0.5, r * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#FFD166';
        ctx.beginPath();
        ctx.arc(fx, fy, r * 0.34, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'sparkling-tiara': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y - fh * 0.08);
      ctx.rotate(roll);
      const w = fw * 0.44;
      const h = fh * 0.28;

      ctx.fillStyle = '#FFF3B0';
      ctx.strokeStyle = '#F4B400';
      ctx.lineWidth = Math.max(3, fw * 0.02);

      ctx.beginPath();
      ctx.moveTo(-w, 0);
      ctx.lineTo(-w * 0.7, -h * 0.55);
      ctx.lineTo(-w * 0.35, -h * 0.2);
      ctx.lineTo(0, -h);
      ctx.lineTo(w * 0.35, -h * 0.2);
      ctx.lineTo(w * 0.7, -h * 0.55);
      ctx.lineTo(w, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      drawCuteHeart(ctx, 0, -h * 0.38, fw * 0.08, '#FF5C93');
      drawFourStar(ctx, 0, -h * 1.15, fw * 0.07, '#FFFFFF');
      break;
    }

    case 'angel-halo': {
      ctx.translate(face.crownTop.x, face.crownTop.y - fh * 0.06 + bob);
      ctx.rotate(roll);

      ctx.shadowColor = '#FFD166';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#FFE066';
      ctx.lineWidth = Math.max(6, fw * 0.055);
      ctx.beginPath();
      ctx.ellipse(0, 0, fw * 0.44, fh * 0.09, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'butterfly-hair-clips': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y);
      ctx.rotate(roll);
      drawButterflyShape(ctx, -fw * 0.48, -fh * 0.02, fw * 0.14, '#C8B6FF', '#FFC9DE', -0.35);
      drawButterflyShape(ctx, fw * 0.48, -fh * 0.02, fw * 0.14, '#FFC9DE', '#CDEBFF', 0.35);
      drawButterflyShape(ctx, -fw * 0.54, fh * 0.16, fw * 0.11, '#A2D2FF', '#FFC9DE', -0.2);
      drawButterflyShape(ctx, fw * 0.54, fh * 0.16, fw * 0.11, '#FFD166', '#FFC9DE', 0.2);
      break;
    }

    case 'heart-glasses': {
      ctx.translate(face.eyeCenter.x, face.eyeCenter.y);
      ctx.rotate(roll);
      const halfSpan = ed * 0.52;
      const lensSize = ed * 0.42;

      // Bridge
      ctx.strokeStyle = '#FF477E';
      ctx.lineWidth = Math.max(3.5, fw * 0.024);
      ctx.beginPath();
      ctx.moveTo(-halfSpan * 0.35, -lensSize * 0.1);
      ctx.quadraticCurveTo(0, -lensSize * 0.3, halfSpan * 0.35, -lensSize * 0.1);
      ctx.stroke();

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * halfSpan, lensSize * 0.08);
        ctx.globalAlpha = 0.55;
        drawCuteHeart(ctx, 0, 0, lensSize, '#FF75A0');
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(3, fw * 0.02);
        drawCuteHeart(ctx, 0, 0, lensSize * 0.95, 'rgba(255, 92, 147, 0.35)');
        ctx.restore();
      });
      break;
    }

    case 'round-glasses': {
      ctx.translate(face.eyeCenter.x, face.eyeCenter.y);
      ctx.rotate(roll);
      const halfSpan = ed * 0.52;
      const r = ed * 0.38;

      ctx.strokeStyle = '#D4AF37';
      ctx.fillStyle = 'rgba(255, 249, 242, 0.18)';
      ctx.lineWidth = Math.max(3, fw * 0.02);

      // Left & right round lenses
      [-1, 1].forEach((dir) => {
        ctx.beginPath();
        ctx.arc(dir * halfSpan, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Bridge
      ctx.beginPath();
      ctx.moveTo(-halfSpan + r, 0);
      ctx.quadraticCurveTo(0, -r * 0.25, halfSpan - r, 0);
      ctx.stroke();
      break;
    }

    case 'star-glasses': {
      ctx.translate(face.eyeCenter.x, face.eyeCenter.y);
      ctx.rotate(roll);
      const halfSpan = ed * 0.52;
      const outerR = ed * 0.46;

      ctx.strokeStyle = '#FFB703';
      ctx.lineWidth = Math.max(3, fw * 0.02);
      ctx.beginPath();
      ctx.moveTo(-halfSpan * 0.4, 0);
      ctx.lineTo(halfSpan * 0.4, 0);
      ctx.stroke();

      [-1, 1].forEach((dir) => {
        drawFivePointStar(
          ctx,
          dir * halfSpan,
          0,
          outerR,
          outerR * 0.48,
          'rgba(255, 209, 102, 0.48)',
          '#FFFFFF'
        );
      });
      break;
    }

    case 'cute-beret': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y - fh * 0.14);
      ctx.rotate(roll - 0.12);

      ctx.fillStyle = '#FF85A9';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(3, fw * 0.02);

      ctx.beginPath();
      ctx.ellipse(0, 0, fw * 0.58, fh * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Beret stem on top
      ctx.beginPath();
      ctx.moveTo(0, -fh * 0.22);
      ctx.lineTo(fw * 0.04, -fh * 0.3);
      ctx.stroke();
      break;
    }

    // ==========================================
    // D. CUTE MAKEUP EFFECTS (8)
    // ==========================================
    case 'rosy-pink-cheeks':
    case 'peach-blush':
    case 'soft-pink-makeup': {
      const color = filterId === 'peach-blush' ? '255, 148, 102' : '255, 112, 158';
      const r = fw * 0.18;

      [face.leftCheek, face.rightCheek].forEach((cheek) => {
        const grad = ctx.createRadialGradient(cheek.x, cheek.y, r * 0.1, cheek.x, cheek.y, r);
        grad.addColorStop(0, `rgba(${color}, 0.52)`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cheek.x, cheek.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (filterId === 'soft-pink-makeup') {
        // Subtle rosy lip tint
        const lipR = fw * 0.12;
        const lipGrad = ctx.createRadialGradient(
          face.mouthCenter.x,
          face.mouthCenter.y,
          lipR * 0.1,
          face.mouthCenter.x,
          face.mouthCenter.y,
          lipR
        );
        lipGrad.addColorStop(0, 'rgba(255, 75, 130, 0.42)');
        lipGrad.addColorStop(1, 'rgba(255, 75, 130, 0)');
        ctx.fillStyle = lipGrad;
        ctx.beginPath();
        ctx.arc(face.mouthCenter.x, face.mouthCenter.y, lipR, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'tiny-nose-blush': {
      const points = [face.leftCheek, face.rightCheek, face.noseTip];
      points.forEach((pt, idx) => {
        const r = idx === 2 ? fw * 0.12 : fw * 0.16;
        const grad = ctx.createRadialGradient(pt.x, pt.y, r * 0.1, pt.x, pt.y, r);
        grad.addColorStop(0, 'rgba(255, 105, 145, 0.55)');
        grad.addColorStop(1, 'rgba(255, 105, 145, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'cute-freckles': {
      ctx.fillStyle = 'rgba(165, 105, 75, 0.65)';
      const dotR = Math.max(2, fw * 0.012);
      const offsets = [
        [-0.08, -0.02],
        [-0.04, 0.02],
        [0, -0.01],
        [0.04, 0.02],
        [0.08, -0.02],
      ];
      [face.leftCheek, face.rightCheek, face.noseBridge].forEach((anchor) => {
        offsets.forEach(([ox, oy]) => {
          ctx.beginPath();
          ctx.arc(anchor.x + ox * fw, anchor.y + oy * fh, dotR, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      break;
    }

    case 'heart-cheeks': {
      const size = fw * 0.085;
      drawCuteHeart(ctx, face.leftCheek.x, face.leftCheek.y, size, '#FF5C93');
      drawCuteHeart(ctx, face.rightCheek.x, face.rightCheek.y, size, '#FF5C93');
      break;
    }

    case 'star-cheek-stickers': {
      const r = fw * 0.065;
      drawFivePointStar(ctx, face.leftCheek.x, face.leftCheek.y, r, r * 0.45, '#FFD166', '#FFFFFF');
      drawFivePointStar(
        ctx,
        face.leftCheek.x - r * 1.3,
        face.leftCheek.y + r * 0.7,
        r * 0.6,
        r * 0.3,
        '#FFC9DE'
      );
      drawFivePointStar(ctx, face.rightCheek.x, face.rightCheek.y, r, r * 0.45, '#FFD166', '#FFFFFF');
      drawFivePointStar(
        ctx,
        face.rightCheek.x + r * 1.3,
        face.rightCheek.y + r * 0.7,
        r * 0.6,
        r * 0.3,
        '#C8B6FF'
      );
      break;
    }

    case 'glitter-under-eyes': {
      const yOffset = fh * 0.065;
      const spread = fw * 0.06;
      [face.leftEye, face.rightEye].forEach((eye) => {
        for (let i = -1; i <= 1; i++) {
          drawFourStar(
            ctx,
            eye.x + i * spread,
            eye.y + yOffset + Math.abs(i) * (fh * 0.015),
            fw * 0.032,
            i === 0 ? '#FFF3B0' : '#E2C2FF'
          );
        }
      });
      break;
    }

    // ==========================================
    // F. SEASONAL HEADWEAR FILTERS
    // ==========================================
    case 'birthday-crown': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y - fh * 0.1);
      ctx.rotate(roll);
      const w = fw * 0.42;
      const h = fh * 0.32;

      ctx.fillStyle = '#FFD166';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(3, fw * 0.02);
      ctx.beginPath();
      ctx.moveTo(-w, 0);
      ctx.lineTo(-w * 0.85, -h);
      ctx.lineTo(-w * 0.35, -h * 0.35);
      ctx.lineTo(0, -h * 1.1);
      ctx.lineTo(w * 0.35, -h * 0.35);
      ctx.lineTo(w * 0.85, -h);
      ctx.lineTo(w, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FF5C93';
      ctx.font = `800 ${Math.max(12, Math.round(fw * 0.09))}px Fredoka, Nunito, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('B-DAY ★', 0, -h * 0.18);
      break;
    }

    case 'graduation-cap': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y - fh * 0.16);
      ctx.rotate(roll);
      const w = fw * 0.68;
      const h = fh * 0.22;

      ctx.fillStyle = '#243B53';
      ctx.strokeStyle = '#F0B429';
      ctx.lineWidth = Math.max(2.5, fw * 0.018);

      // Diamond top board
      ctx.beginPath();
      ctx.moveTo(0, -h * 1.2);
      ctx.lineTo(w, -h * 0.45);
      ctx.lineTo(0, h * 0.25);
      ctx.lineTo(-w, -h * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tassel
      ctx.strokeStyle = '#F0B429';
      ctx.lineWidth = Math.max(3, fw * 0.022);
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.45);
      ctx.quadraticCurveTo(w * 0.55, -h * 0.2, w * 0.62, h * 0.45);
      ctx.stroke();
      break;
    }

    case 'santa-hat': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y - fh * 0.08);
      ctx.rotate(roll);
      const w = fw * 0.56;
      const h = fh * 0.55;

      // Red cone
      ctx.fillStyle = '#E63946';
      ctx.beginPath();
      ctx.moveTo(-w, 0);
      ctx.quadraticCurveTo(0, -h * 1.25, w * 0.95, -h * 0.35);
      ctx.lineTo(w * 0.85, 0);
      ctx.closePath();
      ctx.fill();

      // Fluffy white brim
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(-w * 1.05, -h * 0.14, w * 2.1, h * 0.28, h * 0.14);
      ctx.fill();

      // Pom-pom
      ctx.beginPath();
      ctx.arc(w * 0.95, -h * 0.32, fw * 0.13, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'witch-hat': {
      ctx.translate(face.foreheadTop.x, face.foreheadTop.y - fh * 0.1);
      ctx.rotate(roll);
      const w = fw * 0.72;
      const h = fh * 0.65;

      ctx.fillStyle = '#3B2D4A';
      ctx.strokeStyle = '#C59BFF';
      ctx.lineWidth = Math.max(2.5, fw * 0.018);

      // Cone
      ctx.beginPath();
      ctx.moveTo(-w * 0.52, 0);
      ctx.lineTo(w * 0.12, -h);
      ctx.lineTo(w * 0.52, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Wide brim
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawFivePointStar(ctx, 0, -h * 0.22, fw * 0.08, fw * 0.04, '#FFD166');
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

/**
 * Renders ambient / fantasy / seasonal full-frame particle and atmosphere effects.
 */
function renderAmbientARFilter(
  ctx: CanvasRenderingContext2D,
  filterId: ARFilterId,
  width: number,
  height: number,
  faces: SmoothedFaceMetrics[],
  nowMs: number
) {
  ctx.save();
  const t = nowMs * 0.001;

  // Determine anchor points (around detected faces or distributed nicely across canvas)
  const anchors =
    faces.length > 0
      ? faces.map((f) => ({ x: f.faceCenter.x, y: f.faceCenter.y, r: f.faceWidth * 0.85 }))
      : [{ x: width * 0.5, y: height * 0.5, r: Math.min(width, height) * 0.32 }];

  switch (filterId) {
    case 'floating-hearts': {
      anchors.forEach((a, aIdx) => {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t * 0.6 + aIdx;
          const lift = ((t * 40 + i * 35) % 120) - 60;
          const hx = a.x + Math.cos(angle) * a.r * (0.75 + (i % 3) * 0.15);
          const hy = a.y + Math.sin(angle) * a.r * 0.6 - lift;
          const size = Math.max(12, width * 0.022) * (0.8 + (i % 3) * 0.25);
          drawCuteHeart(ctx, hx, hy, size, i % 2 === 0 ? '#FF75A0' : '#FFC9DE');
        }
      });
      break;
    }

    case 'magical-sparkles':
    case 'angel-sparkles': {
      const color1 = filterId === 'angel-sparkles' ? '#FFFFFF' : '#FFE066';
      const color2 = filterId === 'angel-sparkles' ? '#FFF3B0' : '#FFC9DE';
      anchors.forEach((a) => {
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2 + t * 0.4;
          const pulse = 0.6 + 0.4 * Math.sin(t * 4 + i * 1.3);
          const sx = a.x + Math.cos(angle) * a.r * (0.7 + (i % 2) * 0.25);
          const sy = a.y + Math.sin(angle) * a.r * 0.65;
          drawFourStar(
            ctx,
            sx,
            sy,
            Math.max(10, width * 0.024) * pulse,
            i % 2 === 0 ? color1 : color2
          );
        }
      });
      break;
    }

    case 'fairy-dust': {
      anchors.forEach((a) => {
        for (let i = 0; i < 18; i++) {
          const angle = i * 0.7 + t * 1.1;
          const rad = a.r * (0.5 + (i % 5) * 0.14);
          const px = a.x + Math.cos(angle) * rad;
          const py = a.y + Math.sin(angle * 1.2) * rad * 0.8;
          const dotR = Math.max(3, width * 0.007) * (0.7 + 0.4 * Math.sin(t * 5 + i));
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 230, 140, 0.85)' : 'rgba(225, 195, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(px, py, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      break;
    }

    case 'butterfly-sparkles': {
      anchors.forEach((a) => {
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 + t * 0.5;
          const bx = a.x + Math.cos(angle) * a.r * 0.88;
          const by = a.y + Math.sin(angle) * a.r * 0.65 - a.r * 0.15;
          drawButterflyShape(
            ctx,
            bx,
            by,
            Math.max(16, width * 0.028),
            i % 2 === 0 ? '#C8B6FF' : '#FFC9DE',
            '#CDEBFF',
            Math.sin(t * 3 + i) * 0.3
          );
        }
      });
      break;
    }

    case 'cherry-blossom-petals': {
      for (let i = 0; i < 14; i++) {
        const px = ((i * 97 + t * 45) % (width + 60)) - 30;
        const py = ((i * 73 + t * 55) % (height + 60)) - 30;
        const rot = t * 1.2 + i;
        const size = Math.max(8, width * 0.014);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        ctx.fillStyle = i % 2 === 0 ? '#FFB3C6' : '#FFD6E6';
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      break;
    }

    case 'rainbow-glow': {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(255, 180, 210, 0.22)');
      grad.addColorStop(0.35, 'rgba(255, 235, 165, 0.18)');
      grad.addColorStop(0.7, 'rgba(180, 235, 255, 0.22)');
      grad.addColorStop(1, 'rgba(215, 190, 255, 0.24)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'floating-stars': {
      anchors.forEach((a) => {
        for (let i = 0; i < 7; i++) {
          const angle = (i / 7) * Math.PI * 2 + t * 0.45;
          const sx = a.x + Math.cos(angle) * a.r * 0.85;
          const sy = a.y + Math.sin(angle) * a.r * 0.65;
          const r = Math.max(10, width * 0.02);
          drawFivePointStar(ctx, sx, sy, r, r * 0.46, '#FFD166', '#FFFFFF');
        }
      });
      break;
    }

    case 'party-confetti': {
      const colors = ['#FF6B9E', '#FFD166', '#8C65F7', '#4BA3E3', '#74C69D'];
      for (let i = 0; i < 22; i++) {
        const cx = ((i * 83 + Math.sin(t + i) * 25) % width);
        const cy = ((i * 67 + t * 80) % height);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 2 + i);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(-6, -3, 12, 6);
        ctx.restore();
      }
      break;
    }

    case 'retro-film-ar': {
      // Warm light leak on right edge + 35mm timestamp
      const leak = ctx.createLinearGradient(width * 0.72, 0, width, 0);
      leak.addColorStop(0, 'rgba(255, 140, 66, 0)');
      leak.addColorStop(1, 'rgba(255, 120, 50, 0.38)');
      ctx.fillStyle = leak;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#FF9E5E';
      ctx.font = `700 ${Math.max(14, Math.round(width * 0.024))}px monospace`;
      ctx.fillText(`'26 10 22`, width * 0.06, height * 0.92);
      break;
    }

    case 'vhs-effect-ar': {
      // Subtle scanlines + PLAY ▶ indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let y = 0; y < height; y += 6) {
        ctx.fillRect(0, y, width, 2);
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      const fontSize = Math.max(14, Math.round(width * 0.025));
      ctx.font = `700 ${fontSize}px monospace`;
      ctx.fillText('PLAY ▶', width * 0.06, height * 0.1);
      ctx.fillText('MOCHI-VHS SP', width * 0.06, height * 0.92);
      break;
    }

    case 'dreamy-glow-ar': {
      const rad = Math.hypot(width, height) * 0.55;
      const vig = ctx.createRadialGradient(
        width / 2,
        height / 2,
        rad * 0.45,
        width / 2,
        height / 2,
        rad
      );
      vig.addColorStop(0, 'rgba(255, 201, 222, 0)');
      vig.addColorStop(1, 'rgba(255, 182, 217, 0.42)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

/**
 * Master function that renders all active AR filters (in proper layer depth order)
 * across all detected faces onto a 2D canvas context.
 */
export function renderActiveARFilters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  faces: SmoothedFaceMetrics[],
  activeFilterIds: ARFilterId[],
  nowMs = performance.now()
) {
  if (activeFilterIds.length === 0) return;

  // Sort active filters by depth order so makeup is under glasses, hair is under headwear, etc.
  const slotOrder: Record<string, number> = {
    cheeks: 1,
    hair: 2,
    ears: 3,
    headwear: 4,
    eyewear: 5,
    nose: 6,
    ambient: 7,
  };

  const ordered = [...activeFilterIds].sort((a, b) => {
    const da = getARFilterById(a);
    const db = getARFilterById(b);
    return (slotOrder[da?.slot || 'ambient'] || 9) - (slotOrder[db?.slot || 'ambient'] || 9);
  });

  // 1. Render face-anchored filters on every detected face
  for (const face of faces) {
    for (const fId of ordered) {
      const def = getARFilterById(fId);
      if (def && def.requiresFaceTracking) {
        renderFaceTrackedFilterOnFace(ctx, fId, face, nowMs);
      }
    }
  }

  // 2. Render ambient/fantasy filters
  for (const fId of ordered) {
    const def = getARFilterById(fId);
    if (def && !def.requiresFaceTracking) {
      renderAmbientARFilter(ctx, fId, width, height, faces, nowMs);
    }
  }
}

