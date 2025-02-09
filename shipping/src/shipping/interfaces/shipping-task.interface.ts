import { BusinessInterface } from '../../business';
import { IntegrationInterface } from '../../integration';
import { SyncEventInterface } from './sync-event-interface';
import { ShippingTaskErrorInterface } from './shipping-task-error.interface';
import { ShippingTaskStatusEnum } from '../enums/shipping-task-status.enum';

export interface ShippingTaskInterface {
  business?: BusinessInterface;
  businessId: string;

  integration?: IntegrationInterface;

  status: ShippingTaskStatusEnum;
  direction: string;
  itemsSynced: number;
  events: SyncEventInterface[];

  errorsList: ShippingTaskErrorInterface[];

  failureReason?: any;
}
