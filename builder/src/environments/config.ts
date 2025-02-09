/* tslint:disable */
import { ApplicationTypesEnum } from '@pe/builder-kit/module/common/enums';

export const GeneralConfig: any = {
  autoInstallDefaultTheme: [
    ApplicationTypesEnum.Affiliate,
    ApplicationTypesEnum.Appointments,
    ApplicationTypesEnum.Blog,
    ApplicationTypesEnum.Mail,
    ApplicationTypesEnum.Message,
    ApplicationTypesEnum.Invoice,
    ApplicationTypesEnum.Site,
    ApplicationTypesEnum.Shop,
    ApplicationTypesEnum.Subscriptions,

    'application', // for testing purpose
  ],
  autoCreateDefault: [
    ApplicationTypesEnum.Affiliate,
    ApplicationTypesEnum.Appointments,
    ApplicationTypesEnum.Blog,
    ApplicationTypesEnum.Mail,
    ApplicationTypesEnum.Message,
    ApplicationTypesEnum.Invoice,
    ApplicationTypesEnum.Site,
    ApplicationTypesEnum.Shop,
    ApplicationTypesEnum.Subscriptions,

    'application', // for testing purpose
  ],
  wsDisabled: [
    ApplicationTypesEnum.Appointments,
    ApplicationTypesEnum.Message,
  ],
};
