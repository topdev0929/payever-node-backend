import { FilterInterface } from '../interfaces';
import {
  FilterFieldTypeEnum,
  NumberFieldConditionEnum,
  ObjectFieldConditionEnum,
  StringFieldConditionEnum,
} from '../enums';
import { Injectable } from '@nestjs/common';

const nestedAttribute: any = {
  nested: {
    path: 'attributes',
    query: {
      bool: {
        must: [],
      },
    },
  },
};

const nonAttributes: string[] = ['_id', 'url', 'name'];

@Injectable()
export class QueryBuilderEsService {
  constructor( ) { }

  public async buildQuery(filters: FilterInterface[]): Promise<any> {
    const fullQuery: any = {
      query: {
        bool: {
          must: [],
          must_not: [],
          should: [],
        },
      },
    };

    for (const filter of (filters || [])) {
      let fieldQuery: any = null;
      if (!filter.fieldType) {
        filter.fieldType = typeof(filter.value) as any;
      }
      switch (filter.fieldType) {
        case FilterFieldTypeEnum.Number:
          fieldQuery = QueryBuilderEsService.buildNumberFieldQuery(
            filter.field,
            filter.fieldCondition as NumberFieldConditionEnum,
            filter.value,
          );
          break;
        case FilterFieldTypeEnum.String:
          fieldQuery = QueryBuilderEsService.buildStringFieldQuery(
            filter.field,
            filter.fieldCondition as StringFieldConditionEnum,
            filter.value,
          );
          break;
        case FilterFieldTypeEnum.Object:
          fieldQuery = await this.buildObjectFieldQuery(
            filter.field,
            filter.fieldCondition as ObjectFieldConditionEnum,
            filter.value,
          );
          break;
        default:
          break;
      }

      fullQuery.query.bool.must = fullQuery.query.bool.must.concat(fieldQuery.must);
      fullQuery.query.bool.must_not = fullQuery.query.bool.must_not.concat(fieldQuery.must_not);
      fullQuery.query.bool.should = fullQuery.query.bool.should.concat(fieldQuery.should);
    }

    return fullQuery;
  }

  private static esQueryType(term: any, queryType: string): any {
    switch (true) {
      case queryType === 'term':
        return { term: term };
      case queryType === 'wildcard':
        return { wildcard: term };
      case queryType === 'range':
        return { range: term };
      default:
        return ;
    }
  }

  private static subscriptionMediaQuery(field: string, value: any, queryType: string): any {
    if (nonAttributes.includes(field)) {
      const term: any = { };
      term[field] = value;

      return QueryBuilderEsService.esQueryType(term, queryType);
    } else {
      const nestedQuery: any = JSON.parse(JSON.stringify(nestedAttribute));
      nestedQuery.nested.query.bool.must.push(QueryBuilderEsService.esQueryType({ 'attributes.name': field }, 'term'));
      nestedQuery.nested.query.bool.must.push(QueryBuilderEsService.esQueryType({ 'attributes.value': value }, 'term'));

      return nestedQuery;
    }
  }

  public static combineQueries(...queries: any[]): any {
    return { $and: queries };
  }

  public static mergeQuery(targetQuery: any, sourceQuery: any): any {
    return sourceQuery ? Object.assign(targetQuery, sourceQuery) : targetQuery;
  }

  public static buildStringContainsQuery(input: string): any {
    const safeInput: string = QueryBuilderEsService.escapeRegExp(input);

    return { $regex: safeInput, $options: 'i' };
  }

