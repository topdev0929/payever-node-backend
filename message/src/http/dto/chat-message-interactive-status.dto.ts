import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class ChatMessageInteractiveStatusHttpRequestDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public marked: boolean;
}
