import { MessagePayloadInterface } from './message-payload.interace';

export interface BusinessTransactionsLastDailyPayloadInterface extends MessagePayloadInterface {
  id: string;
  numDays?: number;
}
