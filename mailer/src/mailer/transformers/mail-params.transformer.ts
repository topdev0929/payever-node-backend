import { pickBy } from 'lodash';

import { BankAccountInterface, BusinessInterface, UserInterface } from '../interfaces';
import { BusinessDto, PaymentMailDto } from '../dto/payment';
import { BankAccountDto } from '../dto/payment/business';

export class MailParamsTransformer {
  public static transform(
    paymentDto: PaymentMailDto,
    business?: BusinessInterface,
    bankAccount?: BankAccountInterface,
  ): any {
    paymentDto.setLocale(business);

    Object.assign(paymentDto, paymentDto.variables);
    if (business) {
      MailParamsTransformer.businessEntityToDto(paymentDto.business, business.toObject() as BusinessInterface);
      if (MailParamsTransformer.isUserEntity(business.owner)) {
        paymentDto.merchant = {
          ...paymentDto.merchant,
          name: business.owner.getFullName(),
        };
        paymentDto.business.user_full_name = business.owner.getFullName();
      }
    }

    if (bankAccount) {
      if (!paymentDto.business.bankAccount) {
        paymentDto.business.bankAccount = bankAccount.toObject();
      }
      MailParamsTransformer
      .bankAccountEntityToDto(paymentDto.business.bankAccount, bankAccount.toObject() as BankAccountInterface);
    }

    paymentDto.customer = paymentDto.customer || { };
    if (paymentDto.payment) {
      if (paymentDto.payment.customer_email) {
        paymentDto.customer.email = paymentDto.payment.customer_email;
      }

      if (paymentDto.payment.customer_name) {
        paymentDto.customer.name = paymentDto.payment.customer_name;
      }
      paymentDto.payment.business = paymentDto.business;
    }

    if (!paymentDto.merchant) {
      paymentDto.merchant = {
        email: '',
        name: '',
      };
    } else if (!paymentDto.merchant.email) {
      paymentDto.merchant.email = '';
    }

    return paymentDto;
  }

  private static bankAccountEntityToDto(dto: BankAccountDto, bankAccount: BankAccountInterface): void {
    this.copy(dto, bankAccount, ['accountNumber', 'bankCode', 'bic', 'iban', 'owner']);
  }

  private static businessEntityToDto(dto: BusinessDto, business: BusinessInterface): void {
    this.copy(dto, business, ['logo']);
    this.copy(dto, business, ['name']);
    if (business.companyAddress) {
      dto.companyAddress = this.copy(dto.companyAddress, business.companyAddress, [
        'country',
        'city',
        'street',
        'zipCode',
      ]);
    }
    if (business.companyDetails) {
      dto.companyDetails = this.copy(dto.companyDetails, business.companyDetails, ['legalForm', 'urlWebsite']);
    }
    if (business.contactDetails) {
      dto.contactDetails = this.copy(dto.contactDetails, business.contactDetails, ['phone']);
    }
  }

  private static copy(dto: object, entity: object, properties: string[]): any {
    if (!dto) {
      dto = { };
    }

    return Object.assign(dto, pickBy(entity, (el: string, key: string): boolean => !!el && properties.includes(key)));
  }

  private static isUserEntity(user: string | UserInterface): user is UserInterface {
    return user && typeof user !== 'string';
  }
}
