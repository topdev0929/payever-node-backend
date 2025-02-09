import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CollectionsService } from '../services';

@ValidatorConstraint({ async: true })
@Injectable()
export class CollectionExistsConstraint implements ValidatorConstraintInterface {

  constructor(
    private readonly collectionService: CollectionsService,
  ) { }

  public async validate(id: string, args: ValidationArguments): Promise<boolean> {
    return await this.collectionService.getByIdAndBusiness(id, this.getBusinessId(args)) !== null;
  }

  public defaultMessage(args: ValidationArguments): string {
    const businessId: string = this.getBusinessId(args);

    return `Collection "($value)" is not exists at business "${businessId}"`;
  }

  private getBusinessId(args: ValidationArguments): string {
    const [businessIdProperty]: any = args.constraints;

    return (args.object as any)[businessIdProperty];
  }
}

export function IsCollection(
  businessIdProperty: string,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [businessIdProperty],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: CollectionExistsConstraint,
    });
  };
}
