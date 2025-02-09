import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommonSdkModule, ContinentSchema, ContinentSchemaName, CountrySchema, CountrySchemaName,
  CurrencySchema, CurrencySchemaName, LanguageSchema, LanguageSchemaName, LegalDocumentSchema,
  LegalDocumentSchemaName, LegalFormSchema, LegalFormSchemaName, TaxSchema, TaxSchemaName,
  CommonStorageSchemaName, CommonStorageSchema,

} from '@pe/common-sdk';
import { EventDispatcher } from '@pe/nest-kit';
import { MessageBusChannelsEnum } from '../common/enums';
import { environment } from '../environments';
import {
  AdminCommonStorageController,
  AdminContinentController, AdminCountryController, AdminCurrencyController,
  AdminLanguageController, AdminLegalDocumentController, AdminLegalFormController,
  AdminTaxController,

} from './controllers';
import {
  AdminCommonStorageService,
  AdminContinentService, AdminCountryService, AdminCurrencyService, AdminLanguageService,
  AdminLegalDocumentService, AdminLegalFormService, AdminTaxService,
} from './services';

@Module({
  controllers: [
    AdminCommonStorageController,
    AdminContinentController,
    AdminCountryController,
    AdminCurrencyController,
    AdminLanguageController,
    AdminLegalDocumentController,
    AdminLegalFormController,
    AdminTaxController,
  ],
  imports: [
    EventDispatcher,
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.common,
      consumerModels: [],
      rsaPath: environment.rsa,
    }),
    MongooseModule.forFeature([
      { name: ContinentSchemaName, schema: ContinentSchema },
      { name: CountrySchemaName, schema: CountrySchema },
      { name: CurrencySchemaName, schema: CurrencySchema },
      { name: LanguageSchemaName, schema: LanguageSchema },
      { name: LegalDocumentSchemaName, schema: LegalDocumentSchema },
      { name: LegalFormSchemaName, schema: LegalFormSchema },
      { name: TaxSchemaName, schema: TaxSchema },
      { name: CommonStorageSchemaName, schema: CommonStorageSchema },
    ]),
  ],
  providers: [
    AdminCommonStorageService,
    AdminContinentService,
    AdminCountryService,
    AdminCurrencyService,
    AdminLanguageService,
    AdminLegalDocumentService,
    AdminLegalFormService,
    AdminTaxService,
  ],
})
export class AdminModule { }
