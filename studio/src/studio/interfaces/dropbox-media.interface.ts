export interface DropboxMediaInterface {
  lastError?: any;
  lastModified: Date;
  name: string;
  path: string;
  sourceId: string;
  type?: string;
  downloaded?: boolean;
  isDownloadable?: boolean;
  size?: number;
  tries?: number;
  compressedSize?: number;
}
