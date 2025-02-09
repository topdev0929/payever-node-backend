import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class ForwardMessageWsRequestDto {
  @ApiProperty({
    isArray: true,
    type: String,
  })
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  public ids: string[];

  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  public chat: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public withSender: boolean;
}
