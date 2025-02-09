import { Module } from '@nestjs/common';

import { ContactsBusMessageController } from './consumers';
import { ConsumerHandlerService } from './services';
import { SynchronizerModule } from '../synchronizer';

@Module({
  controllers: [
    ContactsBusMessageController,
  ],
  imports: [
    SynchronizerModule,
  ],
  providers: [
    ConsumerHandlerService,
  ],
})
export class ContactsModule { }
