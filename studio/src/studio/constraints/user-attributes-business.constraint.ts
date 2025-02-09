import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserAttributeService } from '../services';
import { UserAttributeModel } from '../models';

@ValidatorConstraint({ async: true })
@Injectable()
export class UserAttributesBusinessConstraint implements ValidatorConstraintInterface {

  constructor(
    private readonly userAttributeService: UserAttributeService,
  ) { }

  public async validate(userAttributes: any[], args: ValidationArguments): Promise<boolean> {
    if (!userAttributes || !this.userAttributeService) {
      return true;
    }

    const ids: string[] = userAttributes.map((data: any) => data.attribute);

    if (ids.length === 0) {
      return true;
    }

    const userAttributesModel: UserAttributeModel[] =
      await this.userAttributeService.findByIdsAndBusiness(ids, this.getBusinessId(args));

    return userAttributes.length === userAttributesModel.length;
  }

  public defaultMessage(args: ValidationArguments): string {
    const businessId: string = this.getBusinessId(args);

    return `One of User attributes "$value" is not exists for business "${businessId}"`;
  }

  private getBusinessId(args: ValidationArguments): string {
    const [businessIdProperty]: any = args.constraints;

    return (args.object as any)[businessIdProperty];
  }
}

export function IsUserAttributeBusiness(
  businessIdProperty: string,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [businessIdProperty],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: UserAttributesBusinessConstraint,
    });
  };
}
