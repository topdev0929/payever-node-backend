import * as Imap from 'imap';
import { ImapSimple } from 'imap-simple';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MailboxService, RegistrationMessageService } from './services';
import { environment } from '../environment/environment';

@Module({
  exports: [
    RegistrationMessageService,
  ],
  providers: [
    RegistrationMessageService,
    MailboxService,
    {
      provide: ImapSimple,
      useFactory: async (): Promise<ImapSimple> => {
        const imap: Imap = new Imap(environment.imap);
        imap.connect();

        return new ImapSimple(imap);
      },
    },
  ],
})
export class MailboxModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): any { }
}
