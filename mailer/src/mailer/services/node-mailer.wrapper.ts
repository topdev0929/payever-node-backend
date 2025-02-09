import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import * as SMTPConnection from 'nodemailer/lib/smtp-transport';

import { environment } from '../../environments';
import { MailDto } from '../dto/nodemailer';
import { NodeMailerWrapperInterface } from '../interfaces';

@Injectable()
export class NodeMailerWrapper implements NodeMailerWrapperInterface {
  constructor(private readonly logger: Logger) { }

  public async send(mailDto: MailDto): Promise<void> {
    mailDto.to = `<${mailDto.to}>`;

    const options: SMTPConnection.Options = {
      auth: {
        pass: mailDto.serverConfig.password,
        user: mailDto.serverConfig.user,
      },
      dkim: environment.mailerConfigDkim,
      host: mailDto.serverConfig.host,
      port: mailDto.serverConfig.port,
      secure: false,
    };

    const smtpTransport: Mail = nodemailer.createTransport(options);

    try {
      await smtpTransport.sendMail(mailDto);
    } catch (e) {
      let message: string = 'Mail transport error';

      if (e.command === 'RCPT TO' && e.responseCode === 550 && mailDto.to.match(/payever\.(org|de)$/)) {
        message = 'Mail error muted';
      }

      this.logger.warn({
        error: e.message,
        message,
      });
    }

    smtpTransport.close();
  }
}
