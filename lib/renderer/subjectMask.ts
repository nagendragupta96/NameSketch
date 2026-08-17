/**
 * Creates a foreground matte without uploading the image or loading an ML model.
 * Border colors describe the likely background; pixels unlike every sampled
 * border color are retained. A soft transition keeps hair and antialiased edges.
 */
export function createSubjectMask(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  sensitivity: number,
): Uint8ClampedArray {
  const palette: Array<[number, number, number]> = [];
  const stride = Math.max(1, Math.floor(Math.min(width, height) / 32));
  const add = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    palette.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
  };

  for (let x = 0; x < width; x += stride) {
    add(x, 0);
    add(x, height - 1);
  }
  for (let y = stride; y < height - 1; y += stride) {
    add(0, y);
    add(width - 1, y);
  }

  const mask = new Uint8ClampedArray(width * height);
  const threshold = 12 + sensitivity * 0.72;
  const feather = Math.max(8, threshold * 0.45);

  for (let p = 0; p < width * height; p++) {
    const i = p * 4;
    let closest = Number.POSITIVE_INFINITY;
    for (const [r, g, b] of palette) {
      const dr = pixels[i] - r;
      const dg = pixels[i + 1] - g;
      const db = pixels[i + 2] - b;
      closest = Math.min(closest, Math.sqrt(dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11));
    }
    mask[p] = Math.round(Math.max(0, Math.min(1, (closest - threshold + feather) / feather)) * 255);
  }

  return mask;
}

export function maskToImageData(mask: Uint8ClampedArray, width: number, height: number): ImageData {
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let p = 0; p < mask.length; p++) {
    const i = p * 4;
    rgba[i] = rgba[i + 1] = rgba[i + 2] = 255;
    rgba[i + 3] = mask[p];
  }
  return new ImageData(rgba, width, height);
}
