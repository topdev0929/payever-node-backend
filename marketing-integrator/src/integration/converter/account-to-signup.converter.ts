import { AccountDto, BusinessDto } from '../dto';
import { SignupsDto } from '../../signups/signups.dto';

export class AccountToSignupConverter {
  public static convert(account: AccountDto): SignupsDto {
    const business: BusinessDto = account.businesses && account.businesses.length ? account.businesses[0] : null;

    return {
      app: business ? business.companyDetails.industry : 'fashion',
      business_name: business ? business.name : '',
      country_code: business ? business.companyAddress.country : '',
      email: account.userAccount.email,
      form_name: business ? business.companyDetails.industry : '',
      full_name: `${account.userAccount.firstName} ${account.userAccount.lastName}`,
      phone: business.companyDetails.phone,
      source_host: 'commerceos.payever.org',
    };
  }
}
