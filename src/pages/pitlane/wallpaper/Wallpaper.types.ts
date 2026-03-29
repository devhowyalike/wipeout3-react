/** Map of resolution label to download URL for a wallpaper. */
export interface WallpaperSize {
  [key: string]: string;
}

/** A wallpaper entry with a display name and its available size/URL pairs. */
export interface Wallpaper {
  name: string;
  sizes: WallpaperSize;
}

/** The user's current wallpaper selection: resolved URL, resolution label, and name. */
export interface SelectedWallpaper {
  url: string;
  size: string;
  name: string;
}

/** Available wallpaper resolution labels (e.g. `"0800 x 0600"`). */
export interface Resolution {
  res1: string;
  res2: string;
}