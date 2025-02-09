import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { TerminalModel } from '../models';

@Injectable()
export class ForceInstallTerminalProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async sendTerminalForceInstall(
    application: TerminalModel,
  ): Promise<void> {
    const payload: any = {
      application: {
        business: {
          id: application.business as any,
        },
        id: application.id,
      },
    };

    const eventCode: string = `builder-pos.force.install.application`;
    await this.triggerEvent(eventCode, payload);
  }

  private async triggerEvent(eventName: string, payload: any): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
    );
  }
}
