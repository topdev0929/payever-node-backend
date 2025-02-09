export class CompressorNotFoundException extends Error {
  constructor(mimeType: string) {
    super(`Compressor for file type "${mimeType}" not found`);
  }
}
