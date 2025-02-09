import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { MailerEventProducer } from '../../../src/users/producer';
import { User } from '../../../src/users';
import { RabbitMessagesEnum } from '../../../src/common';

@Injectable()
export class MailerEventMessagesMock extends AbstractMessageMock {
  private user: User = {
    _id: 'bcc92bd0-4ca7-41c9-8d86-3fab837220fc',
    email: 'hello@email.com',
    firstName: 'narayan',
    id: 'bcc92bd0-4ca7-41c9-8d86-3fab837220fc',
    ipAddress: '192.168.0.1',
    isActive: true,
    isVerified: true,
    lastName: 'ghimire',
    logo: 'some logo',
    // tslint:disable-next-line: no-hardcoded-credentials
    password: 'qwerrewqww',
    resetPasswordExpires: new Date(),
    resetPasswordToken: '1232331313133133',
    roles: [],
    salt: 'some salt',
    secondFactorRequired: true,
    unverifiedPeriodExpires: new Date(),
  } as User;

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SendEmail)
  public async mockPasswordResetEmailMessageEvent(): Promise<void> {
    const producer: MailerEventProducer = await this.getProvider<MailerEventProducer>(MailerEventProducer);
    await producer.producePasswordResetEmailMessage('www.payever.de', 'hello@payever.de', 'en');
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SendEmail)
  public async mockPasswordSetEmailMessageEvent(): Promise<void> {
    const producer: MailerEventProducer = await this.getProvider<MailerEventProducer>(MailerEventProducer);
    await producer.producePasswordSetEmailMessage('www.payever.de', 'hello@payever.de', 'en');
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SendEmail)
  public async mockproduceRegisterConfirmationEmailMessage(): Promise<void> {
    const producer: MailerEventProducer = await this.getProvider<MailerEventProducer>(MailerEventProducer);
    await producer.produceRegisterConfirmationEmailMessage('www.payever.de', 'hello@payever.de', 'en');
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SendEmail)
  public async mockProduceIdVerificationEmailMessage(): Promise<void> {
    const producer: MailerEventProducer = await this.getProvider<MailerEventProducer>(MailerEventProducer);
    await producer.produceIdVerificationEmailMessage(123, this.user, 'en');
  }
}
