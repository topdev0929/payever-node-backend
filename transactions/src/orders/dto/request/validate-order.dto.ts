import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ValidateOrderDto {
  @ApiProperty()
  @IsNumber()
  @Max(99999999.99)
  @IsNotEmpty()
  @Type(() => Number)
  public amount: number;
}
