import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class DirectChatCreateHttpRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public peer: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public parentFolderId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public title?: string;
}
