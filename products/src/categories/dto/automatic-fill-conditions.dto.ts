import { IsArray, IsBoolean, IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CollectionProductFilterDto } from './collection-product-filter.dto';

export class AutomaticFillConditions {
  @IsBoolean()
  public strict: boolean;

  @ValidateNested({ each: true})
  @Type(() => CollectionProductFilterDto)
  @IsDefined()
  @IsArray()
  public filters: CollectionProductFilterDto[];
}
