import { HttpModule, Module } from '@nestjs/common';
import { PaymentsService } from './services';
import { PaymentsController, MailerBusMessagesController } from './controllers';
import { IntegrationModule } from '../integration';

// TODO: move that module somewhere else, like third-party, or payments micros...
@Module({
  controllers: [
    PaymentsController,
    MailerBusMessagesController,
  ],
  imports: [
    HttpModule,
    IntegrationModule,
  ],
  providers: [
    PaymentsService,
  ],
})
export class PaymentsModule { }
