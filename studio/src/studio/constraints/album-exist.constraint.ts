import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserAlbumService } from '../services';

@ValidatorConstraint({ async: true })
@Injectable()
export class AlbumExistsConstraint implements ValidatorConstraintInterface {

  constructor(
    private readonly albumService: UserAlbumService,
  ) { }

  public async validate(id: string, args: ValidationArguments): Promise<boolean> {
    if (!this.albumService) {
      return true;
    }

    return await this.albumService.findByIdAndBusiness(id, this.getBusinessId(args)) !== null;
  }

  public defaultMessage(args: ValidationArguments): string {
    const businessId: string = this.getBusinessId(args);

    return `Album "$value" is not exists for business "${businessId}"`;
  }

  private getBusinessId(args: ValidationArguments): string {
    const [businessIdProperty]: any = args.constraints;

    return (args.object as any)[businessIdProperty];
  }
}

export function IsAlbumExist(
  businessIdProperty: string,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [businessIdProperty],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: AlbumExistsConstraint,
    });
  };
}
