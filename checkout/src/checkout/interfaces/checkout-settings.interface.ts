import { CheckoutCallbacksInterface } from './checkout-callbacks.interface';
import { CheckoutBusinessTypeEnum } from '../../common/enum';
import { CheckoutFooterUrlsInterface } from './checkout-footer-urls.interface';

export interface CheckoutSettingsInterface {
  businessType?: CheckoutBusinessTypeEnum;
  callbacks?: CheckoutCallbacksInterface;
  cspAllowedHosts: string[];
  enableCustomerAccount: boolean;
  enablePayeverTerms: boolean;
  enableLegalPolicy: boolean;
  enableDisclaimerPolicy: boolean;
  enableRefundPolicy: boolean;
  enableShippingPolicy: boolean;
  enablePrivacyPolicy: boolean;
  languages: CheckoutLanguageInterface[];
  testingMode: boolean;
  customerAccount?: any;
  keyword?: string;
  message?: string;
  phoneNumber?: string;
  policies?: any;
  styles?: StylesSettingsInterface;
  version?: string;

  hideLogo?: boolean;
  hideImprint?: boolean;
  footerUrls?: CheckoutFooterUrlsInterface;
}

export interface StylesSettingsInterface {
  active?: boolean;
  businessHeaderBorderColor?: string;
  businessHeaderBackgroundColor?: string;
  businessHeaderDesktopHeight?: number;
  businessHeaderMobileHeight?: number;
  buttonBackgroundColor?: string;
  buttonFill?: boolean;
  buttonBackgroundDisabledColor?: string;
  buttonTextColor?: string;
  buttonBorderRadius?: string;
  pageBackgroundColor?: string;
  pageLineColor?: string;
  pageTextPrimaryColor?: string;
  pageTextSecondaryColor?: string;
  pageTextLinkColor?: string;
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputTextPrimaryColor?: string;
  inputTextSecondaryColor?: string;
  inputBorderRadius?: string;
}

export interface CheckoutLanguageInterface {
  active: boolean;
  code: string;
  isDefault: boolean;
  name: string;
}
