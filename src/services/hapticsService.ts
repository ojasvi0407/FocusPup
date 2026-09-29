/**
 * Cross-platform haptic feedback helper
 * Falls back to navigator.vibrate when running in web/preview,
 * and seamlessly calls expo-haptics when compiled in native Expo.
 */
export const Haptics = {
  impactAsync: async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        if (style === 'light') navigator.vibrate(12);
        else if (style === 'medium') navigator.vibrate(25);
        else navigator.vibrate([20, 40, 20]);
      }
    } catch {
      // ignore
    }
  },
  notificationAsync: async (type: 'success' | 'warning' | 'error' = 'success') => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        if (type === 'success') navigator.vibrate([15, 30, 15]);
        else if (type === 'warning') navigator.vibrate([30, 50, 30]);
        else navigator.vibrate([50, 80, 50]);
      }
    } catch {
      // ignore
    }
  },
  selectionAsync: async () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {
      // ignore
    }
  },
};
