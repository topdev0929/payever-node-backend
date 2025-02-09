import { ContainsConditionFilter } from './filters/contains-condition.filter';
import { DoesNotContainConditionFilter } from './filters/does-not-contain-condition.filter';
import { EndsWithConditionFilter } from './filters/ends-with-condition.filter';
import { GreaterThenConditionFilter } from './filters/greater-then-condition.filter';
import { GreaterThenOrEqualConditionFilter } from './filters/greater-then-or-equal-condition.filter';
import { IsConditionFilter } from './filters/is-condition.filter';
import { IsNotConditionFilter } from './filters/is-not-condition.filter';
import { LessThenConditionFilter } from './filters/less-then-condition.filter';
import { LessThenOrEqualConditionFilter } from './filters/less-then-or-equal-condition.filter';
import { StartsWithConditionFilter } from './filters/starts-with-condition.filter';
import { BetweenFilterInterface, FilterInterface } from './interfaces';

export const FiltersList: Array<{
  getName(): string;
  apply(
    filters: any,
    field: string,
    _filter: FilterInterface | BetweenFilterInterface,
  ): void;
}> = [
  EndsWithConditionFilter,
  IsConditionFilter,
  IsNotConditionFilter,
  LessThenOrEqualConditionFilter,
  LessThenConditionFilter,
  StartsWithConditionFilter,
  ContainsConditionFilter,
  DoesNotContainConditionFilter,
  GreaterThenConditionFilter,
  GreaterThenOrEqualConditionFilter,
];
