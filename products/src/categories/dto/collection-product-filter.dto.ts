import { IsEnum, IsNotEmpty, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { FilterFieldTypeEnum } from '../../common/enums';
import { FilterFieldConditionForProductBusiness } from '../../common/types';

export class CollectionProductFilterDto {
  @IsString()
  @IsNotEmpty()
  public field: string;

  @IsEnum(FilterFieldTypeEnum)
  public fieldType: FilterFieldTypeEnum;

  @IsString()
  public fieldCondition: FilterFieldConditionForProductBusiness;

  @ValidateIf((o: CollectionProductFilterDto) => !o.filters)
  @IsString()
  public value?: string;

  @ValidateIf((o: CollectionProductFilterDto) => !o.value)
  @ValidateNested({ each: true })
  @Type(() => CollectionProductFilterDto)
  public filters?: CollectionProductFilterDto[];
}
