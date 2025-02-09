import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

import { SynchronizationTaskErrorInterface } from '../interfaces';
import { SynchronizationTaskModel } from '../models';
import { MailerRmqOutgoingEventsEnum, MailerTemplateNames } from '../enums';

@Injectable()
export class MailerEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async triggerFailedImportMessage(
    task: SynchronizationTaskModel,
  ): Promise<void> {
    await this.triggerMessage(MailerTemplateNames.ImportFailed, task);
  }

  public async triggerSuccessImportMessage(
    task: SynchronizationTaskModel,
  ): Promise<void> {
    await this.triggerMessage(MailerTemplateNames.ImportSuccessful, task);
  }

  private async triggerMessage(
    templateName: string,
    task: SynchronizationTaskModel,
  ): Promise<void> {
    await this.sendMailerEvent(
      templateName,
      task.businessId,
      task.errorsList,
    );
  }

  private async sendMailerEvent(
    templateName: string,
    businessId: string,
    errorsList: SynchronizationTaskErrorInterface[],
  ): Promise<void> {
    const payload: { } = {
      businessId: businessId,
      templateName: templateName,
      variables: {
        errorsList,
      },
    };

    this.logger.log({
      context: 'MailerEventProducer',
      message: `SENDING "${MailerRmqOutgoingEventsEnum.Mail}" event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: MailerRmqOutgoingEventsEnum.Mail,
        exchange: 'async_events',
      },
      {
        name: MailerRmqOutgoingEventsEnum.Mail,
        payload,
      },
    );
  }
}
