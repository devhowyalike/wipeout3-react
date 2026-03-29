# SVG to Video Animation with Alpha Channel

Developed by Yameen for the [wipeout3.com: React Edition](https://wipeout3.app) project.

This script converts a series of SVG files into video formats that preserve transparency and work in both Safari and Chrome.

## Requirements

**Required:**

- `ffmpeg` with VP9 and ProRes support

**One of the following for SVG conversion:**

- ImageMagick (`magick` or `convert`)
- Inkscape
- librsvg (`rsvg-convert`)

### Installation

**macOS (Homebrew):**

```bash
brew install ffmpeg imagemagick
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get install ffmpeg imagemagick librsvg2-bin
```

## Usage

1. Name your SVG files numerically (1.svg, 2.svg, etc.) and place them in a folder
2. Run the script from anywhere:

```bash
./animate_svgs.sh
```

3. When prompted, enter the path to your SVG folder (or press Enter to use the current directory)
4. Enter the output width and height in pixels (or press Enter for the defaults of 800×600)
5. Enter a base name for the output files (or press Enter for the default `output_alpha`)

You can also pass the SVG folder and dimensions as arguments to skip prompts entirely:

```bash
# Positional SVG dir + short flags
./animate_svgs.sh /path/to/svgs -w 418 -h 393

# Long flags
./animate_svgs.sh /path/to/svgs --width 1920 --height 1080

# Width/height only (still prompts for folder)
./animate_svgs.sh -w 1280 -h 720
```

## Configuration

Edit these variables at the top of `animate_svgs.sh`:

- `DURATION_PER_FRAME`: How long each SVG is displayed (default: 0.5 seconds)
- `FPS`: Frames per second for output video (default: 30)

Width and height are set interactively at runtime (defaults: 800×600) or via `--width` / `--height` flags.

## Output

The script creates three video files:

1. **output_alpha.webm** - VP9 codec with alpha channel
   - Best for web (Chrome, modern Safari)
   - Smaller file size
   - Excellent quality

2. **output_alpha.mov** - ProRes 4444 with alpha channel
   - Maximum Safari compatibility
   - Larger file size
   - Professional quality
   - Works in video editing software

3. **output_alpha_hevc.mov** - HEVC with alpha channel
   - Apple's native HEVC encoder with alpha support
   - Excellent for Safari, small file size
   - Best quality/size ratio

## Using in HTML

```html
<video autoplay loop muted playsinline>
  <source src="output_alpha.webm" type="video/webm" />
  <source src="output_alpha.mov" type="video/quicktime" />
</video>
```

The browser will automatically select the format it supports best.

## How It Works

1. Converts each SVG to PNG with transparent background
2. Duplicates each PNG based on desired duration and FPS
3. Encodes PNG sequence to WebM (VP9) with alpha channel
4. Encodes PNG sequence to MOV (ProRes 4444) with alpha channel
5. Cleans up temporary files

## Troubleshooting

**"No SVG converter found" error:**
Install ImageMagick, Inkscape, or librsvg (see Requirements above)

**Alpha channel not preserved:**

- Ensure your SVGs have transparent backgrounds
- Check ffmpeg has VP9 support: `ffmpeg -codecs | grep vp9`
- Check ffmpeg has ProRes support: `ffmpeg -codecs | grep prores`

**Videos too large:**

- Use a smaller width/height (pass `--width` / `--height` flags or enter smaller values when prompted)
- For WebM, adjust `-b:v 2M` (bitrate) in the script
- Use only WebM (skip MOV creation)

**Wrong frame order:**
Make sure SVG files are named numerically (1.svg, 2.svg, etc.)
