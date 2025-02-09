import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../../constants';
import { FlowPaymentMethodsFilterInterface } from '../../interfaces';
import { FlowModel } from '../../models';
import { ConnectionModel } from '../../../connection/models';
import { ConnectionService } from '../../../connection/services';
import { ApiCallService } from '../../../common/services';
import { PaymentMethodInterface } from '../../../common/interfaces';
import { ApiCallModel } from '../../../common/models';

@Injectable()
@ServiceTag(FLOW_PAYMENT_METHODS_FILTER)
export class ApiCallFilter implements FlowPaymentMethodsFilterInterface {
  constructor(
    private readonly apiCallService: ApiCallService,
    private readonly connectionService: ConnectionService,
  ) { }

  public async filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    const apiCall: ApiCallModel = flow.apiCallId ? await this.apiCallService.findApiCallById(flow.apiCallId) : null;
    if (!apiCall) {
      return [enabledPaymentMethods, enabledConnections];
    }

    let apiCallMethod: string = apiCall.payment_method;
    const apiCallAllowedMethods: string[] = apiCall.allow_payment_methods || [];

    if (!apiCallMethod && apiCall.variant_id) {
      const connection: ConnectionModel = await this.connectionService.findById(apiCall.variant_id);
      if (!connection) {
        return [enabledPaymentMethods, enabledConnections];
      }

      await connection.populate('integration').execPopulate();
      apiCallMethod = connection.integration.name;
    }

    if (!apiCallMethod) {
      if (apiCallAllowedMethods && apiCallAllowedMethods.length) {
        enabledPaymentMethods = enabledPaymentMethods.filter(
          (paymentMethod: PaymentMethodInterface) =>
            apiCallAllowedMethods.includes(paymentMethod.payment_method),
        );
      }

      return [enabledPaymentMethods, enabledConnections];
    }

    enabledPaymentMethods = enabledPaymentMethods.filter(
      (paymentMethod: PaymentMethodInterface) => paymentMethod.payment_method === apiCallMethod &&
        paymentMethod.payment_issuer === apiCall.payment_issuer,
    );

    if (apiCall.variant_id) {
      enabledConnections = enabledConnections.filter(
        (connection: ConnectionModel) => connection.id === apiCall.variant_id,
      );
    }

    return [enabledPaymentMethods, enabledConnections];
  }
}
