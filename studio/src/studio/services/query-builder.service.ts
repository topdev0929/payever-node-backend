import { FilterInterface } from '../interfaces';
import {
  FilterFieldTypeEnum,
  NumberFieldConditionEnum,
  ObjectFieldConditionEnum,
  StringFieldConditionEnum,
} from '../enums';
import { Injectable } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeModel, UserAttributeModel } from '../models';
import { UserAttributeService } from './user-attribute.service';

@Injectable()
export class QueryBuilderService {
  constructor(
    private readonly attributeService: AttributeService,
    private readonly userAttributeService: UserAttributeService,
  ) { }

  public async buildQuery(filters: FilterInterface[], businessId: string): Promise<any> {
    let fullQuery: any = { };
    for (const filter of (filters || [])) {
      let fieldQuery: any = null;
      if (!filter.fieldType) {
        filter.fieldType = typeof(filter.value) as any;
      }
      switch (filter.fieldType) {
        case FilterFieldTypeEnum.Number:
          fieldQuery = QueryBuilderService.buildNumberFieldQuery(
            filter.fieldCondition as NumberFieldConditionEnum,
            filter.value,
          );
          break;
        case FilterFieldTypeEnum.String:
          fieldQuery = QueryBuilderService.buildStringFieldQuery(
            filter.fieldCondition as StringFieldConditionEnum,
            filter.value,
          );
          break;
        case FilterFieldTypeEnum.Object:
          fieldQuery = await this.buildObjectFieldQuery(
            filter.fieldCondition as ObjectFieldConditionEnum,
            filter.value,
            businessId,
          );
          break;
        default:
          break;
      }


      if (fieldQuery && filter.field) {
        fullQuery = await this.userMediaQuery(fullQuery, filter.field, fieldQuery, businessId);
      }

      if (!filter.field &&
        [ObjectFieldConditionEnum.Or, ObjectFieldConditionEnum.And].includes(filter.fieldCondition as any)) {
        Object.assign(fullQuery, fieldQuery);
      }
    }

    if (fullQuery.$or && fullQuery.$or.length === 0) {
      delete fullQuery.$or;
    }

    return fullQuery;
  }

  private async userMediaQuery(
    fullQuery: any,
    field: string,
    fieldQuery: any,
    businessId: string,
  ): Promise<any> {
    let queryData: any;

    switch (true) {
      case field === '_id':
      case field === 'name':
      case field === 'url':
      case field === 'mediaType':
        const query: any = { };
        query[field] = fieldQuery;
        queryData = query;
        break;

      default:
        const orConditions: any[] = [];
        const attributes: AttributeModel[] = await this.attributeService.findByName(field);
        for (const attribute of attributes) {
          orConditions.push(
            {
              attributes: {
                $elemMatch : {
                  attribute: attribute._id,
                  value: fieldQuery,
                },
              },
            },
          );
        }
        const userAttributes: UserAttributeModel[] = await this.userAttributeService.findByNameAndBusiness(
          field,
          businessId,
        );
        for (const attribute of userAttributes) {
          orConditions.push(
            {
              userAttributes: {
                $elemMatch : {
                  attribute: attribute._id,
                  value: fieldQuery,
                },
              },
            },
          );
        }
        queryData = {
          $or: orConditions,
        };
        break;
    }

    if (queryData) {
      if (queryData.$or && fullQuery.$or) {
        fullQuery.$or = fullQuery.$or.concat(queryData.$or);
      } else {
        fullQuery = {
          ...fullQuery,
          ...queryData,
        };
      }
    }

    return fullQuery;
  }

  public static combineQueries(...queries: any[]): any {
    return { $and: queries };
  }

  public static mergeQuery(targetQuery: any, sourceQuery: any): any {
    return sourceQuery ? Object.assign(targetQuery, sourceQuery) : targetQuery;
  }

  public static buildStringContainsQuery(input: string): any {
    const safeInput: string = QueryBuilderService.escapeRegExp(input);

    return { $regex: safeInput, $options: 'i' };
  }

  private static buildStringFieldQuery(condition: StringFieldConditionEnum, value: any): any {
    const fieldCondition: StringFieldConditionEnum = condition || StringFieldConditionEnum.Contains;
    const safeValue: string = QueryBuilderService.escapeRegExp(value);
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

  private async buildObjectFieldQuery(
    condition: ObjectFieldConditionEnum,
    value: any,
    businessId: string,
  ): Promise<any> {
    switch (condition) {
      case ObjectFieldConditionEnum.In:
        return { $in: value };
      case ObjectFieldConditionEnum.Is:
        return { $eq: value };
      case ObjectFieldConditionEnum.Or:
        const orPromises: Array<Promise<any>> = value.map(async (val: any) => {
          return this.buildQuery([val], businessId);
        });

        return { $or: await Promise.all(orPromises) };
      case ObjectFieldConditionEnum.And:
        const andPromises:  Array<Promise<any>> = value.map(async (val: any) => {
          return this.buildQuery([val], businessId);
        });

        return { $and: await Promise.all(andPromises) };
    }

    return null;
  }

  private static buildNumberFieldQuery(condition: NumberFieldConditionEnum, value: any): any {
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

  private static escapeRegExp(input: string): string {
    input = input || '';

    return input.replace(/([.*+?^${}()|[\]\\])/gm, '\\$1');
  }
}
