import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ChatMessageComponentDto, ChatMessageInteractiveDto } from '../../message/dto';

export class ChatMessageUpdateHttpRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public action?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public content?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public contentType?: string;

  @ApiProperty()
  @IsOptional()  
  public contentPayload?: any;

  @ApiProperty({ isArray: true, required: false, type: ChatMessageComponentDto })
  @ValidateNested({ each: true })
  @Type(() => ChatMessageComponentDto)
  @IsOptional()
  public components?: ChatMessageComponentDto[];

  @ApiProperty({ required: false, type: ChatMessageInteractiveDto })
  @ValidateNested()
  @Type(() => ChatMessageInteractiveDto)
  @IsOptional()
  public interactive?: ChatMessageInteractiveDto;
}
