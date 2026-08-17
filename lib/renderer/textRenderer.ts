import { createSubjectMask, maskToImageData } from "./subjectMask";
import type { RenderSettings } from "./types";
import { brightness, normalizeSettings, textSequence } from "./utils";

export function renderTextPortrait(
  target: HTMLCanvasElement,
  source: CanvasImageSource,
  width: number,
  height: number,
  name: string,
  raw: RenderSettings,
  scale = 1,
) {
  const settings = normalizeSettings(raw);
  const maxDimension = scale > 1 ? 3600 : 1400;
  const fit = Math.min(1, maxDimension / Math.max(width, height));
  const canvasWidth = Math.round(width * fit * scale);
  const canvasHeight = Math.round(height * fit * scale);
  target.width = canvasWidth;
  target.height = canvasHeight;

  const output = target.getContext("2d", { alpha: true });
  if (!output) throw new Error("Canvas is unavailable in this browser.");

  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = canvasWidth;
  sampleCanvas.height = canvasHeight;
  const sampler = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampler) throw new Error("Canvas is unavailable in this browser.");
  sampler.drawImage(source, 0, 0, canvasWidth, canvasHeight);
  const imageData = sampler.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixels = imageData.data;

  output.clearRect(0, 0, canvasWidth, canvasHeight);
  if (settings.background !== "transparent") {
    output.fillStyle = settings.background;
    output.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  const inkCanvas = settings.subjectOnly ? document.createElement("canvas") : target;
  if (settings.subjectOnly) {
    inkCanvas.width = canvasWidth;
    inkCanvas.height = canvasHeight;
  }
  const ink = inkCanvas.getContext("2d", { alpha: true });
  if (!ink) throw new Error("Canvas is unavailable in this browser.");

  const fontSize = settings.textSize * scale;
  const stepY = Math.max(4, fontSize * settings.spacing);
  const phrase = textSequence(name, settings.textMode === "character");
  ink.font = `700 ${fontSize}px Manrope, sans-serif`;
  ink.textBaseline = "middle";
  const measured = Math.max(fontSize, ink.measureText(`${phrase} `).width);

  let row = 0;
  for (let y = stepY / 2; y < canvasHeight; y += stepY, row++) {
    const offset = -(row % 2) * measured / 2;
    for (let x = offset; x < canvasWidth; x += measured) {
      const sampleX = Math.max(0, Math.min(canvasWidth - 1, Math.round(x + measured / 2)));
      const sampleY = Math.min(canvasHeight - 1, Math.round(y));
      const index = (sampleY * canvasWidth + sampleX) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const luminance = brightness(r, g, b);
      const adjusted = Math.max(0, Math.min(255,
        (luminance - 128) * settings.contrast / 100 + 128 + (settings.brightness - 100) * 1.5,
      ));
      const strength = settings.background === "black" ? adjusted / 255 : 1 - adjusted / 255;
      const alpha = Math.max(0.08, Math.min(1, strength * settings.density / 62));
      ink.fillStyle = settings.mode === "color"
        ? `rgba(${r},${g},${b},${Math.max(0.28, settings.density / 100)})`
        : `rgba(${settings.background === "black" ? 255 : 0},${settings.background === "black" ? 255 : 0},${settings.background === "black" ? 255 : 0},${alpha})`;
      ink.save();
      ink.translate(x, y);
      ink.rotate(settings.rotation * Math.PI / 180);
      ink.fillText(phrase, 0, 0);
      ink.restore();
    }
  }

  if (settings.subjectOnly) {
    const mask = createSubjectMask(pixels, canvasWidth, canvasHeight, settings.maskSensitivity);
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvasWidth;
    maskCanvas.height = canvasHeight;
    maskCanvas.getContext("2d")?.putImageData(maskToImageData(mask, canvasWidth, canvasHeight), 0, 0);
    ink.globalCompositeOperation = "destination-in";
    ink.drawImage(maskCanvas, 0, 0);
    output.drawImage(inkCanvas, 0, 0);
    maskCanvas.width = maskCanvas.height = 0;
    inkCanvas.width = inkCanvas.height = 0;
  }

  sampleCanvas.width = sampleCanvas.height = 0;
}
