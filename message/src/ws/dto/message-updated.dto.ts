import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ChatMessageComponentWsRequestDto, ChatMessageInteractiveWsRequestDto } from './incoming';

export class MessageUpdateWsRequestDto {
  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  public _id: string;

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

  @ApiProperty({ isArray: true, required: false, type: ChatMessageComponentWsRequestDto })
  @ValidateNested({ each: true })
  @Type(() => ChatMessageComponentWsRequestDto)
  @IsOptional()
  public components?: ChatMessageComponentWsRequestDto[];

  @ApiProperty({ required: false, type: ChatMessageInteractiveWsRequestDto })
  @ValidateNested()
  @Type(() => ChatMessageInteractiveWsRequestDto)
  @IsOptional()
  public interactive?: ChatMessageInteractiveWsRequestDto;
}
