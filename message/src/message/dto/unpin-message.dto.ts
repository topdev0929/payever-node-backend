import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UnpinMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public pinId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public chatId: string;
}
