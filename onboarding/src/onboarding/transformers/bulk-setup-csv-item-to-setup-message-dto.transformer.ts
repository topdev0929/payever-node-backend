// tslint:disable: object-literal-sort-keys
import { pickBy } from 'lodash';
import { plainToClass } from 'class-transformer';
import { SetupMessageDto, ConnectSettingsCellDto } from '../dto';
import { SetupMessageInterface } from '../interfaces/incoming';
import { trulyStringToBoolean } from './truly-string-to-boolean.transformer';
import { TaskType, WallpaperThemeEnum } from '../enums';
import { parseStylesTransformer } from './parse-styles.transformer';
import { parseConnectSettingsCellDto } from './parse-connect-settings.transformer';
import { BulkSetupCsvRawRowInterface } from '../interfaces/incoming/bulk-setup-csv-row.interface';

export function bulkSetupCsvItemToSetupMessageDtoTransformer(
  item: BulkSetupCsvRawRowInterface,
): SetupMessageDto {
  const connectAppsToSetup: ConnectSettingsCellDto = {
    ...parseConnectSettingsCellDto(item['Connect Payment']),
    ...parseConnectSettingsCellDto(item['Connect Communication']),
    ...parseConnectSettingsCellDto(item['Connect Shipping']),
    ...parseConnectSettingsCellDto(item['Connect Products']),
    ...parseConnectSettingsCellDto(item['Connect Shopsystems']),
  };
  const appsToInstall: string[] = Object.keys(
    pickBy(
      {
        pos: item['Pos App'],
        shop: item['Shop App'],
        transactions: item['Transactions App'],
        products: item['Products App'],
        shipping: item['Shipping App'],
      }, 
      trulyStringToBoolean,
    ),
  );

  const taxTurnoverAct: boolean = trulyStringToBoolean(item['Tax Turnover Act']);

  const hasTaxes: boolean = item['Tax Register Number'] && item['Tax Id'] && item['Tax Number'] && taxTurnoverAct;
  const contactEmails: string[] = item['Contact Emails']?.split(';') || [];

  const plain: SetupMessageInterface = {
    [TaskType.Business]: {
      name: item.Company,
      logo: item.Logo,
      companyAddress: {
        city: item.City,
        country: item['Country Code'],
        street: item.Street,
        zipCode: item.Zip,
      },
      companyDetails: {
        industry: item.Industry,
        phone: item.Phone,
        product: item.Product,
      },
      bankAccount: {
        bankName: item['Bank Name'],
        country: item['Bank Country Code'] || item['Country Code'],
        city: item['Bank City'],
        owner: item['Bank Owner'],
        bic: item['Bank BIC'],
        iban: item['Bank IBAN'],
      },
      taxes: hasTaxes ? {
        companyRegisterNumber: item['Tax Register Number'],
        taxId: item['Tax Id'],
        taxNumber: item['Tax Number'],
        turnoverTaxAct: taxTurnoverAct,
      } : undefined,
      contactEmails: contactEmails.filter(Boolean),
      defaultLanguage: item['Language Code'],
      currentWallpaper: {
        theme: item.Theme as WallpaperThemeEnum,
        wallpaper: item.Wallpaper,
      },
    },

    [TaskType.Wallpaper]: true,

    // TODO: Remove this property
    // After commerceos onboarding feature this property is unused, should be replaced by business type
    [TaskType.Apps]: {
      install: [
        'connect',
        'checkout',
        ...appsToInstall,
      ],
      onboardingName: item['Onboarding Name'],
    },

    [TaskType.Checkout]: {
      // Unused, to be removed
      channels: [],
      logo: item['Checkout Logo'],
      // Unused, to be removed
      name: `checkout-${item.Company}`,
      settings: {
        styles: parseStylesTransformer(item['Checkout Styles']),
      },
      sections: {
        preset: item['Checkout Preset'],
      },
    },

    [TaskType.Connect]: {
      install: Object.keys(connectAppsToSetup),
    },

    [TaskType.ConnectSettings]: connectAppsToSetup,

    [TaskType.Pos]: false,

    template: item.Template,
  };

  return plainToClass(SetupMessageDto, plain);
}
