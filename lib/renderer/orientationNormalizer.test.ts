import { describe, expect, it } from "vitest";
import { orientedDimensions, validExifOrientation } from "./orientationNormalizer";

describe("orientation normalization", () => {
  it("swaps dimensions for 90-degree EXIF orientations", () => {
    expect(orientedDimensions(4032, 3024, 6)).toEqual({ width: 3024, height: 4032 });
  });
  it("keeps dimensions for mirrored/180-degree orientations", () => {
    expect(orientedDimensions(4032, 3024, 3)).toEqual({ width: 4032, height: 3024 });
  });
  it("safely defaults invalid metadata", () => expect(validExifOrientation(99)).toBe(1));
});
