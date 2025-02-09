import { MessagePayloadInterface } from './message-payload.interace';

export interface TransactionsLastDailyPayloadInterface extends MessagePayloadInterface {
  numDays?: number;
}
