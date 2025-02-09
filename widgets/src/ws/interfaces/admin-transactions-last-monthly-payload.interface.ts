import { MessagePayloadInterface } from './message-payload.interace';

export interface AdminTransactionsLastMonthlyPayloadInterface extends MessagePayloadInterface {
  months?: number;
}
