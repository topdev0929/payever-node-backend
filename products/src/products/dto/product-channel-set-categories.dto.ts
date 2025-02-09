import { ProductCategoryDto } from './product-category.dto';
import { IsString, IsOptional } from 'class-validator';

export class ProductChannelSetCategoriesDto {
  @IsString()
  public channelSetId: string;
  
  @IsOptional()
  public categories: ProductCategoryDto[];

  @IsString()
  public channelSetType: string;
}
