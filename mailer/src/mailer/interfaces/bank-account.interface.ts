import { Document } from 'mongoose';

export interface BankAccountInterface extends Document {
  readonly business_id: string;
  readonly country: string;
  readonly city: string;
  readonly bankName: string;
  readonly bankCode: string;
  readonly swift: string;
  readonly routingNumber: string;
  readonly accountNumber: string;
  readonly owner: string;
  readonly bic: string;
  readonly iban: string;
}
