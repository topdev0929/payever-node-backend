import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessageComponentHttpRequestDto, ChatMessageInteractiveHttpRequestDto } from '../incoming';

export class ChatMessageTemplateUpdateHttpRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public action?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public content?: string;

  @ApiProperty({ isArray: true, required: false, type: ChatMessageComponentHttpRequestDto })
  @ValidateNested({ each: true })
  @Type(() => ChatMessageComponentHttpRequestDto)
  @IsOptional()
  public components?: ChatMessageComponentHttpRequestDto[];

  @ApiProperty({ required: false, type: ChatMessageInteractiveHttpRequestDto })
  @ValidateNested()
  @Type(() => ChatMessageInteractiveHttpRequestDto)
  @IsOptional()
  public interactive?: ChatMessageInteractiveHttpRequestDto;
}
