import { CompanySearchGeneralRequestDto } from './company-search-general-request.dto';
import { CompanySearchAddressRequestDto } from './company-search-address-request.dto';

export class CompanySearchRequestDto {
  public company: CompanySearchGeneralRequestDto;
  public address: CompanySearchAddressRequestDto;
}
