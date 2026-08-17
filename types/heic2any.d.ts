declare module "heic2any" {
  export interface Heic2AnyOptions {
    blob: Blob;
    toType?: "image/jpeg" | "image/png" | "image/gif";
    quality?: number;
    multiple?: boolean;
  }

  /** Converts a HEIC/HEIF blob entirely in the browser. */
  export default function heic2any(
    options: Heic2AnyOptions,
  ): Promise<Blob | Blob[]>;
}
