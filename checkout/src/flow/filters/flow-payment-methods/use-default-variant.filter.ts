import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../../constants';
import { FlowPaymentMethodsFilterInterface } from '../../interfaces';
import { FlowModel } from '../../models';
import { ConnectionModel } from '../../../connection/models';
import { PaymentMethodInterface } from '../../../common/interfaces';
import { ApiCallService } from '../../../common/services';
import { ApiCallModel } from '../../../common/models';

@Injectable()
@ServiceTag(FLOW_PAYMENT_METHODS_FILTER)
export class UseDefaultVariantFilter implements FlowPaymentMethodsFilterInterface {
  constructor(
    private readonly apiCallService: ApiCallService,
  ) { }

  public async filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    const apiCall: ApiCallModel = flow?.apiCallId ? await this.apiCallService.findApiCallById(flow.apiCallId) : null;

    const filteredConnections: ConnectionModel[] = [];
    for (const connection of enabledConnections) {
      if (apiCall?.variant_id
        || (!apiCall?.use_default_variant && !connection?.options?.useDefaultVariant)
        || connection?.options?.default
      ) {
        filteredConnections.push(connection);
      }
    }

    return [enabledPaymentMethods, filteredConnections];
  }
}
