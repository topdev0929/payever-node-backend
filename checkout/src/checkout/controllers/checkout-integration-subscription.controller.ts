import { Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { InjectNotificationsEmitter, NotificationsEmitter } from '@pe/notifications-sdk';
import { BusinessModel } from '../../business';
import { IntegrationModel } from '../../integration';
import { BusinessSchemaName, CheckoutSchemaName, IntegrationSchemaName } from '../../mongoose-schema';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../models';
import { CheckoutIntegrationSubscriptionService, ValidationService } from '../../common/services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const CHECKOUT_ID_PLACEHOLDER: string = ':checkoutId';

@Controller('business/:businessId/checkout/:checkoutId/integration')
@ApiTags('checkoutIntegration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class CheckoutIntegrationSubscriptionController {
  constructor(
    private readonly checkoutIntegrationService: CheckoutIntegrationSubscriptionService,
    private readonly validationService: ValidationService,
    @InjectNotificationsEmitter() private notificationsEmitter: NotificationsEmitter,
  ) { }

  @Get()
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getIntegrations(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<string[]> {
    const checkoutSubscriptions: CheckoutIntegrationSubModel[] =
      await this.checkoutIntegrationService.getEnabledSubscriptions(checkout, business);
    const subsNames: string[] = checkoutSubscriptions
      .map((sub: CheckoutIntegrationSubModel) => sub.integration.name)
      .sort((a: string, b: string) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }

        return 0;
      })
    ;
    if (!subsNames.length) {
      await this.notificationsEmitter.sendNotification(
        {
          app: 'checkout',
          entity: checkout.id,
          kind: 'business',
        },
        'notification.checkout.payment.addOption',
        { },
      );
      await this.notificationsEmitter.sendNotification(
        {
          app: 'choose-payment-aware',
          entity: checkout.id,
          kind: 'business',
        },
        'notification.checkout.payment.addOption',
        { },
      );
    }

    return subsNames;
  }

  @Patch(':integrationName/install')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async postIntegration(
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<void> {
    await this.validationService.validateIntegrationEnabledInBusiness(integration, business);
    await this.checkoutIntegrationService.install(integration, checkout);
  }

  @Patch(':integrationName/uninstall')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async patchIntegration(
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<void> {
    await this.checkoutIntegrationService.uninstall(integration, checkout);
  }

  @Get(':integrationName/options')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getOptions(
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<any> {
    await this.validationService.validateIntegrationBelongsToBusiness(integration, business);

    return this.checkoutIntegrationService.getOptions(integration, checkout);
  }

  @Put(':integrationName/options')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async setOptions(
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
    @Body() body: any,
  ): Promise<void> {
    await this.validationService.validateIntegrationBelongsToBusiness(integration, business);
    await this.checkoutIntegrationService.setOptions(integration, checkout, body);
  }
}
