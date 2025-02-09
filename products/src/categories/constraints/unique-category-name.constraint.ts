import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryService } from '../services';
import { CategoryModel } from '../models';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueCategoryNameConstraint implements ValidatorConstraintInterface {

  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  public async validate(name: string, args: ValidationArguments): Promise<boolean> {
    if (!name) {
      return true;
    }

    const category: CategoryModel = await this.categoryService.getByName(
      name,
      this.getBusinessId(args),
      await this.categoryService.getById(this.getCategoryId(args)),
    );

    const id: string = this.getId(args);

    return  !category || category.id === id;
  }

  public defaultMessage(args: ValidationArguments): string {
    const categoryId: string = this.getCategoryId(args);
    const businessId: string = this.getBusinessId(args);

    return categoryId
      ? `Category "($value)" is already exists in the category "${categoryId}" of business "${businessId}"`
      : `Category "($value)" is already exists in business "${businessId}"`;
  }

  private getCategoryId(args: ValidationArguments): string {
    const [, categoryIdProperty]: any = args.constraints;

    return (args.object as any)[categoryIdProperty];
  }

  private getBusinessId(args: ValidationArguments): string {
    const [businessIdProperty]: any = args.constraints;

    return (args.object as any)[businessIdProperty];
  }

  private getId(args: ValidationArguments): string {
    return (args.object as any).id || undefined;
  }
}

export function IsUniqueCategoryName(
  businessIdProperty: string,
  parentIdProperty: string,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [businessIdProperty, parentIdProperty],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: UniqueCategoryNameConstraint,
    });
  };
}
