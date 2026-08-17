import type { RenderSettings } from "./types";
export const brightness = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;
export const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");
export function textSequence(name: string, characterMode: boolean) { const clean = normalizeName(name); return characterMode ? [...clean.replace(/\s/g, "")].join(" ") : clean; }
export function sanitizeFilename(name: string) { const slug = normalizeName(name).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50); return `namesketch-${slug || "artwork"}.png`; }
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
export function normalizeSettings(s: RenderSettings): RenderSettings { return { ...s, textSize: clamp(s.textSize, 6, 32), spacing: clamp(s.spacing, .5, 3), density: clamp(s.density, 20, 100), contrast: clamp(s.contrast, 50, 180), brightness: clamp(s.brightness, 50, 150), rotation: clamp(s.rotation, -45, 45) }; }
