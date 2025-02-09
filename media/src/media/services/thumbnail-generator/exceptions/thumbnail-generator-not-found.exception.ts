export class ThumbnailGeneratorNotFoundException extends Error {
  constructor(mimeType: string) {
    super(`Thumbnail Generator for file type "${mimeType}" not found`);
  }
}
