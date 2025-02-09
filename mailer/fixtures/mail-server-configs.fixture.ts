import { MailServerConfigInterface } from '../src/mailer/interfaces';
import { ServerTypeEnum } from '../src/mailer/enum';

export const MailServerConfigsFixture: MailServerConfigInterface[] = [
  {
    env: 'TEST',
    serverType: ServerTypeEnum.payever,
    password: 'waucjonshOjyivedcuj1',
    port: 1025,
    host: 'mailbox-smtp.devpayever.com',
    user: 'no-reply@payever.org',
  },
  {
    env: 'LIVE',
    serverType: ServerTypeEnum.payever,
    password: 'waucjonshOjyivedcuj1',
    port: 587,
    host: 'mail.payever.org',
    user: 'no-reply@payever.org',
  },
  {
    env: 'TEST',
    serverType: ServerTypeEnum.santander,
    password: 'waucjonshOjyivedcuj1',
    port: 1025,
    host: 'mailbox-smtp.devpayever.com',
    user: 'no-reply@payever.org',
  },
  {
    env: 'LIVE',
    serverType: ServerTypeEnum.santander,
    password: 'S84M9f8J5D',
    port: 587,
    host: 'mail.payever.org',
    user: 'no-reply@b2b.santandercib.com',
  },
]
