import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class ChatMessageDeleteHttpRequestDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public deleteForEveryone?: boolean;
}
