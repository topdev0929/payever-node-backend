import { FilterInterface } from '../interfaces';
import {
  FilterFieldTypeEnum,
  NumberFieldConditionEnum,
  ObjectFieldConditionEnum,
  RangeFieldConditionEnum,
  StringFieldConditionEnum,
} from '../enums';

type Enum = string | number;
export type FilterFieldMapping<T extends Enum> = { [key in T]: string };

export class QueryBuilder<T extends Enum> {
  constructor(private mapping: FilterFieldMapping<T>) { }

  public buildQuery(filters: FilterInterface[]): any {
    const fullQuery: any = { };
    (filters || []).forEach((filter: FilterInterface) => {
      let fieldQuery: any = null;
      if (!filter.fieldType) {
        filter.fieldType = typeof(filter.value) as any;
      }
      switch (filter.fieldType) {
        case FilterFieldTypeEnum.Number:
          fieldQuery = QueryBuilder.buildNumberFieldQuery(
            filter.fieldCondition as NumberFieldConditionEnum,
            filter.value,
          );
          break;
        case FilterFieldTypeEnum.String:
          fieldQuery = QueryBuilder.buildStringFieldQuery(
            filter.fieldCondition as StringFieldConditionEnum,
            filter.value,
          );
          break;
        case FilterFieldTypeEnum.Object:
          fieldQuery = this.buildObjectFieldQuery(
            filter.fieldCondition as ObjectFieldConditionEnum,
            filter.value,
          );
          break;
        case FilterFieldTypeEnum.Nested:
          fieldQuery = QueryBuilder.buildRangeFieldQuery(
            filter.fieldCondition as RangeFieldConditionEnum,
            filter.value,
          );
          break;
        default:
          break;
      }
      if (fieldQuery && this.mapping[filter.field]) {
        const productField: string = this.mapping[filter.field];
        fullQuery[productField] = fieldQuery;
      }
      if (!filter.field &&
        [ObjectFieldConditionEnum.Or, ObjectFieldConditionEnum.And].includes(filter.fieldCondition as any)) {
        Object.assign(fullQuery, fieldQuery);
      }
    });

    return fullQuery;
  }

  public static buildRangeFieldQuery(condition: RangeFieldConditionEnum, value: any): any {
    const fieldCondition: RangeFieldConditionEnum = condition;
    const safeValue: string = QueryBuilder.escapeRegExp(value);
    const [ startNum, endNum ]: string[] = safeValue.split('|');
    if (fieldCondition !== RangeFieldConditionEnum.Range && !startNum && !endNum) {
      return null;
    }

    return {$gte: parseFloat(startNum) || 0, $lte: parseFloat(endNum) || 0};
  }

  public static buildStringFieldQuery(condition: StringFieldConditionEnum, value: any): any {
    const fieldCondition: StringFieldConditionEnum = condition || StringFieldConditionEnum.Contains;
    const safeValue: string = QueryBuilder.escapeRegExp(value);
    switch (fieldCondition) {
      case StringFieldConditionEnum.Is:
        return { $eq: value };
      case StringFieldConditionEnum.IsNot:
        return { $ne: value };
      case StringFieldConditionEnum.Contains:
        return { $regex: safeValue, $options: 'i' };
      case StringFieldConditionEnum.DoesNotContain:
        return { $not: new RegExp(safeValue, 'i') };
      case StringFieldConditionEnum.StartsWith:
        return { $regex: `^${safeValue}`, $options: 'i' };
      case StringFieldConditionEnum.EndsWith:
        return { $regex: `${safeValue}$`, $options: 'i' };
    }

    return null;
  }

  public buildObjectFieldQuery(condition: ObjectFieldConditionEnum, value: any): any {
    switch (condition) {
      case ObjectFieldConditionEnum.In:
        return { $in: value };
      case ObjectFieldConditionEnum.Is:
        return { $eq: value };
      case ObjectFieldConditionEnum.Or:
        return { $or: value.map((val: any) => {
          return this.buildQuery([val]); 
        }) };
      case ObjectFieldConditionEnum.And:
        return { $and: value.map((val: any) => {
          return this.buildQuery([val]); 
        }) };
    }

    return null;
  }

  public static buildNumberFieldQuery(condition: NumberFieldConditionEnum, value: any): any {
    const fieldCondition: NumberFieldConditionEnum = condition || NumberFieldConditionEnum.Is;
    const numValue: number = Number(value);
    switch (fieldCondition) {
      case NumberFieldConditionEnum.Is:
        return { $eq: numValue };
      case NumberFieldConditionEnum.IsNot:
        return { $ne: numValue };
      case NumberFieldConditionEnum.LessThan:
        return { $lt: numValue };
      case NumberFieldConditionEnum.GreaterThan:
        return { $gt: numValue };
    }

    return null;
  }

  public static combineQueries(...queries: any[]): any {
    return { $and: queries };
  }

  public static mergeQuery(targetQuery: any, sourceQuery: any): any {
    return sourceQuery ? Object.assign(targetQuery, sourceQuery) : targetQuery;
  }

  public static buildStringContainsQuery(input: string): any {
    const safeInput: string = QueryBuilder.escapeRegExp(input);

    return { $regex: safeInput, $options: 'i' };
  }

  public static escapeRegExp(input: string): string {
    input = input || '';

    return input.replace(/([.*+?^${}()|[\]\\])/gm, '\\$1');
  }
}
