/* eslint-disable @typescript-eslint/tslint/config */
import { PaymentMethodResponseDto } from '../dto/response/payment-method-response.dto';
import { PaymentMethodWithVariantsDto } from '../dto';

export class PaymentMethodsTransformer {
  public static paymentMethodDtoToPaymentMethodResponseDto(
    paymentMethods: PaymentMethodWithVariantsDto[],
    addCountries: boolean,
    addCurrencies: boolean,
  ): PaymentMethodResponseDto[] {

    return paymentMethods.map((paymentMethod: PaymentMethodWithVariantsDto) => {
      const paymentMethodResponse: PaymentMethodResponseDto = {
        name: paymentMethod.name,
        payment_issuer: paymentMethod.payment_issuer,
        payment_method: paymentMethod.payment_method,
        description: paymentMethod.description_offer,
        logo: paymentMethod.thumbnail1,
        currencies: paymentMethod.options.currencies,
        countries: paymentMethod.options.countries,
        max: paymentMethod.max,
        min: paymentMethod.min,
        options: {
          accept_fee: paymentMethod.accept_fee,
          fixed_fee: paymentMethod.fixed_fee,
          is_redirect_method: paymentMethod.is_redirect_method,
          is_submit_method: paymentMethod.is_submit_method,
          shipping_address_allowed: paymentMethod.shipping_address_allowed,
          shipping_address_equality: paymentMethod.shipping_address_equality,
          variable_fee: paymentMethod.variable_fee,
          rates: paymentMethod.rates,
        },
        variants: paymentMethod.variants,
      };

      if (!addCountries) {
        delete paymentMethodResponse.countries;
      }
      if (!addCurrencies) {
        delete paymentMethodResponse.currencies;
      }
      if (!paymentMethodResponse.options.accept_fee) {
        delete paymentMethodResponse.options.fixed_fee;
        delete paymentMethodResponse.options.variable_fee;
      }

      return paymentMethodResponse;
    });
  }

}
