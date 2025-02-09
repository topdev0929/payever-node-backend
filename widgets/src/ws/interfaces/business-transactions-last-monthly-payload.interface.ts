import { MessagePayloadInterface } from './message-payload.interace';

export interface BusinessTransactionsLastMonthlyPayloadInterface extends MessagePayloadInterface {
  id: string;
  months?: number;
}
