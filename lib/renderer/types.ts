export type PortraitMode = "color" | "mono";
export type TextMode = "word" | "character";
export type Background = "white" | "black" | "transparent";
export interface RenderSettings { mode: PortraitMode; textMode: TextMode; background: Background; subjectOnly: boolean; maskSensitivity: number; textSize: number; spacing: number; density: number; contrast: number; brightness: number; rotation: number }
export interface NormalizedImage { source: CanvasImageSource; width: number; height: number; release: () => void; optimized: boolean }
export const DEFAULT_SETTINGS: RenderSettings = { mode: "color", textMode: "word", background: "white", subjectOnly: true, maskSensitivity: 48, textSize: 12, spacing: 1, density: 78, contrast: 110, brightness: 100, rotation: 0 };
