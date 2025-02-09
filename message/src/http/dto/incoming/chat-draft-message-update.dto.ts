import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class ChatDraftMessageUpdateHttpRequestDto {
  @ApiProperty({ required: true })
  @IsString()
  public content: string;
}
