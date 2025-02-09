import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestPublishThemeDto {
  @ApiProperty({ required: false })
  @IsString()
  public application: string;

  @ApiProperty({ required: false })
  @IsString()
  public theme: string;
}
