import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventDispatcher } from '@pe/nest-kit';
import { validate } from 'class-validator';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { RabbitBinding, MessageBusChannelsEnum } from '../../environments';
import { IntegrationModel } from '../../integration/models';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../../integration/services';
import { ChangedBpoDto, ChangedBpoMessageDto } from '../dto';
import { ConnectionEvent } from '../enums';
import { ConnectionModel } from '../models';
import { BpoActiveService, ConnectionService } from '../services';
import { plainToClass } from 'class-transformer';

@Controller()
export class BpoConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly integrationSubscriptionService: BusinessIntegrationSubscriptionService,
    private readonly connectionService: ConnectionService,
    private readonly bpoActiveService: BpoActiveService,
    private readonly dispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.BPOMigrate,
  })
  public async onBusinessPaymentOptionMigrateEvent(data: any): Promise<void> {
    const changedBpoMessageDto: ChangedBpoMessageDto = plainToClass(ChangedBpoMessageDto, data);

    await this.processDto(changedBpoMessageDto.business_payment_option);
  }

  private async processDto(changedBpoDto: ChangedBpoDto): Promise<void> {
    await validate(changedBpoDto);

    const business: BusinessModel = await this.businessService
    .findOneById(changedBpoDto.business_uuid) as BusinessModel;

    if (!business) {
      this.logger.warn({
        dto: changedBpoDto,
        message: `Business with id "${changedBpoDto.business_uuid}" does not exist.`,
      });

      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(changedBpoDto.payment_method);
    if (!integration) {
      this.logger.warn({
        dto: changedBpoDto,
        message: `Integration with name "${changedBpoDto.payment_method}" does not exist.`,
      });

      return;
    }

    let connection: ConnectionModel = await this.connectionService.findById(changedBpoDto.uuid);
    if (!connection) {
      connection = await this.connectionService.create({
        _id: changedBpoDto.uuid,
        businessId: business._id,
        integration: integration,
        name: changedBpoDto.name,
        options: {
          acceptFee: changedBpoDto.accept_fee,
          default: changedBpoDto.default,
          maxAmount: changedBpoDto.max,
          minAmount: changedBpoDto.min,
          shippingAddressAllowed: changedBpoDto.shipping_address_allowed,
          shippingAddressEquality: changedBpoDto.shipping_address_equality,
          sortOrder: changedBpoDto.sortOrder,
        },
      });
    } else {
      connection = await this.connectionService.updateOptions(
        changedBpoDto.uuid,
        {
          acceptFee: changedBpoDto.accept_fee,
          default: changedBpoDto.default,
          maxAmount: changedBpoDto.max,
          minAmount: changedBpoDto.min,
          shippingAddressAllowed: changedBpoDto.shipping_address_allowed,
          shippingAddressEquality: changedBpoDto.shipping_address_equality,
          sortOrder: changedBpoDto.sortOrder,
        },
      );
    }

    if (this.isBpoActive(changedBpoDto)) {
      await this.bpoActiveService.setActive(connection);
      await this.dispatcher.dispatch(ConnectionEvent.ConnectionCreated, business, integration, connection);
    } else {
      await this.bpoActiveService.setInactive(connection);
      await this.dispatcher.dispatch(ConnectionEvent.ConnectionRemoved, business, integration, connection);
    }
  }

  private isBpoActive(changedBpoDto: ChangedBpoDto): boolean {
    return changedBpoDto.completed && changedBpoDto.status === 'enabled';
  }
}
