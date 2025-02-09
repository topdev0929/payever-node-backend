import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SecondFactorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform((value: string) => Number(value))
  public secondFactorCode: number;
}