  private static buildStringFieldQuery(field: string, condition: StringFieldConditionEnum, value: any): any {
    const boolQuery: any = {
      must: [],
      must_not: [],
      should: [],
    };
    const fieldCondition: StringFieldConditionEnum = condition || StringFieldConditionEnum.Contains;
    const safeValue: string = QueryBuilderEsService.escapeRegExp(value);
    switch (fieldCondition) {
      case StringFieldConditionEnum.Is:
        boolQuery.must.push(QueryBuilderEsService.subscriptionMediaQuery(field, safeValue, 'term'));

        return boolQuery;
      case StringFieldConditionEnum.IsNot:
        boolQuery.must_not.push(QueryBuilderEsService.subscriptionMediaQuery(field, safeValue, 'term'));

        return boolQuery;
      case StringFieldConditionEnum.Contains:
        boolQuery.must.push(
          QueryBuilderEsService.subscriptionMediaQuery(
            field,
            `*${safeValue}*`,
            'wildcard',
          ),
        );

        return boolQuery;
      case StringFieldConditionEnum.DoesNotContain:
        boolQuery.must_not.push(
          QueryBuilderEsService.subscriptionMediaQuery(
            field,
            `*${safeValue}*`,
            'wildcard',
          ),
        );

        return boolQuery;
      case StringFieldConditionEnum.StartsWith:
        boolQuery.must.push(
          QueryBuilderEsService.subscriptionMediaQuery(
            field,
            `${safeValue}*`,
            'wildcard',
          ),
        );

        return boolQuery;
      case StringFieldConditionEnum.EndsWith:
        boolQuery.must.push(
          QueryBuilderEsService.subscriptionMediaQuery(
            field,
            `*${safeValue}`,
            'wildcard',
          ),
        );

        return boolQuery;
    }

    return null;
  }

  private async buildObjectFieldQuery(field: string, condition: ObjectFieldConditionEnum, value: any): Promise<any> {
    const boolQuery: any = {
      must: [],
      must_not: [],
      should: [],
    };

    switch (condition) {
      case ObjectFieldConditionEnum.In:
        const inQuery: any = {
          bool: {
            should: [],
          },
        };

        for (const cond of value) {
          inQuery.bool.should.push(QueryBuilderEsService.subscriptionMediaQuery(field, cond, 'term'));
        }
        boolQuery.must.push(inQuery);

        return boolQuery;
      case ObjectFieldConditionEnum.Is:
        boolQuery.must.push(QueryBuilderEsService.subscriptionMediaQuery(field, value, 'term'));

        return boolQuery;
      case ObjectFieldConditionEnum.Or:
        const orPromises: Array<Promise<any>> = value.map(async (val: any) => this.buildQuery([val]));
        const andConditions: any[] = await Promise.all(orPromises);
        for (const cond of andConditions) {
          boolQuery.should = boolQuery.should.concat(cond.query.bool.must);
        }

        return boolQuery;
      case ObjectFieldConditionEnum.And:
        const andPromises:  Array<Promise<any>> = value.map(async (val: any) => {
          return this.buildQuery([val]);
        });
        const orConditions: any[] = await Promise.all(andPromises);
        for (const cond of orConditions) {
          boolQuery.must = boolQuery.must.concat(cond.query.bool.must);
        }

        return boolQuery;
    }

    return null;
  }

  private static buildNumberFieldQuery(field: string, condition: NumberFieldConditionEnum, value: any): any {
    const boolQuery: any = {
      must: [],
      must_not: [],
      should: [],
    };
    const fieldCondition: NumberFieldConditionEnum = condition || NumberFieldConditionEnum.Is;
    const numValue: number = Number(value);
    switch (fieldCondition) {
      case NumberFieldConditionEnum.Is:
        boolQuery.must.push(QueryBuilderEsService.subscriptionMediaQuery(field, numValue, 'term'));

        return boolQuery;
      case NumberFieldConditionEnum.IsNot:
        boolQuery.must_not.push(QueryBuilderEsService.subscriptionMediaQuery(field, numValue, 'term'));

        return boolQuery;
      case NumberFieldConditionEnum.LessThan:
        boolQuery.must.push(
          QueryBuilderEsService.subscriptionMediaQuery(
            field,
            { lt: numValue },
            'range',
          ),
        );

        return boolQuery;
      case NumberFieldConditionEnum.GreaterThan:
        boolQuery.must.push(
          QueryBuilderEsService.subscriptionMediaQuery(
            field,
            { gt: numValue },
            'range',
          ),
        );

        return boolQuery;
    }

    return null;
  }

  private static escapeRegExp(input: string): string {
    input = input || '';

    return input.replace(/([.*+?^${}()|[\]\\])/gm, '\\$1');
  }
}
