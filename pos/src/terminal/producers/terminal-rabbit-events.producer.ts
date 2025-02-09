import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { TerminalModel } from '../models';
import { TerminalEventPayloadDto } from '../dto';
import { TerminalRabbitEventNamesEnum } from '../enums';
import { ApplicationThemeDto, CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';

@Injectable()
export class TerminalRabbitEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async publishPosData(
    domainNames: string[],
    accessConfig: any,
    theme: CompiledThemeWithPagesInterface,
    wsKey: string,
    applicationTheme: ApplicationThemeDto,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: 'pos.event.theme.published',
        exchange: 'async_events',
      },
      {
        name: 'pos.event.theme.published',
        payload: {
          applicationTheme: applicationTheme,
          domains: domainNames,
          pos: accessConfig,
          theme: theme,
          version: accessConfig.accessConfig.version,
          wsKey: wsKey,
        },
      },
    );
  }

  public async terminalCreated(
    business: BusinessModel,
    terminal: TerminalModel,
    domain: string,
  ): Promise<void> {
    this.logger.log({
      message: `RabbitmqService terminalCreated`,

      business: business.id,
      channelSet: terminal.channelSet,
      terminal: terminal.id,
    });

    await this.rabbitClient.send(
      {
        channel: TerminalRabbitEventNamesEnum.terminalCreated,
        exchange: 'async_events',
      },
      {
        name: TerminalRabbitEventNamesEnum.terminalCreated,
        payload: await TerminalRabbitEventsProducer.prepareTerminalEventPayload(terminal, domain),
      },
    );
  }

  public async terminalUpdated(business: BusinessModel, terminal: TerminalModel): Promise<void> {
    this.logger.log({
      message: `RabbitmqService terminalUpdated`,

      business: business.id,
      channelSet: terminal.channelSet,
      terminal: terminal.id,
    });

    await this.rabbitClient.send(
      {
        channel: TerminalRabbitEventNamesEnum.terminalUpdated,
        exchange: 'async_events',
      },
      {
        name: TerminalRabbitEventNamesEnum.terminalUpdated,
        payload: await TerminalRabbitEventsProducer.prepareTerminalEventPayload(terminal),
      },
    );
  }

  public async terminalRemoved(business: BusinessModel, terminal: TerminalModel): Promise<void> {
    this.logger.log({
      message: `RabbitmqService terminalRemoved`,

      business: business?.id,
      channelSet: terminal.channelSet,
      terminal: terminal.id,
    });

    await this.rabbitClient.send(
      {
        channel: TerminalRabbitEventNamesEnum.terminalRemoved,
        exchange: 'async_events',
      },
      {
        name: TerminalRabbitEventNamesEnum.terminalRemoved,
        payload: {
          id: terminal.id,

          appType: 'pos',
          business: {
            id: business?.id,
          },
        },
      },
    );
  }

  public async exportTerminal(terminal: TerminalModel, domain: string): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: TerminalRabbitEventNamesEnum.terminalExport,
        exchange: 'async_events',
      },
      {
        name: TerminalRabbitEventNamesEnum.terminalExport,
        payload: await TerminalRabbitEventsProducer.prepareTerminalEventPayload(terminal, domain),
      },
    );
  }

  public async setDefaultTerminalEvent(business: BusinessModel, terminal: TerminalModel): Promise<void> {
    this.logger.log({
      message: `RabbitmqService setDefaultTerminal`,

      business: business.id,
      channelSet: terminal.channelSet,
      terminal: terminal.id,
    });

    await this.rabbitClient.send(
      {
        channel: TerminalRabbitEventNamesEnum.setDefaultTerminal,
        exchange: 'async_events',
      },
      {
        name: TerminalRabbitEventNamesEnum.setDefaultTerminal,
        payload: {
          businessId: business.id,
          channelSetId: terminal.channelSet,
          terminalId: terminal.id,
        },
      },
    );
  }

  public async exportToProduct(terminal: TerminalModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: TerminalRabbitEventNamesEnum.exportTerminalChannelSet,
        exchange: 'async_events',
      },
      {
        name: TerminalRabbitEventNamesEnum.exportTerminalChannelSet,
        payload: {
          id: terminal.channelSet,

          businessId: terminal.business,
          name: terminal.name,
          type: 'pos',
        },
      },
    );
  }

  public async requestDefaultThemeEvent(terminal: TerminalModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: TerminalRabbitEventNamesEnum.terminalDefaultThemeRequested,
        exchange: 'async_events',
      },
      {
        name: TerminalRabbitEventNamesEnum.terminalDefaultThemeRequested,
        payload: {
          business: {
            id: terminal.business ? terminal.business.id : null,
          },
          terminal: {
            id: terminal.id,
          },
        },
      },
    );
  }

  private static async prepareTerminalEventPayload(
    terminal: TerminalModel,
    domain?: string,
  ): Promise<TerminalEventPayloadDto> {
    await terminal
      .populate('channelSets')
      .populate('business')
      .execPopulate();

    return {
      id: terminal.id,
      logo: terminal.logo,
      name: terminal.name,

      active: terminal.active,
      default: terminal.default,
      domain,

      appType: 'pos',
      business: {
        id: terminal.business?.id,
      },
      channelSet: {
        id: terminal.channelSet?.id,
      },
    };
  }

  public async terminalDomainChanged(
    id: string,
    newDomain: string,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: TerminalRabbitEventNamesEnum.domainUpdated,
        exchange: 'async_events',
      },
      {
        name: TerminalRabbitEventNamesEnum.domainUpdated,
        payload: {
          id,
          newDomain,
        },
      },
    );
  }
}
