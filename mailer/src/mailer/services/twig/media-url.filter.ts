import { environment } from '../../../environments/environment';

export class MediaUrlFilter {
  public static filter(blobName: string, container: string): string {
    return `${environment.blobStorageUrl}/${container}/${blobName}`;
  }
}
