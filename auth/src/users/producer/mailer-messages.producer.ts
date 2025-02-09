import { Injectable, Logger } from '@nestjs/common';
import { MessageBusService, MessageInterface, RabbitMqClient } from '@pe/nest-kit';
import { EmailDataInterface, User } from '../interfaces';
import { RabbitMessagesEnum } from '../../common';

@Injectable()
export class MailerEventProducer {
  constructor(
    private readonly logger: Logger,
    private readonly rabbitClient: RabbitMqClient,
    private readonly messageBusService: MessageBusService,
  ) { }

  public async producePasswordResetEmailMessage(
    password_reset_url: string,
    email: string,
    language: string,
  ): Promise<void> {
    const mailOptions: EmailDataInterface = {
      language: language ? language : 'en',
      params: {
        locale: language ? language : 'en',
        password_reset_url: password_reset_url,
      },
      to: email,
      type: 'passwordReset',
    };

    await this.produceSendEmailEvent(mailOptions);
  }

  public async producePasswordSetEmailMessage(
    password_set_url: string,
    email: string,
    language: string,
  ): Promise<void> {
    const mailOptions: EmailDataInterface = {
      language: language ? language : 'en',
      params: {
        locale: language ? language : 'en',
        password_set_url: password_set_url,
      },
      to: email,
      type: 'passwordSet',
    };

    await this.produceSendEmailEvent(mailOptions);
  }

  public async produceRegisterConfirmationEmailMessage(
    verificationLink: string,
    email: string,
    language: string,
  ): Promise<void> {
    const mailOptions: EmailDataInterface = {
      language: language ? language : 'en',
      params: {
        locale: language ? language : 'en',
        verificationLink,
      },
      to: email,
      type: 'registerConfirmation',
    };

    await this.produceSendEmailEvent(mailOptions);
  }

  public async produceIdVerificationEmailMessage(
    code: number,
    user: User,
    language: string,
  ): Promise<void> {
    await this.produceSendEmailEvent({
      language: language ? language : 'en',
      params: {
        code,
        locale: language ? language : 'en',
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      to: user.email,
      type: 'second-factor',
    });
  }

  public async produceAdminRegistrationEmailMessage(
    user: any,
    userInfo: any,
    email: string,
    language?: string,
  ): Promise<void> {
    const adminMail: EmailDataInterface = {
      language: language ? language : 'en',
      params: {
        locale: language ? language : 'en',
        user,
        userInfo,
      },
      to: email,
      type: 'admin_registration_notice',
    };

    await this.produceSendEmailEvent(adminMail);
  }

  public async produceRevokeUserEmailMessage(
    user: any,
    email: string,
    language?: string,
  ): Promise<void> {
    const revokeUserNotice: EmailDataInterface = {
      language: language ? language : 'en',
      params: {
        locale: language ? language : 'en',
        user,
      },
      to: email,
      type: 'revoke_user_notice',
    };

    await this.produceSendEmailEvent(revokeUserNotice);
  }

  private async produceSendEmailEvent(emailData: EmailDataInterface): Promise<void> {
    const message: MessageInterface = this.messageBusService.createMessage(RabbitMessagesEnum.SendEmail, emailData);

    return this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SendEmail,
        exchange: 'async_events',
      },
      message,
      true,
    );
  }
}
