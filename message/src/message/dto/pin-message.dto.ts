import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class PinMessageDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public messageId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public sender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public chat: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public forAllUsers?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public notifyAllMembers?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public contacts: string[];
}
