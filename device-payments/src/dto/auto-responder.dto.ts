import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class AutoResponderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Transform((value: string) => value ? value.replace(/[^+\d]/g, '') : null)
  public to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Transform((value: string) => value ? value.replace(/[^+\d]/g, '') : null)
  public from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public message: string;
}
