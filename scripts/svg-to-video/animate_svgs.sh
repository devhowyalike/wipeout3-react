#!/bin/bash

# SVG to Video Animation Script with Alpha Channel
# This script converts a series of SVG files into a video with transparency
# Compatible with Safari (WebM VP9 with alpha) and Chrome
# Developed by Yameen for the wipeout3.com: React Edition project
# See README.md for more information

set -e

# Configuration
DURATION_PER_FRAME=1    # How many video frames to show each SVG (1 = instant/no pause)
FPS=20                   # Frames per second for the output video

# Parse arguments: optional positional SVG dir, --width/-w, --height/-h
SVG_DIR_ARG=""
WIDTH=""
HEIGHT=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --width|-w)  WIDTH="$2";       shift 2 ;;
        --height|-h) HEIGHT="$2";      shift 2 ;;
        -*)          shift ;;           # ignore unknown flags
        *)           SVG_DIR_ARG="$1"; shift ;;
    esac
done

# Input SVG directory
if [ -n "$SVG_DIR_ARG" ]; then
    SVG_DIR="$SVG_DIR_ARG"
else
    read -p "Enter path to SVG folder (e.g. ./frames, ../svgs, /Users/you/Desktop/frames) [Enter for current folder]: " SVG_DIR
    SVG_DIR="${SVG_DIR:-.}"
fi
SVG_DIR="${SVG_DIR#\'}" && SVG_DIR="${SVG_DIR%\'}"  # strip surrounding single quotes from drag-and-drop
SVG_DIR="${SVG_DIR#\"}" && SVG_DIR="${SVG_DIR%\"}"  # strip surrounding double quotes
SVG_DIR="${SVG_DIR%/}"  # strip trailing slash

if [ ! -d "$SVG_DIR" ]; then
    echo "Error: Directory '$SVG_DIR' not found"
    exit 1
fi

# Prompt for width / height only if not supplied via flags
if [ -z "$WIDTH" ]; then
    read -p "Enter output width in pixels [800]: " WIDTH
    WIDTH="${WIDTH:-800}"
fi
if [ -z "$HEIGHT" ]; then
    read -p "Enter output height in pixels [600]: " HEIGHT
    HEIGHT="${HEIGHT:-600}"
fi

# Output files
read -p "Enter output filename (without extension): " BASE_NAME
BASE_NAME="${BASE_NAME:-output_alpha}"

OUTPUT_WEBM="${BASE_NAME}.webm"
OUTPUT_PRORES="${BASE_NAME}-prores.mov"
OUTPUT_MOV="${BASE_NAME}.mov"

# Create temporary directory for PNG frames
TEMP_DIR="./temp_frames"
mkdir -p "$TEMP_DIR"

echo "Converting SVGs to PNGs with alpha channel..."

# Get all SVG files sorted numerically (1.svg, 2.svg, 3.svg, etc.)
SVG_FILES=()
for i in $(seq 1 100); do
    if [ -f "$SVG_DIR/$i.svg" ]; then
        SVG_FILES+=("$SVG_DIR/$i.svg")
    fi
done

