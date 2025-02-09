import { TransactionUnpackedDetailsInterface } from './transaction-unpacked-details.interface';

export interface TransactionSettlementReportInterface extends TransactionUnpackedDetailsInterface {
  business: { name: string };
}
