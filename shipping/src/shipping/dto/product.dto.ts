import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ProductInterface } from '../interfaces/products.interface';

export class ProductDto implements ProductInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public sku: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public imageUrl: string;
}
