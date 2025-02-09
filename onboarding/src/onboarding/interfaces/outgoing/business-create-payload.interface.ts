import { WallpaperThemeEnum } from '../../../onboarding/enums';

/**
 * @see users/src/user/dto/create-business/business.dto.ts
 */
export interface BusinessCreateBusinessPayloadInterface {
  id: string;
  name: string;
  logo?: string;
  currency?: string;
  active?: boolean;
  hidden?: boolean;
  businessId?: string;
  companyAddress: {
    country: string;
    city?: string;
    street?: string;
    zipCode?: string;
  };
  companyDetails: {
    businessStatus?: string;
    legalForm?: string;
    phone?: string;
    product: string;
    industry?: string;
    urlWebsite?: string;
    foundationYear?: string;
    status?: string;
  };
  contactDetails?: {
    salutation?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    fax?: string;
    additionalPhone?: string;
  };
  bankAccount?: {
    country?: string;
    city?: string;
    bankName?: string;
    bankCode?: string;
    swift?: string;
    routingNumber?: string;
    accountNumber?: string;
    owner?: string;
    bic?: string;
    iban?: string;
  };
  taxes?: {
    companyRegisterNumber?: string;
    taxId?: string;
    taxNumber?: string;
    turnoverTaxAct?: boolean;
  };
  contactEmails?: string[];
  defaultLanguage?: string;
  currentWallpaper?: {
    theme?: WallpaperThemeEnum;
    auto?: boolean;
    wallpaper?: string;
  };
}

/**
 * @see users/src/user/dto/update-user-account/user-account.dto.ts
 */
interface BusinessCreateUserAccountPayloadInterface {
  email: string;
  firstName: string;
  lastName: string;
}

export type BusinessCreatePayloadInterface =
  BusinessCreateBusinessPayloadInterface & BusinessCreateUserAccountPayloadInterface;
