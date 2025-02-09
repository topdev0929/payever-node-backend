import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitMqEventEnum, PaymentOptionsEnum } from '../enums';
import { CheckoutConnectionDto, ConnectThirdPartyDto } from '../dto';
import { WidgetsService } from '../services';
import { BusinessService } from '../../business/services';
import { BusinessModel } from '../../business/interfaces/entities';
import { plainToClass } from 'class-transformer';

@Controller()
export class FinanceExpressConsumer {
  constructor(
    private readonly logger: Logger,
    private readonly widgetsService: WidgetsService,
    private readonly businessService: BusinessService,
  ) { }

  @MessagePattern({
    name: RabbitMqEventEnum.CheckoutConnectionInstalled,
  })
  public async onCheckoutConnectionInstalled(payload: any): Promise<void> {
    const checkoutConnection: CheckoutConnectionDto = plainToClass(CheckoutConnectionDto, payload);

    const paymentMethod: PaymentOptionsEnum = checkoutConnection.integration.name as PaymentOptionsEnum;
    const business: BusinessModel = await this.businessService.findOneById(checkoutConnection.connection.businessId);
    if (business && paymentMethod) {
      await this.widgetsService.setPaymentState(paymentMethod, business._id, true, checkoutConnection.checkout._id);
    }
  }

  @MessagePattern({
    name: RabbitMqEventEnum.CheckoutConnectionUninstalled,
  })
  public async onCheckoutConnectionUninstalled(payload: any): Promise<void> {
    const checkoutConnection: CheckoutConnectionDto = plainToClass(CheckoutConnectionDto, payload);

    const paymentMethod: PaymentOptionsEnum = checkoutConnection.integration.name as PaymentOptionsEnum;
    const business: BusinessModel = await this.businessService.findOneById(checkoutConnection.connection.businessId);
    if (business) {
      await this.widgetsService.setPaymentState(paymentMethod, business._id, false, checkoutConnection.checkout._id);
    }
  }

  @MessagePattern({
    name: RabbitMqEventEnum.IntegrationDisconnected,
  })
  public async IntegrationDisconnected(payload: any): Promise<void> {
    const connectThirdParty: ConnectThirdPartyDto = plainToClass(ConnectThirdPartyDto, payload);

    const paymentMethod: PaymentOptionsEnum = connectThirdParty.integration.name as PaymentOptionsEnum;
    const business: BusinessModel = await this.businessService.findOneById(connectThirdParty.business.id);
    if (business && paymentMethod) {
      await this.widgetsService.removePaymentOptions(paymentMethod, business._id);
    }
  }

}
