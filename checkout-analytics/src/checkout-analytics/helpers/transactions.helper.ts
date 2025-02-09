import { PaymentModel } from '../models';
import { PaymentInterface, TransactionsAwareReportInterface } from '../interfaces';

export class TransactionsHelper {
  public static preparePaymentModelsForDb(paymentModels: PaymentModel[]): Map<string, PaymentInterface> {
    return new Map<string, PaymentInterface>(paymentModels.map((paymentModel: PaymentModel) => {
      return [
        paymentModel.id,
        {
          amount: paymentModel.amount,
          businessId: paymentModel.businessId,
          channel: paymentModel.channel,
          currency: paymentModel.currency,
          customerEmail: paymentModel.customerEmail,
          customerName: paymentModel.customerName,
          customerType: paymentModel.customerType,
          originalId: paymentModel.originalId,
          paymentMethod: paymentModel.paymentMethod,
          reference: paymentModel.reference,
          status: paymentModel.status,
          total: paymentModel.total,
          userId: paymentModel.userId,
        },
      ];
    }));
  }

  public static moveTransactions(from: TransactionsAwareReportInterface, to: TransactionsAwareReportInterface): void {
    if (!(from.approvedTransactions instanceof Map)) {
      from.approvedTransactions = new Map(Object.entries(from.approvedTransactions));
    }
    if (!(from.rejectedTransactions instanceof Map)) {
      from.rejectedTransactions = new Map(Object.entries(from.rejectedTransactions));
    }
    if (!(to.approvedTransactions instanceof Map)) {
      to.approvedTransactions = new Map(Object.entries(to.approvedTransactions));
    }
    if (!(to.rejectedTransactions instanceof Map)) {
      to.rejectedTransactions = new Map(Object.entries(to.rejectedTransactions));
    }

    for (const approvedTransaction of from.approvedTransactions) {
      const paymentId: string = approvedTransaction[0];
      const payment: PaymentInterface = approvedTransaction[1];
      if (!to.approvedTransactions.has(paymentId)) {
        to.approvedTransactions.set(paymentId, payment);
      }
      if (to.rejectedTransactions.has(paymentId)) {
        to.rejectedTransactions.delete(paymentId);
      }
    }

    for (const rejectedTransaction of from.rejectedTransactions) {
      const paymentId: string = rejectedTransaction[0];
      const payment: PaymentInterface = rejectedTransaction[1];
      if (!to.rejectedTransactions.has(paymentId)) {
        to.rejectedTransactions.set(paymentId, payment);
      }
      if (to.approvedTransactions.has(paymentId)) {
        to.approvedTransactions.delete(paymentId);
      }
    }
  }
}
