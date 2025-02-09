import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryService } from '../services';

@ValidatorConstraint({ async: true })
@Injectable()
export class CategoryExistsConstraint implements ValidatorConstraintInterface {

  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  public async validate(name: string, args: ValidationArguments): Promise<boolean> {
    return await this.categoryService.findOneByName(name) !== null;
  }

  public defaultMessage(_args: ValidationArguments): string {
    return `Category with name "($value)" does not exists`;
  }
}

export function DoesCategoryExists(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: CategoryExistsConstraint,
    });
  };
}
