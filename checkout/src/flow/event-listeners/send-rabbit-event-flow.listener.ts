import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { RabbitEventsProducer } from '../../common/producer';
import { FlowEventsEnum } from '../enum';
import { FlowModel } from '../models';
import { MessageBusEventsEnum } from '../../common/enum';
import { PaymentFlowAddressDto, PaymentFlowDto } from '../dto';
import { ConnectionModel } from '../../connection/models';
import { ConnectionService } from '../../connection/services';
import { FlowAddressInterface } from '../interfaces';

@Injectable()
export class SendRabbitEventFlowListener {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
  ) { }

  @EventListener(FlowEventsEnum.flowCreated)
  public async handleFlowCreated(
    flow: FlowModel,
  ): Promise<void> {
    await this.sendRabbitEvent(
      MessageBusEventsEnum.flowCreated,
      flow,
    );
  }

  @EventListener(FlowEventsEnum.flowUpdated)
  public async handleApiCallUpdated(
    flow: FlowModel,
  ): Promise<void> {
    await this.sendRabbitEvent(
      MessageBusEventsEnum.flowUpdated,
      flow,
    );
  }

  private async sendRabbitEvent(
    event: MessageBusEventsEnum.flowCreated | MessageBusEventsEnum.flowUpdated,
    flow: FlowModel,
  ): Promise<void> {
    const payload: PaymentFlowDto = {
      id: flow.id,

      amount: flow.amount,
      api_call_create_id: flow.apiCallId,
      billing_address: this.flowAddressToEvent(flow.billingAddress),
      business_id: flow.businessId,
      business_payment_option_uuid: flow.connectionId,
      channel_set_uuid: flow.channelSetId,
      currency: flow.currency,
      down_payment: flow.downPayment,
      plugin_version: flow.pluginVersion,
      reference: flow.reference,
      shipping_address: this.flowAddressToEvent(flow.shippingAddress),
      shipping_fee: flow.deliveryFee,
      state: flow.state,
    };

    if (flow.connectionId) {
      const connection: ConnectionModel = await this.connectionService.findById(flow.connectionId);
      if (connection) {
        await connection.populate('integration').execPopulate();
        payload.payment_method = connection.integration?.name;
      }
    }

    await this.rabbitEventsProducer.sendFlowEvent(
      event,
      {
        flow: payload,
      },
    );
  }

  private flowAddressToEvent(address: FlowAddressInterface): PaymentFlowAddressDto {
    if (!address) {
      return;
    }

    return {
      city: address.city,
      country: address.country,
      email: address.email,
      first_name: address.firstName,
      last_name: address.lastName,
      phone: address.phone,
      salutation: address.salutation,
      street: address.street,
      street_name: address.streetName,
      street_number: address.streetNumber,
      zip_code: address.zipCode,
    };
  }
}
