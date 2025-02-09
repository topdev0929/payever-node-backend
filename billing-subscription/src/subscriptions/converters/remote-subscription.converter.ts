import { RemoteSubscriptionDto, TransactionRmqMessageDto, TransactionItemRmqMessageDto } from '../dto';

export class RemoteSubscriptionConverter {
  public static listFromTransaction(transaction: TransactionRmqMessageDto): RemoteSubscriptionDto[] {
    const subscriptions: RemoteSubscriptionDto[] = [];

    for (const item of transaction.items) {
      if (this.hasSubscription(item)) {
        subscriptions.push({
          businessId: transaction.business.uuid,
          customerEmail: transaction.customer_email,
          customerName: transaction.customer_name,
          id: item.extra_data.subscriptionId,
          reference: transaction.reference,
          subscriptionPlanId: item.extra_data.subscriptionPlan,
          transactionUuid: transaction.uuid,
          userId: transaction.user_uuid,
        });
      }
    }

    return subscriptions;
  }

  private static hasSubscription(item: TransactionItemRmqMessageDto): boolean {
    return !!item.extra_data && !!item.extra_data.subscriptionId;
  }
}
