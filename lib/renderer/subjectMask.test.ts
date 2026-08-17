import { describe, expect, it } from "vitest";
import { createSubjectMask } from "./subjectMask";

describe("subject mask", () => {
  it("removes border-colored background and retains a contrasting subject", () => {
    const width = 5;
    const height = 5;
    const pixels = new Uint8ClampedArray(width * height * 4).fill(255);
    const center = (2 * width + 2) * 4;
    pixels[center] = pixels[center + 1] = pixels[center + 2] = 0;
    const mask = createSubjectMask(pixels, width, height, 48);
    expect(mask[0]).toBe(0);
    expect(mask[2 * width + 2]).toBe(255);
  });
});
