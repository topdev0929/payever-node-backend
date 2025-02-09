import { ApiProperty } from '@nestjs/swagger';
import { EmailTypeEnum } from '../enums/email-type.enum';
import { IsString, IsNotEmpty } from 'class-validator';

export class BlockEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public type: EmailTypeEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public value: string;
}
