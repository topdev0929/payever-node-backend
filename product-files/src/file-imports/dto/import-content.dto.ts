import { ProductDto } from './products';
import { ValidateNested } from 'class-validator';
import { PostParseErrorDto } from '../../file-processor/dto';
import { ImportedSummaryItemDto } from './imported-summary-item.dto';

export class ImportContentDto {
  @ValidateNested({ each: true })
  public products: ProductDto[];

  @ValidateNested({ each: true })
  public errors: PostParseErrorDto[];

  private items: ImportedSummaryItemDto[];

  constructor(products: ProductDto[]) {
    this.products = products;
  }
}
