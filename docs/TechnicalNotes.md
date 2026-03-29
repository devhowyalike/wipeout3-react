# Technical Notes

## Critical CSS Injection

To prevent a flash of unstyled content (FOUC) when the page first loads, a `<style>` block is injected into the `<head>` of `index.html` at transform time by the `injectCriticalThemeCSS` Vite plugin defined in `vite.config.ts`.

The plugin runs during both `pnpm dev` and `pnpm build`. It reads two source files at transform time to derive the injected styles:

| Source                    | What is read                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| `src/styles/index.css`    | `--color-page-bg` value for every `[data-theme]` selector           |
| `src/config/constants.ts` | `DEFAULT_THEME` identifier, used to set `:root { --color-page-bg }` |

The resolved CSS is injected as a `<style>` tag prepended to `<head>`. It contains per-theme background color rules, `body { background-color: var(--color-page-bg) }`, `#root { visibility: hidden }` (so the page is invisible until the full CSS bundle arrives), and the critical `@font-face` declaration for the Wipeout3 font.

Because the values are derived from the actual CSS and constants files, adding or modifying a theme in `index.css` is automatically reflected in the injected block with no manual updates required.

## SVG to Video Converter

For Flash animations that could not be faithfully reproduced as animated SVGs, a custom shell script (`scripts/svg-to-video/animate_svgs.sh`) converts a numbered sequence of SVG frames into alpha-channel video files suitable for use in the browser.

The script produces three output formats to cover cross-browser transparency support:

| File | Codec | Notes |
| ---- | ----- | ----- |
| `output_alpha.webm` | VP9 | Best for web; Chrome and modern Safari |
| `output_alpha.mov` | ProRes 4444 | Maximum Safari compatibility |
| `output_alpha_hevc.mov` | HEVC | Apple-native; best quality/size ratio |

**Requirements:** `ffmpeg` plus one SVG rasteriser — ImageMagick, Inkscape, or librsvg.

**Usage:**

```bash
# Interactive prompts
./animate_svgs.sh

# With explicit dimensions
./animate_svgs.sh /path/to/svgs -w 418 -h 393
```

Key configuration variables at the top of the script:

- `DURATION_PER_FRAME` — how long each SVG frame is displayed (default: `0.5s`)
- `FPS` — output frame rate (default: `30`)

For full usage, flags, and troubleshooting see [`scripts/svg-to-video/README.md`](../scripts/svg-to-video/README.md).

## Converting Complex Flash Animations

### SVGs

Where possible, efforts were made to convert Flash animations to animated SVGs. These maintain the vector nature of the original animation, are easy to work with and make interactive, and remain accessible in modern browsers. This applies to pages such as the Teams landing page and Tracks, for example.

For animations that could not be reproduced as SVGs, see [SVG to Video Converter](#svg-to-video-converter).
