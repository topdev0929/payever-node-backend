export interface MediaServiceInterface {
  create(userId: string, containerName: string, blobName: string): Promise<void>;
}
