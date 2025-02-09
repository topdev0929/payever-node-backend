import { TransactionUnpackedDetailsInterface } from './transaction';
import { ActionItemInterface } from './action-item.interface';
import { ActionPayloadInterface } from './action-payload';
import { UserTokenInterface } from '@pe/nest-kit';
import { ActionWrapperDto } from '../dto/helpers';

export interface ActionCallerInterface {
  getActionsList(
    transaction: TransactionUnpackedDetailsInterface,
  ): Promise<ActionItemInterface[]>;

  runAction(
    transaction: TransactionUnpackedDetailsInterface,
    actionWrapper: ActionWrapperDto,
  ): Promise<void>;

  updateStatus(
    transaction: TransactionUnpackedDetailsInterface,
    originalUser?: UserTokenInterface,
  ): Promise<void>;
}
