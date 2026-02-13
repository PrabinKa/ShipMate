import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Use whichever is smaller to keep consistent scaling
const SCALE = SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;

const BASE_WIDTH = 375; // Reference design width

// Configurable ranges for scaling
const fontConfig = {
  phone: {
    small: { min: 0.8, max: 1 },
    medium: { min: 0.9, max: 1.1 },
    large: { min: 1, max: 1.2 },
  },
  tablet: {
    small: { min: 1.3, max: 1.4 },
    medium: { min: 1.4, max: 1.5 },
    large: { min: 1.5, max: 1.7 },
  },
};

// Determine if device is phone or tablet
export const getDeviceType = (): 'phone' | 'tablet' => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;

  if (
    (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) ||
    (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920))
  ) {
    return 'tablet';
  }
  return 'phone';
};

// Classify current screen size
const getScreenSizeCategory = (): 'small' | 'medium' | 'large' => {
  if (SCALE < 350) return 'small';
  if (SCALE > 500) return 'large';
  return 'medium';
};

// Responsive font-size function
export const getFontSize = (size: number): number => {
  const deviceType = getDeviceType();
  const screenCategory = getScreenSizeCategory();
  const { min, max } = fontConfig[deviceType][screenCategory];

  const scaleFactor = SCALE / BASE_WIDTH;
  const clamped = Math.min(Math.max(scaleFactor, min), max);
  let newSize = size * clamped;

  // Extra scaling for tablets
  if (deviceType === 'tablet') {
    newSize *= 1.1;
  }

  return Math.round(PixelRatio.roundToNearestPixel(newSize)) / PixelRatio.getFontScale();
};
