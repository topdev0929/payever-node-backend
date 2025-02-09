import * as nodemailer from 'nodemailer';

import { MailDto } from '../dto/nodemailer';

export interface NodeMailerWrapperInterface {
  send(mailDto: MailDto): Promise<nodemailer.SentMessageInfo>;
}
