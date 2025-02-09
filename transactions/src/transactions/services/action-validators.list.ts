import { ActionItemValidatorsCollector } from './action-item-validators/action-item-validators.collector';
import {
  ActionItemIdentifierValidator,
} from './action-item-validators/validators/action-item-identifier-validator.service';
import {
  ActionItemTransactionValidatorService,
} from './action-item-validators/validators/action-item-transaction-validator.service';
import { ActionAmountValidatorsCollector } from './action-amount-validators/action-amount-validators.collector';
import {
  ActionAmountTransactionValidatorService,
} from './action-amount-validators/validators/action-amount-transaction-validator.service';

export const ActionValidatorsList: any[] = [
  ActionItemValidatorsCollector,
  ActionItemIdentifierValidator,
  ActionItemTransactionValidatorService,

  ActionAmountValidatorsCollector,
  ActionAmountTransactionValidatorService,
];
