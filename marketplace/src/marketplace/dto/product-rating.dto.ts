import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductRatingDto {
  @ApiProperty()
  @IsNumber()
  public rating: number;

  @ApiProperty()
  @IsNumber()
  public votesCount: number;
}
