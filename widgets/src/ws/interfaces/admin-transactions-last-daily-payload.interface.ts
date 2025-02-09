import { MessagePayloadInterface } from './message-payload.interace';

export interface AdminTransactionsLastDailyPayloadInterface extends MessagePayloadInterface {   
  numDays?: number;
}
