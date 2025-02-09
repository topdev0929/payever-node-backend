import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderAppDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public microUuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public order: number;
}
