import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadMediaOptionsDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Transform((val: any) => [true, 'enabled', 'true', 1, '1'].indexOf(val) > -1)
  public generateThumbnail: boolean = true;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Transform((val: any) => [true, 'enabled', 'true', 1, '1'].indexOf(val) > -1)
  public compress: boolean = false;
}
