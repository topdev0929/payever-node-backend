import { MessagePayloadInterface } from './message-payload.interace';

export interface TransactionsLastMonthlyPayloadInterface extends MessagePayloadInterface {
  months?: number;
}
