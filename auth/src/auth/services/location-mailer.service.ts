import { Injectable } from '@nestjs/common';

import { RmqSender } from '../../common';
import { RequestFingerprint } from '../interfaces';
import { EmailDataInterface } from '../../users/interfaces';

@Injectable()
export class LocationMailerService {
  constructor(private readonly rmqSender: RmqSender) { }

  public async sendSuspiciousLocationNotification(
    to: string,
    parsedRequest: RequestFingerprint,
    language: string,
  ): Promise<void> {
    const mailEvent: string = 'payever.event.mailer.send';
    const templateName: string = 'login_new_location';

    const mailOptions: EmailDataInterface = {
      language: language || 'en',
      params: {
        locale: language || 'en',
        login_location: {
          browser: parsedRequest.browser || 'Unknown',
          date: new Date().toLocaleString('en', {
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            month: 'long',
            second: 'numeric',
            weekday: 'long',
            year: 'numeric',
          }),
          ip: parsedRequest.ipAddress,
          os: parsedRequest.os || 'Unknown',
        },
        user: { email: to },
      },
      subject: LocationMailerService.formatSubject(parsedRequest),
      to,
      type: templateName,
    };

    return this.rmqSender.send(mailEvent, mailOptions);
  }

  private static formatSubject(parsedRequest: RequestFingerprint): string {
    let result: string = 'New login';

    if (parsedRequest.browser) {
      result += ` from ${parsedRequest.browser}`;
    }

    if (parsedRequest.os) {
      result += ` on ${parsedRequest.os}`;
    }

    return result;
  }
}
