import { Injectable } from '@nestjs/common';
import { ImapSimple, Message, MessageBodyPart } from 'imap-simple';
import { Moment } from 'moment';

@Injectable()
export class MailboxService {
  constructor(
    private readonly imapSimple: ImapSimple,
  ) {
  }

  public async getEmails(from: Moment = null): Promise<any> {
    const result: string[] = [];

    let searchCriteria: any[];
    if (from) {
      searchCriteria = [['SINCE', from.format('ll')]];
    } else {
      searchCriteria = ['ALL'];
    }

    await this.imapSimple.openBox('INBOX');

    const messages: Message[] = await this.imapSimple.search(
      searchCriteria,
      {
        bodies: ['HEADER', '1'],
        struct: true,
      },
    );

    for (const message of messages) {
      const partBody: string = message.parts.find((searchPart: MessageBodyPart) => searchPart.which === '1').body;
      result.push(partBody);
    }

    return result;
  }
}
