import { JsonAssertion } from '@pe/cucumber-sdk';
import { MailDto } from '../../src/mailer/dto/nodemailer';

export class MailerStorage {
  private static mails: MailDto[] = [];

  public static addMail(dto: MailDto): void {
    MailerStorage.mails.push(dto);
  }

  public static exists(mail: any): boolean {
    return JsonAssertion.contains(MailerStorage.mails, mail);
  }

  public static getMailsList(): MailDto[] {
    const mails: MailDto[] = MailerStorage.mails;
    for (const mail of mails) {
      if (Array.isArray(mail.attachments)) {
        for (const attachment of mail.attachments) {
          delete attachment.content;
        }
      }
    }

    return mails;
  }

  public static clear(): void {
    MailerStorage.mails = [];
  }
}
