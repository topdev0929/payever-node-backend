import { CompanySearchRequestDto } from '../dto/request/v1';
import { ThirdPartyCompanySearchInterface } from '../interfaces';

export class B2bTransformer {
  public static companySearchDtoToTPPMDto(
    companySearchRequestDto: CompanySearchRequestDto,
  ): ThirdPartyCompanySearchInterface {
    return {
      address: {
        city: companySearchRequestDto?.address?.city,
        country: companySearchRequestDto?.address?.country,
        phone: companySearchRequestDto?.address?.phone,
        streetName: companySearchRequestDto?.address?.street_name,
        streetNumber: companySearchRequestDto?.address?.street_number,
        zip: companySearchRequestDto?.address?.zip,
      },
      company: {
        externalId: companySearchRequestDto?.company?.external_id,
        getCreditLine: companySearchRequestDto?.company?.get_credit_line,
        getLegalForm: companySearchRequestDto?.company?.get_legal_form,
        name: companySearchRequestDto?.company?.name,
        registrationId: companySearchRequestDto?.company?.registration_id,
        type: companySearchRequestDto?.company?.type,
        vatId: companySearchRequestDto?.company?.vat_id,
      },
    };
  }
}
