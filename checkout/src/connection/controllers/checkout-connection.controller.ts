import { Controller, Get, Patch, UseGuards, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { InjectNotificationsEmitter, NotificationsEmitter } from '@pe/notifications-sdk';
import { BusinessModel } from '../../business';
import { CheckoutModel } from '../../checkout/models';
import { BusinessSchemaName, CheckoutSchemaName, ConnectionSchemaName } from '../../mongoose-schema';
import { OutputConnectionInterface } from '../interfaces';
import { ConnectionModel } from '../models';
import { CheckoutConnectionService } from '../services';
import { ValidationService } from '../../common/services';
import { SortOrderConnectionDto } from '../dto';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const CHECKOUT_ID_PLACEHOLDER: string = ':checkoutId';
const CONNECTION_ID_PLACEHOLDER: string = ':connectionId';

@Controller('business/:businessId/checkout/:checkoutId/connection')
@ApiTags('checkoutIntegration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class CheckoutConnectionController {
  constructor(
    private readonly checkoutConnectionService: CheckoutConnectionService,
    private readonly validationService: ValidationService,
    @InjectNotificationsEmitter() private notificationsEmitter: NotificationsEmitter,
  ) { }

  @Get()
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getInstalledConnections(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<OutputConnectionInterface[]> {
    const connections: ConnectionModel[] =
      await this.checkoutConnectionService.getInstalledConnections(checkout, business);

    return this.toOutputConnectionResult(connections, checkout);
  }

  @Patch('sort-order')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async sortOrderInstalledConnections(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
    @Body() sortOrderDtos: SortOrderConnectionDto[],
  ): Promise<OutputConnectionInterface[]> {
    const connections: ConnectionModel[] =
      await this.checkoutConnectionService.sortOrderConnections(checkout, business, sortOrderDtos);

    return this.toOutputConnectionResult(connections, checkout);
  }


  @Patch(':connectionId/install')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async installConnectionToCheckout(
    @ParamModel(CONNECTION_ID_PLACEHOLDER, ConnectionSchemaName) connection: ConnectionModel,
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<void> {
    await connection.populate('integration').execPopulate();

    await this.validationService.validateIntegrationBelongsToBusiness(connection.integration, business);
    await this.checkoutConnectionService.install(connection, checkout);
  }

  @Patch(':connectionId/uninstall')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async uninstallConnectionFromCheckout(
    @ParamModel(CONNECTION_ID_PLACEHOLDER, ConnectionSchemaName) connection: ConnectionModel,
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<void> {
    await this.checkoutConnectionService.uninstall(connection, checkout);
  }

  private async toOutputConnectionResult(
    connections: ConnectionModel[],
    checkout: CheckoutModel,
  ): Promise<OutputConnectionInterface[]> {
    const result: OutputConnectionInterface[] =
      connections.map((connection: ConnectionModel) => {
        return {
          _id: connection.id,
          name: connection.name,

          integration: connection.integration.name,
        };
      });

    if (!result.length) {
      await this.notificationsEmitter.sendNotification(
        {
          app: 'checkout',
          entity: checkout.id,
          kind: 'business',
        },
        'notification.checkout.payment.addOption',
        { }
      );
      await this.notificationsEmitter.sendNotification(
        {
          app: 'choose-payment-aware',
          entity: checkout.id,
          kind: 'business',
        },
        'notification.checkout.payment.addOption',
        { }
      );
    }

    return result;
  }
}
