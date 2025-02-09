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

  public async validate(id: string, args: ValidationArguments): Promise<boolean> {
    if (!id) {
      return true;
    }

    return await this.categoryService.getByIdAndBusiness(id, this.getBusinessId(args)) !== null;
  }

  public defaultMessage(args: ValidationArguments): string {
    const businessId: string = this.getBusinessId(args);

    return `Category "($value)" is not exists for business "${businessId}"`;
  }

  private getBusinessId(args: ValidationArguments): string {
    const [businessIdProperty]: any = args.constraints;

    return (args.object as any)[businessIdProperty];
  }
}

export function IsBusinessCategory(
  businessIdProperty: string,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [businessIdProperty],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: CategoryExistsConstraint,
    });
  };
}
