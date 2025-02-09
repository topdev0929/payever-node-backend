import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../../constants';
import { FlowAddressInterface, FlowPaymentMethodsFilterInterface } from '../../interfaces';
import { FlowModel } from '../../models';
import { ConnectionModel } from '../../../connection/models';
import { PaymentMethodInterface } from '../../../common/interfaces';

@Injectable()
@ServiceTag(FLOW_PAYMENT_METHODS_FILTER)
export class ShippingAddressFilter implements FlowPaymentMethodsFilterInterface {
  public async filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    const billingAddress: FlowAddressInterface = flow.billingAddress;
    const shippingAddress: FlowAddressInterface = flow.shippingAddress;
    if (!shippingAddress || !shippingAddress.country || flow.disableValidation) {
      return [enabledPaymentMethods, enabledConnections];
    }

    enabledConnections = enabledConnections.filter((connection: ConnectionModel) => {
      const paymentMethod: PaymentMethodInterface = enabledPaymentMethods.find(
        (searchPaymentMethod: PaymentMethodInterface) =>
          searchPaymentMethod.payment_method === connection.integration.name &&
          searchPaymentMethod.payment_issuer === connection.integration.issuer,
      );
      if (!paymentMethod) {
        return false;
      }

      const isShippingAddressAllowed: boolean =
        (connection?.options?.shippingAddressAllowed !== null
          && connection?.options?.shippingAddressAllowed !== undefined)
            ? connection.options.shippingAddressAllowed
            : paymentMethod.shipping_address_allowed;
      const isShippingAddressEquality: boolean =
        (connection?.options?.shippingAddressEquality !== null
          && connection?.options?.shippingAddressEquality !== undefined)
          ? connection.options.shippingAddressEquality
          : paymentMethod.shipping_address_equality;

      if (!isShippingAddressAllowed) {
        return false;
      }

      if (billingAddress && isShippingAddressEquality) {
        return this.checkAddressEqual(billingAddress, shippingAddress);
      }

      return true;
    });

    return [enabledPaymentMethods, enabledConnections];
  }

  private checkAddressEqual(billingAddress: FlowAddressInterface, shippingAddress: FlowAddressInterface): boolean {
    return billingAddress.city === shippingAddress.city
      && billingAddress.country === shippingAddress.country
      && billingAddress.zipCode === shippingAddress.zipCode
      && billingAddress.street === shippingAddress.street
      && billingAddress.firstName === shippingAddress.firstName
      && billingAddress.lastName === shippingAddress.lastName;
  }
}
