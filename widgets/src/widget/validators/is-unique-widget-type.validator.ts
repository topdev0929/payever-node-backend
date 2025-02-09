import { Injectable, Logger } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { WidgetModel } from '../models';
import { WidgetService } from '../services';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueWidgetTypeConstraint implements ValidatorConstraintInterface {

  constructor(
    private readonly logger: Logger,
    private readonly widgetService: WidgetService,
  ) { }

  public async validate(type: string, args: ValidationArguments): Promise<boolean> {
    this.logger.log(this);
    this.logger.log(this.widgetService);

    const widget: WidgetModel = await this.widgetService.findOneByType(type);
    const widgetDto: any = args.object;

    return !widget || widget._id === widgetDto._id;
  }

  public defaultMessage(args: ValidationArguments): string {
    return 'Widget with type "$value" already presents!';
  }
}

export function IsUniqueWidgetType(validationOptions?: ValidationOptions) : any {
  return (object: object, propertyName: string) => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: IsUniqueWidgetTypeConstraint,
    });
  };
}
