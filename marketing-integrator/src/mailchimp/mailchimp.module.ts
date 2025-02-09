import { MiddlewareConsumer, NestModule, Module, HttpModule } from '@nestjs/common';
import { MailchimpClientService } from './services';
import { MailchimpConfigInterface } from './interfaces';
import { environment } from '../environment/environment';

@Module({
  exports: [
    MailchimpClientService,
  ],
  imports: [
    HttpModule,
  ],
  providers: [
    MailchimpClientService,
    {
      provide: 'MailchimpConfigInterface',
      useValue: environment.mailchimp,
    },
  ],
})
export class MailchimpModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): any { }
}
