import {
  FilterFieldTypeEnum,
  NestedFieldConditionEnum,
  NumberFieldConditionEnum,
  StringFieldConditionEnum,
} from '../../common/enums';
import { FilterInterface } from '../../common/interfaces/filter.interface';
import {
  ElasticSearchExpressionDto,
  ElasticSearchExpressionsEnum,
  ElasticSearchQueryBuilder,
  ExpressionsFactory,
} from '@pe/elastic-kit';
import { ExpandFilterHelper } from './expand-filter.helper';
import { ProductFieldMapperHelper } from './product-field-mapper.helper';
import { FilterFieldConditionForProductBusiness } from '../../common/types';

export class ElasticProductsQueryBuilderHelper {
  public static createBuilder(filters: FilterInterface[], strict: boolean = true): ElasticSearchQueryBuilder {

    const queryBuilder: ElasticSearchQueryBuilder = new ElasticSearchQueryBuilder();

    if (!filters) {
      return queryBuilder;
    }

    for (const filter of filters) {
      if (!ProductFieldMapperHelper.isFieldAllowed(filter.field)) {
        continue;
      }

      const fieldQuery: ElasticSearchExpressionDto = this.buildFieldQuery(filter);

      switch (filter.fieldCondition) {
        case StringFieldConditionEnum.Is:
        case StringFieldConditionEnum.Contains:
        case StringFieldConditionEnum.StartsWith:
        case StringFieldConditionEnum.EndsWith:
        case NestedFieldConditionEnum.Is:
          if (strict) {
            queryBuilder.must(fieldQuery);
          } else {
            queryBuilder.should(fieldQuery);
          }
          break;
        case StringFieldConditionEnum.IsNot:
        case StringFieldConditionEnum.DoesNotContain:
        case NumberFieldConditionEnum.IsNot:
        case NestedFieldConditionEnum.IsNot:
          if (strict) {
            queryBuilder.mustNot(fieldQuery);
          } else {
            queryBuilder.shouldNot(fieldQuery);
          }
      }
    }

    return strict ? queryBuilder : this.groupFiltersInQueryBuilder(queryBuilder);
  }

  public static createBuilderForBusiness(
    filters: FilterInterface[],
    businessId: string,
    strict: boolean,
  ): ElasticSearchQueryBuilder {
    const queryBuilder: ElasticSearchQueryBuilder = this.createBuilder(filters, strict);

    if (businessId) {
      queryBuilder.must({
        match_phrase: {
          businessId: businessId,
        },
      });
    }

    return queryBuilder;
  }

  private static buildFieldQuery(filter: FilterInterface, path: string = null): ElasticSearchExpressionDto {
    filter.field = path
      ? ProductFieldMapperHelper.getFieldName(`${path}.${filter.field}`)
      : ProductFieldMapperHelper.getFieldName(filter.field);

    if (!path) {
      filter = ExpandFilterHelper.expandChildFilter(filter);
    }

    switch (filter.fieldType) {
      case FilterFieldTypeEnum.Number:
      case FilterFieldTypeEnum.String:
        return this.buildScalarExpression(filter, filter.field) as ElasticSearchExpressionDto;
      case FilterFieldTypeEnum.Nested:
        return ElasticProductsQueryBuilderHelper.buildNestedFieldQuery(
          filter.filters,
          filter.field,
        );
      case FilterFieldTypeEnum.Child:
        return ElasticProductsQueryBuilderHelper.buildChildFieldQuery(
          filter.filters,
          filter.field,
        );
      case FilterFieldTypeEnum.Parent:
        return ElasticProductsQueryBuilderHelper.buildParentFieldQuery(
          filter.filters,
          filter.field,
        );
    }
  }

  private static buildScalarExpression(filter: FilterInterface, fieldName: string): any {

    if (filter && filter.valueIn) {
      return filter.valueIn.map((value: any) => {
        return ExpressionsFactory.getExpression(
          fieldName,
          this.escapeRegExp(value),
          this.getExpressionType(filter.fieldCondition),
        );
      });
    }

    return ExpressionsFactory.getExpression(
      fieldName,
      this.escapeRegExp(filter.value),
      this.getExpressionType(filter.fieldCondition),
    );
  }

  private static buildExpressionsForMultipleValues(
    field: string,
    value: any[],
    path: string = null,
  ): Array<ElasticSearchExpressionDto | ElasticSearchExpressionDto[]> {
    const conditions: Array<ElasticSearchExpressionDto | ElasticSearchExpressionDto[]> = [];

    for (const filterValue of value) {
      const fieldConditions: any = Array.isArray(filterValue)
          ? this.buildExpressionsForMultipleValues(field, value, path)
          : this.buildFieldQuery(filterValue, path);

      conditions.push(fieldConditions);
    }

    return conditions;
  }

  private static buildNestedFieldQuery(
    value: any,
    field: string,
  ): ElasticSearchExpressionDto {
    const conditions: Array<ElasticSearchExpressionDto | ElasticSearchExpressionDto[]> =
      this.buildExpressionsForMultipleValues(field, value, field);

    return ExpressionsFactory.getExpression(field, conditions, ElasticSearchExpressionsEnum.Nested);
  }

  private static buildChildFieldQuery(
    value: any,
    fieldName: string,
  ): ElasticSearchExpressionDto {
    const conditions: Array<ElasticSearchExpressionDto | ElasticSearchExpressionDto[]> =
      this.buildExpressionsForMultipleValues(fieldName, value);

    return ExpressionsFactory.getExpression(fieldName, conditions, ElasticSearchExpressionsEnum.Child);
  }

  private static buildParentFieldQuery(
    value: any,
    fieldName: string,
  ): ElasticSearchExpressionDto {
    const conditions: Array<ElasticSearchExpressionDto | ElasticSearchExpressionDto[]> =
      this.buildExpressionsForMultipleValues(fieldName, value);

    return ExpressionsFactory.getExpression(fieldName, conditions, ElasticSearchExpressionsEnum.Parent);
  }

  private static escapeRegExp(input: string): string {
    input = input || '';

    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  public static getExpressionType(condition: FilterFieldConditionForProductBusiness): ElasticSearchExpressionsEnum {
    switch (condition) {
      case NumberFieldConditionEnum.Is:
      case NumberFieldConditionEnum.IsNot:
      case StringFieldConditionEnum.Is:
      case StringFieldConditionEnum.IsNot:
        return ElasticSearchExpressionsEnum.Match;
      case NumberFieldConditionEnum.LessThan:
        return ElasticSearchExpressionsEnum.LessThan;
      case NumberFieldConditionEnum.GreaterThan:
        return ElasticSearchExpressionsEnum.GreaterThan;
      case StringFieldConditionEnum.Contains:
      case StringFieldConditionEnum.DoesNotContain:
        return ElasticSearchExpressionsEnum.Contains;
      case StringFieldConditionEnum.StartsWith:
        return ElasticSearchExpressionsEnum.StartsWith;
      case StringFieldConditionEnum.EndsWith:
        return ElasticSearchExpressionsEnum.EndsWith;
    }

    return null;
  }

  private static groupFiltersInQueryBuilder(queryBuilder: ElasticSearchQueryBuilder): ElasticSearchQueryBuilder {
    const result: ElasticSearchQueryBuilder = new ElasticSearchQueryBuilder();
    result.must(queryBuilder.getQuery());

    return result;
  }
}
