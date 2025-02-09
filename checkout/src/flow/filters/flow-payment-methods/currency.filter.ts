import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../../constants';
import { FlowPaymentMethodsFilterInterface } from '../../interfaces';
import { FlowModel } from '../../models';
import { ConnectionModel } from '../../../connection/models';
import { PaymentMethodInterface } from '../../../common/interfaces';

@Injectable()
@ServiceTag(FLOW_PAYMENT_METHODS_FILTER)
export class CurrencyFilter implements FlowPaymentMethodsFilterInterface {
  public async filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    const currency: string = flow.currency;
    if (!currency || flow.disableValidation) {
      return [enabledPaymentMethods, enabledConnections];
    }

    enabledPaymentMethods = enabledPaymentMethods.filter(
      (paymentMethod: PaymentMethodInterface) => paymentMethod.options.currencies.includes(currency.toUpperCase()),
    );

    return [enabledPaymentMethods, enabledConnections];
  }
}
