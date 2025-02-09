import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../../constants';
import { FlowPaymentMethodsFilterInterface } from '../../interfaces';
import { FlowModel } from '../../models';
import { ConnectionModel } from '../../../connection/models';
import { PaymentMethodInterface } from '../../../common/interfaces';
import { ChannelFilterService } from '../../../common';

@Injectable()
@ServiceTag(FLOW_PAYMENT_METHODS_FILTER)
export class ChannelFilter implements FlowPaymentMethodsFilterInterface {
  constructor(
    private readonly channelFilterService: ChannelFilterService,
  ) { }
  
  public async filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    enabledPaymentMethods = await this.channelFilterService.filter(flow.channel, enabledPaymentMethods);
    
    return [enabledPaymentMethods, enabledConnections];
  }
  
}
