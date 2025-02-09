import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageBusEventsEnum, PaymentMethodsEnum } from '../enums';
import { CheckoutConnectionDto, ConnectThirdPartyDto } from '../dto';
import { SettingsService } from '../services';

@Controller()
export class ConnectionsBusMessageController {
  constructor(
    private readonly settingsService: SettingsService,
  ) { }

  @MessagePattern({
    name: MessageBusEventsEnum.CheckoutConnectionUninstalled,
  })
  public async onCheckoutConnectionUninstalled(checkoutConnection: CheckoutConnectionDto): Promise<void> {
    const paymentMethod: PaymentMethodsEnum = checkoutConnection.integration.name as PaymentMethodsEnum;
    const businessId: string = checkoutConnection.connection.business;
    if ((businessId !== '') && paymentMethod) {
      await this.settingsService.disableSettingsForIntegration(businessId, paymentMethod);
    }
  }

  @MessagePattern({
    name: MessageBusEventsEnum.ConnectThirdPartyDisabled,
  })
  public async onConnectThirdPartyDisabled(connectThirdParty: ConnectThirdPartyDto): Promise<void> {
    const paymentMethod: PaymentMethodsEnum = connectThirdParty.name as PaymentMethodsEnum;
    const businessId: string = connectThirdParty.businessId;
    if ((businessId !== '') && paymentMethod) {
      await this.settingsService.disableSettingsForIntegration(businessId, paymentMethod);
    }
  }

}
