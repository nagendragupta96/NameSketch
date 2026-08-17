import { renderTextPortrait } from "./textRenderer";
import { sanitizeFilename } from "./utils";
import type { NormalizedImage, RenderSettings } from "./types";
export async function exportArtwork(image: NormalizedImage, name: string, settings: RenderSettings, highQuality: boolean) { const canvas = document.createElement("canvas"); renderTextPortrait(canvas, image.source, image.width, image.height, name, settings, highQuality ? 2 : 1); const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Export failed.")), "image/png")); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = sanitizeFilename(name); a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
