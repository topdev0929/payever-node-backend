import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';
import { RabbitBinding } from '../../../environments';
import { MailModel } from '../models';
import { CreateApplicationDto, RemoveApplicationDto } from '../dto';

@Injectable()
export class MailRabbitEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async publishMailData(
    domainNames: string[],
    accessConfig: any,
    theme: CompiledThemeWithPagesInterface,
    wsKey: string,
    themeId: string,
  ): Promise<void> {

    this.sendMessage(
      'mail.event.theme.published',
      {
        builderThemeId: themeId,
        domains: domainNames,
        mail: accessConfig,
        theme: theme,
        version: accessConfig.accessConfig.version,
        wsKey: wsKey,
      },
    ).catch();
  }

  public async processScheduleByTheme(
    themeId: string,
  ): Promise<void> {
    this.sendMessage(
      RabbitBinding.ProcessScheduleTheme,
      {
        themeId: themeId,
      },
    ).catch();
  }

  public async mailCreated(
    mail: MailModel,
  ): Promise<void> {
    const dto: CreateApplicationDto = {
      business: {
        id: mail.businessId,
      },
      id: mail.id,
      name: mail.name,
      type: 'mail',
    };
    this.sendMessage('mail.event.mail.created', dto).catch();
  }

  // tslint:disable-next-line:no-identical-functions
  public async mailExport(
    mail: MailModel,
  ): Promise<void> {
    const dto: CreateApplicationDto = {
      business: {
        id: mail.businessId,
      },
      id: mail.id,
      name: mail.name,
      type: 'mail',
    };
    this.sendMessage('mail.event.mail.export', dto).catch();
  }

  public async mailRemoved(
    dto: RemoveApplicationDto,
  ): Promise<void> {
    this.sendMessage('mail.event.mail.removed', dto).catch();
  }

  private async sendMessage(channel: string, payload: any): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: channel,
        exchange: 'async_events',
      },
      {
        name: channel,
        payload: payload,
      },
    );
  }

}
