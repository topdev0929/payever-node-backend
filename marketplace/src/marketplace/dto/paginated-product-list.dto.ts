import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedProductListDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ProductDto)
  public list: ProductDto[];

  @ApiProperty()
  @IsNumber()
  public perPage: number;

  @ApiProperty()
  @IsNumber()
  public page: number;

  @ApiProperty()
  @IsNumber()
  public total: number;
}
