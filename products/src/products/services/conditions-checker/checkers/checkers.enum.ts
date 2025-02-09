import { ChildChecker } from './child.checker';
import { ContainsChecker } from './contains.checker';
import { DoesNotContainChecker } from './does-not-contain.checker';
import { EndsWithChecker } from './ends-with.checker';
import { GreaterThanChecker } from './greater-than.checker';
import { IsChecker } from './is.checker';
import { IsNotChecker } from './is-not.checker';
import { LessThanChecker } from './less-than.checker';
import { StartsWithChecker } from './starts-with.checker';

export const CheckersEnum: any[] = [
  ChildChecker,
  ContainsChecker,
  DoesNotContainChecker,
  EndsWithChecker,
  GreaterThanChecker,
  IsChecker,
  IsNotChecker,
  LessThanChecker,
  StartsWithChecker,
];
