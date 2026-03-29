import { DEFAULT_THEME } from "@/config/constants";
import { ThemeName } from "@/types/Theme.types";

/**
 * Provides `setTheme`, which applies a theme by setting `data-theme` on `document.documentElement`
 * (no-op if the theme is already active).
 */
export function useTheme() {
  const setTheme = (theme: ThemeName) => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Only update if the theme is different
    if (currentTheme !== theme) {
      document.documentElement.setAttribute('data-theme', theme || DEFAULT_THEME);
    }
  };

  return { setTheme };
}