import { Injectable } from '@nestjs/common';
import { SantanderApplicationAwareInterface, UnpackedDetailsAwareInterface } from '../interfaces/awareness';
import { UnpackedDetailsInterface } from '../interfaces/transaction';

@Injectable()
export class TransactionSantanderApplicationConverter {

  public static setSantanderApplication(
    transaction: SantanderApplicationAwareInterface,
    checkoutTransaction: UnpackedDetailsAwareInterface,
  ): void {
    transaction.santander_applications = [];
    /* eslint @typescript-eslint/naming-convention: 0 */
    const payment_details: UnpackedDetailsInterface = checkoutTransaction.payment_details;

    if (payment_details.finance_id) {
      transaction.santander_applications.push(payment_details.finance_id);
    }

    if (payment_details.application_no) {
      transaction.santander_applications.push(payment_details.application_no);
    }

    if (payment_details.application_number) {
      transaction.santander_applications.push(payment_details.application_number);
    }

    if (payment_details.applicationNumber) {
      transaction.santander_applications.push(payment_details.applicationNumber);
    }

    if (payment_details.usageText) {
      transaction.santander_applications.push(payment_details.usageText);
    }

    if (payment_details.caseId) {
      transaction.santander_applications.push(payment_details.caseId);
    }

    if (payment_details.case_id) {
      transaction.santander_applications.push(payment_details.case_id);
    }

    if (payment_details.usage_text
      || payment_details.usageText
      || payment_details.case_id
      || (payment_details.application_number && payment_details.case_id === undefined)
    ) {
      checkoutTransaction.payment_details.pan_id = payment_details.usage_text
        || payment_details.usageText
        || payment_details.case_id
        || payment_details.application_number;
    }
  }
}
