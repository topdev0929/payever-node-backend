export enum Conditions {
  Is = 'is',
  IsIn = 'isIn',
  IsNot = 'isNot',
  IsNotIn = 'isNotIn',
  IsDate = 'isDate',
  IsNotDate = 'isNotDate',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
  Contains = 'contains',
  DoesNotContain = 'doesNotContain',
  // DynamicTypes:
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
  Between = 'between',
  AfterDate = 'afterDate',
  BeforeDate = 'beforeDate',
  BetweenDates = 'betweenDates',
}
