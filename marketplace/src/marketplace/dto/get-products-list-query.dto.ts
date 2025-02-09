import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsListQueryDto {
  @ApiProperty()
  @IsNumber()
  public page: number;

  @ApiProperty()
  @IsNumber()
  public perPage: number;
}
