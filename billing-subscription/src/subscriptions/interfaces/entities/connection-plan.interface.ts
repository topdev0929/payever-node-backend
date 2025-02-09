import { ConnectionInterface } from '../../../integrations/interfaces';
import { PaymentMethodsEnum } from '../../enums';
import { BusinessInterface } from '../../../business/interfaces';
import { SubscriptionPlanInterface } from './subscription-plan.interface';

export interface ConnectionPlanInterface {
  business?: BusinessInterface;
  businessId: string;
  paymentMethod: PaymentMethodsEnum;
  connection: ConnectionInterface;
  subscriptionPlan: SubscriptionPlanInterface;
}
