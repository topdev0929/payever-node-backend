import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserAttributeGroupService } from '../services';
import { UserAttributeGroupModel } from '../models';

@ValidatorConstraint({ async: true })
@Injectable()
export class UserAttributeGroupsBusinessConstraint implements ValidatorConstraintInterface {

  constructor(
    private readonly userAttributeGroupService: UserAttributeGroupService,
  ) { }

  public async validate(userAttributeGroups: any[], args: ValidationArguments): Promise<boolean> {
    if (!userAttributeGroups || !this.userAttributeGroupService || userAttributeGroups.length === 0) {
      return true;
    }

    const userAttributeGroupsModel: UserAttributeGroupModel[] =
      await this.userAttributeGroupService.findByIdsAndBusiness(userAttributeGroups, this.getBusinessId(args));

    return userAttributeGroups.length === userAttributeGroupsModel.length;
  }

  public defaultMessage(args: ValidationArguments): string {
    const businessId: string = this.getBusinessId(args);

    return `One of User attributeGroups "$value" is not exists for business "${businessId}"`;
  }

  private getBusinessId(args: ValidationArguments): string {
    const [businessIdProperty]: any = args.constraints;

    return (args.object as any)[businessIdProperty];
  }
}

export function IsUserAttributeGroupBusiness(
  businessIdProperty: string,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [businessIdProperty],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: UserAttributeGroupsBusinessConstraint,
    });
  };
}
