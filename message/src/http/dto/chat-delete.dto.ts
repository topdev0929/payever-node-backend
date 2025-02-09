import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class ChatDeleteHttpRequestDto {
  // deprecated
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public deleteForEveryone?: boolean;
}
