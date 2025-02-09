import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StudioImagesUploadedErrorDto {
  @ApiProperty()
  @IsOptional()
  public businessId: string;

  @ApiProperty()
  @IsOptional()
  public medias: string[];

  @ApiProperty()
  @IsOptional()
  public error: any;
}