if [ ${#SVG_FILES[@]} -eq 0 ]; then
    echo "Error: No SVG files found in current directory"
    exit 1
fi

echo "Found ${#SVG_FILES[@]} SVG files"

# DURATION_PER_FRAME is now the number of video frames to show each SVG
FRAMES_PER_SVG=$DURATION_PER_FRAME

DURATION_IN_SECONDS=$(echo "scale=3; $DURATION_PER_FRAME / $FPS" | bc)
echo "Each SVG will be shown for $FRAMES_PER_SVG frames ($DURATION_IN_SECONDS seconds at ${FPS}fps)"

# Counter for output frames
FRAME_NUM=0

# Convert each SVG to PNG and duplicate for duration
for SVG in "${SVG_FILES[@]}"; do
    echo "Processing $SVG..."

    # Convert SVG to PNG with transparency using ImageMagick or Inkscape
    # Try ImageMagick first
    if command -v magick &> /dev/null || command -v convert &> /dev/null; then
        CONVERT_CMD="convert"
        if command -v magick &> /dev/null; then
            CONVERT_CMD="magick"
        fi
        $CONVERT_CMD -background none -density 300 "$SVG" -resize "${WIDTH}x${HEIGHT}" "$TEMP_DIR/temp.png"
    elif command -v inkscape &> /dev/null; then
        inkscape --export-type=png --export-background-opacity=0 \
                 --export-width=$WIDTH --export-height=$HEIGHT \
                 --export-filename="$TEMP_DIR/temp.png" "$SVG"
    elif command -v rsvg-convert &> /dev/null; then
        rsvg-convert -w $WIDTH -h $HEIGHT -b none "$SVG" -o "$TEMP_DIR/temp.png"
    else
        echo "Error: No SVG converter found. Please install ImageMagick, Inkscape, or librsvg"
        rm -rf "$TEMP_DIR"
        exit 1
    fi

    # Duplicate this frame for the specified duration
    for ((i=0; i<FRAMES_PER_SVG; i++)); do
        cp "$TEMP_DIR/temp.png" "$TEMP_DIR/frame_$(printf "%05d" $FRAME_NUM).png"
        ((FRAME_NUM++))
    done

    rm "$TEMP_DIR/temp.png"
done

echo "Created $FRAME_NUM total frames"

# Create WebM with VP9 codec and alpha channel (best for Chrome and modern Safari)
echo "Creating WebM with alpha channel..."
ffmpeg -y -framerate $FPS -i "$TEMP_DIR/frame_%05d.png" \
    -c:v libvpx-vp9 \
    -pix_fmt yuva420p \
    -auto-alt-ref 0 \
    -b:v 2M \
    -deadline good \
    -cpu-used 2 \
    -an \
    "$OUTPUT_WEBM"

echo "WebM created: $OUTPUT_WEBM"

# Create MOV with ProRes 4444 as intermediate (preserves alpha for HEVC conversion)
echo "Creating ProRes MOV as intermediate..."
ffmpeg -y -framerate $FPS -i "$TEMP_DIR/frame_%05d.png" \
    -c:v prores_ks \
    -profile:v 4444 \
    -pix_fmt yuva444p10le \
    -vendor ap10 \
    -an \
    "$OUTPUT_PRORES"

echo "ProRes intermediate created: $OUTPUT_PRORES"

# Create HEVC with alpha using Apple's avconvert (native macOS encoder)
# This creates proper multi-layer HEVC with alpha that works in Safari
echo "Creating HEVC MOV with alpha using avconvert (Apple native)..."
avconvert --source "$OUTPUT_PRORES" \
    --output "$OUTPUT_MOV" \
    --preset PresetHEVCHighestQualityWithAlpha \
    --replace

echo "HEVC MOV created: $OUTPUT_MOV"

# Clean up temporary files
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo ""
echo "=========================================="
echo "Animation complete!"
echo "=========================================="
echo "Output files:"
echo "  - $OUTPUT_MOV (HEVC with alpha via VideoToolbox - Best for Safari, small file)"
echo "  - $OUTPUT_WEBM (WebM VP9 with alpha - Chrome, Safari)"
echo "  - $OUTPUT_PRORES (ProRes 4444 intermediate - can be deleted)"
echo ""
echo "Total frames: $FRAME_NUM"
echo "Duration: $(echo "scale=2; $FRAME_NUM / $FPS" | bc) seconds"
echo ""
echo "Recommended HTML for Safari with best quality/size:"
echo "<video autoplay loop muted playsinline>"
echo "  <source src=\"$OUTPUT_MOV\" type=\"video/quicktime\">"
echo "  <source src=\"$OUTPUT_WEBM\" type=\"video/webm\">"
echo "</video>"
