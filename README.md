# NameSketch

NameSketch is a privacy-first creative tool that reconstructs photographs entirely from a supplied name. From a distance the colored or monochrome type resembles the source portrait; up close, its letters become visible. The source is sampled, never painted beneath the generated marks.

## Stack

Next.js App Router, React, strict TypeScript, Tailwind CSS, HTML Canvas, the Browser File API, and `heic2any` for a local HEIC/HEIF fallback. There is no backend, account, storage, or external conversion API.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production validation uses `npm run lint`, `npm test`, and `npm run build`; serve a build with `npm start`.

## Rendering pipeline

1. `normalizeUploadedImage` validates the file, requests orientation-aware browser decoding, and falls back to in-browser HEIC conversion.
2. Large sources are downscaled to a safe preview buffer while retaining aspect ratio.
3. An offscreen canvas supplies pixel RGBA values. The renderer uses perceptual luminance (`0.299R + 0.587G + 0.114B`) and the selected controls to lay out repeated words or characters.
4. Only glyphs are drawn to the output canvas. Color mode samples local source color; monochrome maps brightness to ink intensity.
5. High-quality export reruns the renderer at 2× rather than stretching its preview.

Browser orientation-aware `createImageBitmap` normalizes EXIF orientation before preview, comparison, rendering, and export. Temporary bitmaps and canvas buffers are released. Unsupported Live Photo video assets receive a still-photo prompt. DNG/RAW is intentionally not supported.

## Formats and privacy

JPEG/JPG, PNG, WEBP, HEIC, and HEIF are accepted by MIME type and/or extension (up to 75 MB). Native HEIC decoding is tried first; `heic2any` converts locally only when needed. Images and generated art never leave the browser.

## Structure

- `app/` — App Router shell and visual system
- `components/` — upload, controls, studio, and canvas preview UI
- `lib/renderer/imageDecoder.ts` — unified validation, decoding, orientation, and scaling
- `lib/renderer/textRenderer.ts` — format-independent text portrait engine
- `lib/renderer/exportImage.ts` — fresh PNG export rendering
- `lib/renderer/*.test.ts` — pure utility and format tests
