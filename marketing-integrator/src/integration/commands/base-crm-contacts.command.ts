import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import * as moment from 'moment';
import { BaseCrmClientService, BaseCrmContactInterface } from '../../base-crm';
import { RegistrationMessageInterface, RegistrationMessageService } from '../../mailbox';
import { MessageToCrmConverter } from '../converter';
import { environment } from '../../environment/environment';
import Timeout = NodeJS.Timeout;
import { BaseCrmService } from '../services';

@Injectable()
export class BaseCrmContactsCommand {
  constructor(
    private readonly baseCrmClientService: BaseCrmClientService,
    private readonly baseCrmService: BaseCrmService,
    private readonly registrationMessageService: RegistrationMessageService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'contacts:sync:mail-to-crm',
    describe: 'Imports contact into Base CRM from registration form emails',
  })
  public async synchronize(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const sleep: any = (ms: number): Promise<void> => new Promise((resolve: any): Timeout  => setTimeout(resolve, ms));

    // imap client does login without promise
    await sleep(5000);

    this.logger.log('Starting contacts:sync:mail-to-crm');

    const from: moment.Moment = environment.syncFromDate as moment.Moment;
    const messages: RegistrationMessageInterface[] = await this.registrationMessageService.getMessages(from);

    let createdCount: number = 0;
    let errorsCount: number = 0;

    this.logger.log(`Form messages received: ${messages.length}`);

    for (const message of messages) {
      try {
        const convertedMessage: BaseCrmContactInterface = MessageToCrmConverter.convert(message);

        await this.baseCrmService.createContactAndLead(convertedMessage);
        
        createdCount++;
      } catch (error) {
        errorsCount++;
        this.logger.error({ error, message });
      }
    }

    this.logger.log(`Total contacts created: ${createdCount}`);
    this.logger.log(`Errors count: ${errorsCount}`);
  }
}
