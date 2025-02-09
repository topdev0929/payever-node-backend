import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { SynchronizationTaskErrorInterface } from '../interfaces';
import { SynchronizationTaskModel } from '@pe/synchronizer-kit';

const MAILER_EVENT_NAME: string = 'payever.event.business.email';

@Injectable()
export class MailerEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async triggerFailedImportMessage(
    task: SynchronizationTaskModel,
  ): Promise<void> {
    await this.triggerMessage('products-import-failed', task);
  }

  public async triggerSuccessImportMessage(
    task: SynchronizationTaskModel,
  ): Promise<void> {
    await this.triggerMessage('products-import-successful', task);
  }

  private async triggerMessage(
    templateName: string,
    task: SynchronizationTaskModel,
  ): Promise<void> {
    await task.populate('business').execPopulate();

    await this.sendMailerEvent(
      templateName,
      task.business.id,
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
      message: `SENDING "${MAILER_EVENT_NAME}" event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: MAILER_EVENT_NAME,
        exchange: 'async_events',
      },
      {
        name: MAILER_EVENT_NAME,
        payload,
      },
    );
  }
}
