import { readAndCompressImage } from "browser-image-resizer";

export function imageResize(imageFile, mode) {
  let config;
  switch (mode) {
    case "post":
      config = {
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        mimeType: "image/webp",
      };
      break;

    default:
      break;
  }

  return readAndCompressImage(imageFile, config);
}
