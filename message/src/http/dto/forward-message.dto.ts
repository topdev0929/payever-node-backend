import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsArray,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class ForwardMessageHttpRequestDto {
  @ApiProperty({
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  public ids: string[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public withSender: boolean;
}
