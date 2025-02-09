import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public url: string;
}
