import { CommonFilterInterface, FilterFieldTypeEnum } from '@pe/nest-kit';
import { IsNotEmpty, IsEnum } from 'class-validator';

import { PriceConditionFieldEnum, AllFilterFieldConditionObject, AllFilterFieldCondition } from '../enums';

type ValueType = string | number | boolean;

// tslint:disable-next-line: max-union-size
export class ProductPriceConditionDto implements Pick<CommonFilterInterface, 'field' | 'fieldType' | 'value'> {
  @IsNotEmpty()
  @IsEnum(PriceConditionFieldEnum)
  public field: PriceConditionFieldEnum;

  @IsNotEmpty()
  @IsEnum(FilterFieldTypeEnum)
  public fieldType: FilterFieldTypeEnum;

  @IsNotEmpty()
  @IsEnum(AllFilterFieldConditionObject)
  public fieldCondition: AllFilterFieldCondition;

  @IsNotEmpty()
  public value: ValueType | ValueType[];
}
