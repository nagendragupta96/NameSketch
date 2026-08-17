/** EXIF orientations swap the logical dimensions for quarter-turn rotations. */
export function orientedDimensions(width: number, height: number, orientation: number) {
  return orientation >= 5 && orientation <= 8
    ? { width: height, height: width }
    : { width, height };
}

export function validExifOrientation(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 8 ? value : 1;
}
