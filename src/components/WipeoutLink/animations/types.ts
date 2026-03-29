import type { CSSProperties } from 'react';

/** A `<source>` element descriptor for a hover-animation video clip. */
export interface VideoSource {
  src: string;
  type: string;
}

/** Describes a hover animation clip: its asset folder, filename, and optional position overrides. */
export interface Animation {
  folder: string;
  sources: string;
  /**
   * Positioning and size overrides for the animation overlay.
   * Use `em` units — values scale proportionally with the menu font size
   */
  style?: Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom' | 'transform' | 'width' | 'height'>;
}
