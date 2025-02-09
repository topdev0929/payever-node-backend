import { TransactionActionsEnum } from '../enums';

export class ActionDto {
  public action: TransactionActionsEnum;
  public enabled: boolean;
}
