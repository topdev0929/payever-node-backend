import { plainToClass } from 'class-transformer';
import { BaseBusinessDto } from '../dto';
import { StatusEnum } from '../enums';

export class BusinessMigrationDtoTransformer {

  public static transform(data: any): BaseBusinessDto {
    const businessAddress: any = data.business_address || { };
    const bankAccount: any = data.bank_account || { };

    return plainToClass<BaseBusinessDto, { }>(
        BaseBusinessDto,
        {
          active: data.registered,
          bankAccount: {
            accountNumber: bankAccount.accountNumber,
            bankCode: bankAccount.bankCode,
            bankName: bankAccount.bankName,
            bic: bankAccount.bic,
            city: bankAccount.city,
            country: bankAccount.country,
            iban: bankAccount.iban,
            owner: bankAccount.owner,
            routingNumber: bankAccount.routingNumber,
            swift: bankAccount.swift,
          },
          companyAddress: {
            city: businessAddress.city || '',
            country: businessAddress.country || '',
            street: businessAddress.street || '',
            zipCode: businessAddress.zip_code || '',
          },
          companyDetails: {
            foundationYear: data.founding_year,
            industry: data.sector || 'BRANCHE_OTHERS',
            legalForm: data.legal_form,
            product: 'PRODUCT_OTHERS',
            status: data.status || StatusEnum.JustLooking,
            urlWebsite: data.url,
          },
          contactDetails: {
            additionalPhone: businessAddress.mobilePhone || '',
            fax: businessAddress.fax || '',
            firstName: data.chief_name || '',
            lastName: '',
            phone: businessAddress.phone || '',
            salutation: data.chief_title || 'SALUTATION_MR',
          },
          contactEmails: Array.isArray(data.alternative_emails) ? data.alternative_emails : [],
          createdAt: new Date(data.created_at || data.updated_at || new Date()).toISOString(),
          cspAllowedHosts: data.csp_allowed_hosts,
          currency: data.currency,
          currencyFormat: data.currencyFormat,
          hidden: data.hidden,
          logo: data.business_logo_id,
          name: data.name,
          taxes: {
            companyRegisterNumber: data.commercial_register_number,
            taxId: data.tax_id,
            taxNumber: data.tax_number,
            turnoverTaxAct: data.small_business,
          },
        },
      );
  }
}
