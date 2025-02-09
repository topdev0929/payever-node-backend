import { FilterFieldTypeEnum, StringFieldConditionEnum } from '../../common/enums';
import { FilterInterface } from '../../common/interfaces/filter.interface';

export class ExpandFilterHelper {
  public static expandChildFilter(filter: FilterInterface): FilterInterface {
    const splitFieldName: string[] = filter.field.split('.');
    const parentFieldName: string = splitFieldName.shift();
    const parentFieldType: FilterFieldTypeEnum = this.getFieldType(parentFieldName);

    let newFilter: FilterInterface;

    if (parentFieldName && parentFieldType) {
      filter.field = splitFieldName.join('.');
      newFilter = {
        field: parentFieldName,
        fieldCondition: StringFieldConditionEnum.Is,
        fieldType: parentFieldType,
        filters: [filter],
      };
    }

    return newFilter || filter;
  }

  private static getFieldType(fieldName: string): FilterFieldTypeEnum {
    if (fieldName === 'variants') {
      return FilterFieldTypeEnum.Child;
    }
  }
}
