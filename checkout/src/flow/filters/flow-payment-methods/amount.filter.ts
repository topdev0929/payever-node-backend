import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../../constants';
import { FlowPaymentMethodsFilterInterface } from '../../interfaces';
import { FlowModel } from '../../models';
import { ConnectionModel } from '../../../connection/models';
import { CurrencyExchangeService } from '../../../common/services';
import { PaymentMethodInterface } from '../../../common/interfaces';

@Injectable()
@ServiceTag(FLOW_PAYMENT_METHODS_FILTER)
export class AmountFilter implements FlowPaymentMethodsFilterInterface {
  constructor(
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) { }

  public async filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    if (flow.total <= 0 || flow.disableValidation) {
      return [enabledPaymentMethods, enabledConnections];
    }

    const filteredConnections: ConnectionModel[] = [];
    for (const connection of enabledConnections) {
      const paymentMethod: PaymentMethodInterface =
        enabledPaymentMethods.find(
          (value: PaymentMethodInterface) => value.payment_method === connection.integration.name &&
            value.payment_issuer === connection.integration.issuer,
        );
      if (await this.matchesAmount(flow, paymentMethod, connection)) {
        filteredConnections.push(connection);
      }
    }

    return [enabledPaymentMethods, filteredConnections];
  }

  private async matchesAmount(
    flow: FlowModel,
    paymentMethod: PaymentMethodInterface,
    connection: ConnectionModel,
  ): Promise<boolean> {
    const minAmount: number =
      connection?.options?.minAmount || await this.currencyExchangeService.exchangePaymentMethodLimits(
        flow.currency,
        paymentMethod?.amount_limits?.min,
      );
    const maxAmount: number =
      connection?.options?.maxAmount || await this.currencyExchangeService.exchangePaymentMethodLimits(
        flow.currency,
        paymentMethod?.amount_limits?.max,
      );

    return flow.total >= minAmount && flow.total <= maxAmount;
  }
}
