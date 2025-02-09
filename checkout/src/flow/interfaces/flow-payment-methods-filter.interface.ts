import { ConnectionModel } from '../../connection/models';
import { FlowModel } from '../models';
import { PaymentMethodInterface } from '../../common/interfaces';

export interface FlowPaymentMethodsFilterInterface {
  filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]>;
}
