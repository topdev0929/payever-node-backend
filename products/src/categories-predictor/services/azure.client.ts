import { Injectable, Logger } from '@nestjs/common';
import {
  BlobServiceClient,
  BlobUploadCommonResponse,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';
import { environment } from '../../environments';

@Injectable()
export class AzureClient {

  private readonly blobUrl: string;
  private readonly sasKey: string;
  private readonly containerName: string;
  private readonly containerClient: ContainerClient;
  private readonly connectionString: string;
  private readonly context = 'AzureClient';

  constructor(
    private readonly logger: Logger,
  ) {
    this.blobUrl = environment.azure.mlAccountUrl;
    this.sasKey = environment.azure.mlCredential.replace(/^"(.*)"$/, '$1'); // Removes surrounding quotes
    this.containerName = environment.azure.mlContainerName;
    this.connectionString = environment.azure.mlConnectionString;
    this.containerClient = new ContainerClient(this.connectionString);
  }

  public async uploadFromPath(path: string): Promise<string> {
    let fileName: string = path.split('/').pop();
    if (!fileName || fileName.includes('/') || fileName.includes('\\')) {
      fileName = `${Date.now()}-no-name-specified`;
    }
    const downloadUrl: string = `${this.blobUrl}/${this.containerName}/${fileName}${this.sasKey}`;

    this.logger.log(
      {
        action: 'upload',
        blockBlob: fileName,
        connectionString: this.connectionString,
        containerName: this.containerName,
        downloadUrl: downloadUrl,
        filePath: path,
      },
      this.context,
    );
    const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    const uploadBlobResponse: BlobUploadCommonResponse = await blockBlobClient.uploadFile(path);
    this.logger.log(
      `Uploaded block blob ${fileName} successfully with status: ${uploadBlobResponse._response.status}`,
      this.context,
    );

    return downloadUrl;
  }

  public async downloadToPath(path: string, blob: string = null): Promise<void> {

    this.logger.log(
      {
        action: 'download',
        blockBlob: blob,
        connectionString: this.connectionString,
        containerName: this.containerName,
        filePath: path,
      },
      this.context,
    );
    const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(blob);
    const downloadBlobResponse: BlobUploadCommonResponse = await blockBlobClient.downloadToFile(path);
    this.logger.log(
      `Downloaded block blob ${blob} successfully to ${path} with status: ${downloadBlobResponse._response.status}`,
      this.context,
    );
  }
}
