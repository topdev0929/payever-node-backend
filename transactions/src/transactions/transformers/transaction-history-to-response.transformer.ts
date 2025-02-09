import { TransactionHistoryResponseDto } from '../dto/history';
import { HistoryCommonModel } from '../models';

export function toTransactionHistoryResponse(
  model: HistoryCommonModel,
  transactionId?: string,
): TransactionHistoryResponseDto {
  if (!model) {
    return null;
  }

  return {
    id: model.idempotency_key,

    action: model.action,
    amount: model.amount,
    createdAt: model.created_at,
    currency: model.currency,
    items: model.items,
    reason: model.reason,
    status: model.status,
    transactionId,
    user: model.user,
  };
}
