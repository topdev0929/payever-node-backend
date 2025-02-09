import { PaymentMailDto } from '../dto/payment';
import { BusinessInterface, RecipientsInterface, UserInterface } from '../interfaces';

export class RecipientsTransformer {
  public static getRecipients(paymentDto: PaymentMailDto, business: BusinessInterface): RecipientsInterface {
    const result: RecipientsInterface = {
      cc: paymentDto.cc,
      to: paymentDto.to,
    };

    if (business) {
      const businessEmails: string[] = this.getBusinessEmails(paymentDto, business);
      if (paymentDto.ccShouldUseBusinessEmail() && businessEmails.length) {
        result.cc = businessEmails;
      }

      if (paymentDto.toShouldUseBusinessEmail() && businessEmails.length) {
        result.to = businessEmails[0];

        if (result.cc === null) {
          result.cc = [];
        }

        if (!Array.isArray(result.cc)) {
          result.cc = [result.cc];
        }

        result.cc = result.cc.concat(businessEmails);
      }
    }

    return result;
  }

  private static getBusinessEmails(paymentDto: PaymentMailDto, business: BusinessInterface): string[] {
    const user: UserInterface = business.owner as UserInterface;

    if (business.contactEmails && business.contactEmails.length) {
      return business.contactEmails;
    }

    if (paymentDto.business.contactEmails && paymentDto.business.contactEmails.length) {
      return paymentDto.business.contactEmails;
    }

    if (user && user.userAccount && user.userAccount.email) {
      return [user.userAccount.email];
    }

    if (paymentDto.business.user && paymentDto.business.user.email) {
      return [paymentDto.business.user.email];
    }

    return [];
  }
}
