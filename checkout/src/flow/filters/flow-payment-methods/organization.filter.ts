import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../../constants';
import { FlowPaymentMethodsFilterInterface } from '../../interfaces';
import { FlowModel } from '../../models';
import { ConnectionModel } from '../../../connection/models';
import { PaymentMethodInterface } from '../../../common/interfaces';
import { ApiCallService } from '../../../common/services';
import { ApiCallModel } from '../../../common/models';
import { CustomerTypeEnum } from '../../../common/enum';

@Injectable()
@ServiceTag(FLOW_PAYMENT_METHODS_FILTER)
export class OrganizationFilter implements FlowPaymentMethodsFilterInterface {
  constructor(
    private readonly apiCallService: ApiCallService,
  ) { }

  public async filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    const apiCall: ApiCallModel = flow.apiCallId ? await this.apiCallService.findApiCallById(flow.apiCallId) : null;

    if (apiCall?.customer_type !== CustomerTypeEnum.organization) {
      return [enabledPaymentMethods, enabledConnections];
    }

    enabledPaymentMethods = enabledPaymentMethods.filter(
      (paymentMethod: PaymentMethodInterface) => paymentMethod.organization_allowed,
    );

    return [enabledPaymentMethods, enabledConnections];
  }
}
