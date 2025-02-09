import { Injectable } from '@nestjs/common';
import { AbstractCollector, Collector } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../constants';
import { FlowPaymentMethodsFilterInterface } from '../interfaces';
import { FlowModel } from '../models';
import { ConnectionModel } from '../../connection/models';
import { PaymentMethodInterface } from '../../common/interfaces';

@Injectable()
@Collector(FLOW_PAYMENT_METHODS_FILTER)
export class FlowPaymentMethodsFiltersCollector extends AbstractCollector {
  protected services: FlowPaymentMethodsFilterInterface[];

  public async filterAll(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    for (const filterService of this.services) {
      [enabledPaymentMethods, enabledConnections] =
        await filterService.filter(flow, enabledPaymentMethods, enabledConnections);
    }

    return [enabledPaymentMethods, enabledConnections];
  }
}
