import { PaymentFlowDto } from '../dto';
import { SalutationEnum } from '../../common/enum';
import { FlowInterface } from '../interfaces';
import { FlowStatesEnum } from '../enum';

export class MigrateEventToFlowDtoTransformer {
  public static migrateEventToFlowDto(
    eventDto: PaymentFlowDto,
  ): FlowInterface {
    const flowRequestDto: FlowInterface = {
      amount: eventDto.amount,
      apiCallId: eventDto.api_call_create_id,
      billingAddress: {
        city: eventDto.billing_address?.city,
        country: eventDto.billing_address?.country,
        email: eventDto.billing_address?.email,
        firstName: eventDto.billing_address?.first_name,
        lastName: eventDto.billing_address?.last_name,
        phone: eventDto.billing_address?.phone,
        salutation: eventDto.billing_address?.salutation || SalutationEnum.MR,
        street: eventDto.billing_address?.street,
        streetName: eventDto.billing_address?.street_name,
        streetNumber: eventDto.billing_address?.street_number,
        zipCode: eventDto.billing_address?.zip_code,
      },
      businessId: eventDto.business_id,
      channelSetId: eventDto.channel_set_uuid,
      connectionId: eventDto.business_payment_option_uuid,
      currency: eventDto.currency,
      deliveryFee: eventDto.shipping_fee,
      downPayment: eventDto.down_payment,
      reference: eventDto.reference,
      state: MigrateEventToFlowDtoTransformer.eventStateToFlowState(eventDto.state),
    };

    if (eventDto.shipping_address) {
      const salutation: string =
        (eventDto.billing_address?.first_name === eventDto.shipping_address.first_name
        && eventDto.billing_address?.last_name === eventDto.shipping_address.last_name
        && !eventDto.shipping_address.salutation)
          ? eventDto.billing_address.salutation
          : eventDto.shipping_address.salutation;

      flowRequestDto.shippingAddress = {
        city: eventDto.shipping_address?.city,
        country: eventDto.shipping_address?.country,
        firstName: eventDto.shipping_address?.first_name,
        lastName: eventDto.shipping_address?.last_name,
        salutation,
        street: eventDto.shipping_address?.street,
        streetName: eventDto.shipping_address?.street_name,
        streetNumber: eventDto.shipping_address?.street_number,
        zipCode: eventDto.shipping_address?.zip_code,
      };
    }

    return flowRequestDto;
  }

  private static eventStateToFlowState(state: string): FlowStatesEnum {
    switch (state) {
      case 'IN PROGRESS':
        return FlowStatesEnum.inProgress;
      case 'FINISHED':
      default:
        return FlowStatesEnum.finished;
    }
  }
}
