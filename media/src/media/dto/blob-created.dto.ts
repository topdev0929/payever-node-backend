import { ApiProperty } from '@nestjs/swagger';

export class BlobCreatedDto {
  @ApiProperty()
  public blobName: string;

  @ApiProperty()
  public brightnessGradation?: string;

  @ApiProperty()
  public preview?: string;

  @ApiProperty()
  public thumbnail?: string;

  @ApiProperty()
  public thumbnailBlobName?: string;

  @ApiProperty()
  public compress?: boolean;

  @ApiProperty()
  public fileSize?: number;

  @ApiProperty()
  public mimeType?: string;
}
