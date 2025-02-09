import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import {
  BusinessIntegrationSubModel,
  BusinessIntegrationSubscriptionService,
  IntegrationModel,
} from '../../integration';
import { CheckoutSchemaName } from '../../mongoose-schema';
import { CheckoutModel } from '../../checkout/models';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

@Injectable()
export class ValidationService {
  constructor(
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
    protected readonly businessService: BusinessService,
    protected readonly businessIntegrationService: BusinessIntegrationSubscriptionService,
  ) { }

  public async validateIntegrationBelongsToBusiness(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<void> {
    const subscription: BusinessIntegrationSubModel =
      await this.businessIntegrationService.findOneByIntegrationAndBusiness(integration, business);

    if (!subscription || !subscription.installed) {
      throw new NotFoundException(
        `Integration '${integration.name}' doesn't belong business '${business.id}'`,
      );
    }
  }

  public async validateIntegrationEnabledInBusiness(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<void> {
    const enabledBusinessIntegrations: IntegrationModel[] =
      await this.businessIntegrationService.findInstalledAndEnabledIntegrations(business);

    const enabled: IntegrationModel = enabledBusinessIntegrations.find(
      (record: IntegrationModel) => record.id === integration.id,
    );

    if (!enabled) {
      throw new HttpException(
        `Integration '${integration.name}' doesn't enabled in business '${business.id}'`,
        HttpStatus.CONFLICT,
      );
    }
  }

  public async validateSettingsPhone(phone: string, id?: string): Promise<void> {
    const conditions: any = { 'settings.phoneNumber': phone };
    if (id) {
      conditions._id = { $ne: id };
    }
    const checkout: CheckoutModel = await this.checkoutModel.findOne(conditions);

    if (checkout) {
      throw new BadRequestException(
        `A checkout with a phone number ${phone} already exists`,
      );
    }
  }

  public async validateCheckoutName(business: BusinessModel, checkoutName: string): Promise<boolean> {
    let nameIsValid: boolean = true;
    await business.populate('checkouts').execPopulate();

    for (const checkout of business.checkouts) {
      if ((checkout as CheckoutModel).name === checkoutName) {
        nameIsValid = false;
      }
    }

    return nameIsValid;
  }

  public static async validateDto(
    dto: any,
    validationGroups: string[] = [],
    options: ValidatorOptions = { },
  ): Promise<void> {
    if (!options) {
      options = { };
    }

    options.groups = validationGroups;

    const validationErrors: ValidationError[] = await validate(dto, options);

    if (validationErrors && validationErrors.length) {
      throw new BadRequestException(validationErrors);
    }
  }

}
