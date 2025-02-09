import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { IntegrationSubscriptionService } from '../services';
import { IntegrationSubscriptionModel } from '../models';

@ValidatorConstraint({ async: true })
@Injectable()
export class IntegrationsBusinessConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
  ) { }

  public async validate(integrations: any[]): Promise<boolean> {
    if (!integrations) {
      return true;
    }

    if (integrations.length === 0) {
      return true;
    }

    const integrationsModel: IntegrationSubscriptionModel[] =
      await this.integrationSubscriptionService.findByIds(integrations);

    return integrations.length === integrationsModel.length;
  }

  public defaultMessage(): string {
    return `One of integrations "$value" does not exist`;
  }
}

export function IsIntegrationBusiness(
  businessIdProperty: string,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [businessIdProperty],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: IntegrationsBusinessConstraint,
    });
  };
}
