import { FilterDto } from '../dto';
import { FilterConditionsEnum } from '../enums';

export class MongoFiltersBuilderHelper {
  public static getMongoQuery(filters: FilterDto[]): any {
    const query: any = {
      $and: [],
    };

    for (const filter of filters) {
      query.$and.push({
        [filter.field]: this.getExpression(filter.condition, filter.value),
      });
    }

    return query;
  }

  private static getExpression(condition: FilterConditionsEnum, value: any): any {
    switch (condition) {
      case FilterConditionsEnum.Is:
        return value;
      case FilterConditionsEnum.IsNot:
        return { $ne: value };
      case FilterConditionsEnum.StartsWith:
        return { $regex: `^${value}`, $options: 'i' };
      case FilterConditionsEnum.EndsWidth:
        return { $regex: `${value}$`, $options: 'i' };
      case FilterConditionsEnum.Contains:
        return { $regex: `${value}`, $options: 'i' };
      case FilterConditionsEnum.DoesNotContain:
        return { $not: new RegExp(value, 'i') };
      case FilterConditionsEnum.GreaterThan:
        return { $gt: Number(value) };
      case FilterConditionsEnum.LessThan:
        return { $lt: Number(value) };
    }
  }
}
