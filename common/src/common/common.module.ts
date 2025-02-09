import { Module } from '@nestjs/common';
import {
  ContinentController,
  CountryController,
  CurrencyController,
  LanguageController,
  LegalDocumentController,
  LegalFormController,
  TaxController,
} from './controllers';

import { DataExportCommand } from './commands';
import { CommonSdkModule } from '@pe/common-sdk';
import { environment } from '../environments';
import { CurrencyUpdaterCron } from './cron';
import { CommonDataEventProducer } from './producer';
import { CurrencyEventsListener } from './listeners';
import { EventDispatcher } from '@pe/nest-kit';
import { MessageBusChannelsEnum } from './enums';

@Module({
  controllers: [
    ContinentController,
    CountryController,
    CurrencyController,
    LanguageController,
    LegalDocumentController,
    LegalFormController,
    TaxController,
  ],
  imports: [
    EventDispatcher,
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.common,
      consumerModels: [],
      rsaPath: environment.rsa,
    }),
  ],
  providers: [
    DataExportCommand,
    CurrencyUpdaterCron,
    CurrencyEventsListener,
    CommonDataEventProducer,
  ],
})
export class CommonModule { }
