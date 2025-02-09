import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConnectionModel } from '../../connection/models';
import { ConnectionService } from '../../connection/services';
import { IntegrationModel } from '../../integration/models';
import { BusinessIntegrationSubscriptionService } from '../../integration/services';
import { CreatePaymentDto } from '../dto/request/common';

@Injectable()
export class PaymentMethodVariantValidator {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly businessIntegrationService: BusinessIntegrationSubscriptionService,
  ) { }

  public async validate(paymentDto: CreatePaymentDto, businessId: string): Promise<void> {
    const variantId: string = paymentDto.variant_id;
    if (!variantId) {
      return;
    }

    let isVariantIdValid: boolean = true;
    const connection: ConnectionModel = await this.connectionService.findById(variantId);

    if (connection) {
      await connection.populate('business').execPopulate();
      await connection.populate('integration').execPopulate();
    } else {
      isVariantIdValid = false;
    }

    if (isVariantIdValid
      && (
        connection.business.id !== businessId
        || (paymentDto.payment_method && connection.integration.name !== paymentDto.payment_method)
      )
    ) {
      isVariantIdValid = false;
    }

    if (isVariantIdValid) {
      const enabledBusinessIntegrations: IntegrationModel[] =
        await this.businessIntegrationService.findInstalledAndEnabledIntegrations(connection.business);

      const connectionIntegrations: IntegrationModel[] =
        enabledBusinessIntegrations.filter(
          (integration: IntegrationModel) => integration.id === connection.integration.id,
        );

      if (connectionIntegrations.length === 0) {
        isVariantIdValid = false;
      }
    }

    if (!isVariantIdValid) {
      throw new HttpException(`The variant with "${variantId}" was not found`, HttpStatus.BAD_REQUEST);
    }
  }
}
