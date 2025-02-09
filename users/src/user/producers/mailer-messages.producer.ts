import { Injectable } from '@nestjs/common';
import { MessageBusService, MessageInterface, RabbitMqClient, UserTokenInterface } from '@pe/nest-kit';

import { BusinessModel, UserModel } from '../models';
import { MailerEnum } from '../enums/mailer.enum';
import { EmailDataInterface } from '../interfaces';
import { TrafficSourceDto } from '../dto';
import { UserInfoDto } from '../dto/create-user-account';
import { environment } from '../../../src/environments';

@Injectable()
export class MailerEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly messageBusService: MessageBusService,

  ) { }

  public async produceBusinessCreatedEmailMessage(
    user: UserModel,
    business: BusinessModel,
    trafficSource: TrafficSourceDto,
    email: string,
  ): Promise<void> {
    const defaultTrafficSource: TrafficSourceDto = {
      campaign: '',
      content: '',
      medium: '',
      source: '',
    };

    const templateName: string = 'admin_new_business_notice';

    const emailData: EmailDataInterface = {
      cc: environment.adminEmailCC,
      language: 'en',
      params: {
        business,
        trafficSource: trafficSource || defaultTrafficSource,
        user,
      },
      subject: 'New business registered',
      to: email,
      type: templateName,
    };

    await this.produceSendEmailEvent(emailData);
  }

  public async produceMerchantRegistrationEmailMessage(
    userToken: UserTokenInterface,
    userInfo: UserInfoDto,
    email: string,
  ): Promise<void> {
    const merchantMail: EmailDataInterface = {
      cc: environment.adminEmailCC,
      language: 'en',
      params: {
        user: userToken,
        userInfo,
      },
      subject: 'New user registered',
      to: email,
      type: 'admin_registration_notice',
    };

    await this.produceSendEmailEvent(merchantMail);
  }

  public async produceOwnerInvitationEmailMessage(
    businessName: string,
    to: string,
    invitationLink: string,
    firstName: string,
    lastName: string,
    locale: string = 'en',
  ): Promise<void> {

    const ownerInvitationEmail: EmailDataInterface = {
      cc: [],
      language: locale,
      params: {
        businessName,
        invitationLink,
        firstName,
        lastName,
        locale,
      },
      subject: 'Owner invitation',
      to: to,
      type: 'owner_transfer',
    };

    await this.produceSendEmailEvent(ownerInvitationEmail);
  }

  private async produceSendEmailEvent(emailData: EmailDataInterface): Promise<void> {
    const message: MessageInterface = this.messageBusService.createMessage(MailerEnum.SendEmail, emailData);

    return this.rabbitClient.send(
      {
        channel: MailerEnum.SendEmail,
        exchange: 'async_events',
      },
      message,
      true
    );
  }
}
