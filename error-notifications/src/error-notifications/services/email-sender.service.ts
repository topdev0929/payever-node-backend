import { Injectable } from '@nestjs/common';
import { ErrorNotificationAggregateDto, ErrorNotificationEmailDto } from '../dto';
import { MessageBusEventsEnum, MessageBusExchangesEnum } from '../enums';
import { RabbitMqService, EmailTransformerCollector } from './';
import { environment } from '../../environments';

@Injectable()
export class EmailSender {
  constructor(
    protected readonly rabbitmqService: RabbitMqService,
    protected readonly emailTransformerCollector: EmailTransformerCollector,
) {
  }

  public async sendEmails(
    errorNotifications: ErrorNotificationAggregateDto,
  ): Promise<void> {
    const emailDtoList: ErrorNotificationEmailDto[] =
      await this.emailTransformerCollector.transformNotificationErrorToEmailDto(errorNotifications);

    for (const emailDto of emailDtoList) {
      for ( const error of emailDto.variables.errors) {
        const emailToSent: ErrorNotificationEmailDto = {
          ...emailDto,
        };
        emailToSent.variables = { ...error };
        emailToSent.to = environment.notificationEmail ? environment.notificationEmail : null;
        if (environment.bccEmail) {
          emailToSent.bcc = [];
          emailToSent.bcc.push(environment.bccEmail);
        }

        await this.rabbitmqService.sendEvent(
          MessageBusExchangesEnum.asyncEvents,
          MessageBusEventsEnum.businessEmail,
          emailToSent,
        );
      }
    }
  }
}
