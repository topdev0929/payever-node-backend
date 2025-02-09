import { ActionDto, GetTransactionActionDto } from '../dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionsRetrieverService {
  public retrieveActions(transactionDto: GetTransactionActionDto): ActionDto[] {
    const actionsMap: Map<string, ActionDto> = new Map();
    for (const historyItem of transactionDto.history) {
      if (historyItem.action === 'email_sent' && this.isResendingAllowed(historyItem.mail_event.template_name)) {
        actionsMap.set(historyItem.mail_event.template_name, {
          action: `resend_${historyItem.mail_event.template_name}`,
          enabled: true,
          mailEvent: {
            id: historyItem.mail_event.event_id,
          },
        });
      }
    }

    return Array.from(actionsMap.values());
  }

  private isResendingAllowed(templateName: string): boolean {
    return [
      'shipping_order_template',
    ].indexOf(templateName) !== -1;
  }
}
