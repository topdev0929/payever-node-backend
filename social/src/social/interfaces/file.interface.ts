export interface File {
  field?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  buffer: Buffer;
}
