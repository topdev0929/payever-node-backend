import { Injectable } from '@nestjs/common';
import { MailboxService } from './mailbox.service';
import { RegistrationMessageInterface } from '../interfaces';
import { RegistrationMessageConverter } from '../converter';
import { Moment } from 'moment';

@Injectable()
export class RegistrationMessageService {
  constructor(
    private readonly mailboxService: MailboxService,
  ) {
  }

  public async getMessages(from: Moment): Promise<RegistrationMessageInterface[]> {
    const result: RegistrationMessageInterface[] = [];

    for (const emailBody of await this.mailboxService.getEmails(from)) {
      const registrationMessage: RegistrationMessageInterface = RegistrationMessageConverter.fromEmailBody(emailBody);
      if (registrationMessage) {
        result.push(registrationMessage);
      }
    }

    return result;
  }
}
