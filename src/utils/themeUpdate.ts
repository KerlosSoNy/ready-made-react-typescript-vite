import axiosInstance from "./axios/axsionInstance";
import { setFooterData } from "./redux/slices/footerSlice";
import store from "./redux/store";

/**
 * Converts hex color to RGB string (format: "R G B")
 */
function hexToRgbString(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse r, g, b values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r} ${g} ${b}`;
}

/**
 * Updates the theme colors globally
 * @param {object} colors - Object with color values in hex format
 */
export function updateThemeColors(colors: any) {
  const root = document.documentElement;
  
  if (colors?.platform_theme?.primary_color) {
    root.style.setProperty('--color-main-color', colors?.platform_theme?.primary_color);
    // Also set RGB version if needed
    root.style.setProperty('--color-main-color-rgb', hexToRgbString(colors?.platform_theme?.primary_color));
  }
  
  if (colors.secondary_color) {
    root.style.setProperty('--color-second-color', colors?.platform_theme?.secondary_color);
    root.style.setProperty('--color-second-color-rgb', hexToRgbString(colors?.platform_theme?.secondary_color));
  }
  
  if (colors.accent_color) {
    root.style.setProperty('--color-third-color', colors?.platform_theme?.accent_color);
    root.style.setProperty('--color-third-color-rgb', hexToRgbString(colors?.platform_theme?.accent_color));
  }
  
  if (colors.neutral) {
    root.style.setProperty('--color-dark-text', colors?.platform_theme?.neutral);
    root.style.setProperty('--color-dark-text-rgb', hexToRgbString(colors?.platform_theme?.neutral));
  }
}

/**
 * Initializes theme from backend
 */
export async function initTheme() {
  try {
    const response = await axiosInstance.get(`/${import.meta.env.VITE_API_APP_TYPE}/${import.meta.env.VITE_API_VERSION}/settings/level/details`);
    const themeData = response.data.data;
    store.dispatch(setFooterData(themeData.settings));
    updateThemeColors(themeData);
    return themeData;
  } catch (error) {
    console.error('Failed to initialize theme:', error);
    return error;
  }
}