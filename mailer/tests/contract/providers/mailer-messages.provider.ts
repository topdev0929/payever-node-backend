import { Injectable } from '@nestjs/common';
import { PactRabbitMqMessageProvider, AbstractMessageMock } from '@pe/pact-kit';
import { RabbitEventNameEnum } from '../../../src/mailer/enum';
import { MailerEventsProducer } from '../../../src/mailer/producers';
import { PaymentMailModel } from '../../../src/mailer/models';

@Injectable()
export class MailerMessagesProvider extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(RabbitEventNameEnum.PaymentMailSent)
  public async mockPaymentMailSent(): Promise<void> {
    const producer: MailerEventsProducer = await this.getProvider<MailerEventsProducer>(MailerEventsProducer);
    await producer.producePaymentMailSentEvent(
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        templateName: 'some_template_name',
        transactionId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      } as PaymentMailModel,
    );
  }
}
