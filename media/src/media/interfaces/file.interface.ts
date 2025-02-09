export interface MemFile {
  field?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  buffer: Buffer;
}

export interface FileInterface {
  originalFileName: string;
  uniqfileName: string;
  mimeType: string;
  fileSize: number;
}

export interface FsFile extends FileInterface {
  localPath: string;
}

export interface StreamFile extends FileInterface {
  stream: NodeJS.ReadableStream;
}
