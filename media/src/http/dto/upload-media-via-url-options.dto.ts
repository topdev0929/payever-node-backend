import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UploadMediaOptionsDto } from './upload-media-options.dto';

export class UploadMediaViaUrlOptionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public url: string;
}
