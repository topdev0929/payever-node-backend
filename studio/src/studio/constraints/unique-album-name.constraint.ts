import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserAlbumService } from '../services';
import { UserAlbumModel } from '../models';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueAlbumNameConstraint implements ValidatorConstraintInterface {

  constructor(
    private readonly albumService: UserAlbumService,
  ) { }

  public async validate(name: string, args: ValidationArguments): Promise<boolean> {
    if (!name || !this.albumService) {
      return true;
    }

    const album: UserAlbumModel = await this.albumService.findByNameAndBusiness(
      name,
      this.getBusinessId(args),
    );
    const albumId: string = this.getAlbumId(args);

    return  !album || album.id === albumId;
  }

  public defaultMessage(args: ValidationArguments): string {
    const albumId: string = this.getParentId(args);
    const businessId: string = this.getBusinessId(args);

    return albumId
      ? `Album "$value" is already exists in other album of business "${businessId}"`
      : `Album "$value" is already exists in business "${businessId}"`;
  }

  private getParentId(args: ValidationArguments): string {
    const [parentIdProperty]: any = args.constraints;

    return (args.object as any)[parentIdProperty];
  }

  private getBusinessId(args: ValidationArguments): string {
    const [businessIdProperty]: any = args.constraints;

    return (args.object as any)[businessIdProperty];
  }

  private getAlbumId(args: ValidationArguments): string {
    return (args.object as any).albumId || undefined;
  }
}

export function IsUniqueAlbumName(
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
      validator: UniqueAlbumNameConstraint,
    });
  };
}
