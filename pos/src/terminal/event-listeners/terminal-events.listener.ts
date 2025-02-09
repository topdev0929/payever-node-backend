import { Inject, Injectable } from '@nestjs/common';
import { CHANNEL_SET_SERVICE, ChannelSetServiceInterface } from '@pe/channels-sdk';
import { BusinessEventsEnum } from '@pe/business-kit';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { TerminalAccessConfigModel, TerminalModel } from '../models';
import { TerminalAccessConfigService, TerminalElasticService, TerminalService } from '../services';
import { TerminalEvent } from './terminal-events.enum';
import { TerminalRabbitEventsProducer } from '../producers/terminal-rabbit-events.producer';
import { CreateTerminalDto } from '../dto';
import { environment } from '../../environments';
import { EventEnum } from '@pe/builder-theme-kit';
import { ApplicationPagesService, CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { CompiledThemeModel } from '@pe/builder-theme-kit/module/interfaces/entities';

@Injectable()
export class TerminalEventsListener {
  constructor(
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
    private readonly terminalService: TerminalService,
    private readonly terminalAccessConfigService: TerminalAccessConfigService,
    private readonly terminalElasticService: TerminalElasticService,
    private readonly terminalEventsProducer: TerminalRabbitEventsProducer,
    private readonly applicationPagesService: ApplicationPagesService,
    private readonly compiledThemeService: CompiledThemeService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void> {
    const createdTerminal: TerminalModel = await this.terminalService.create(business, {
      logo: business.logo,
      name: business.name,
    } as CreateTerminalDto);

    const terminalAccessConfigModel: TerminalAccessConfigModel
      = await this.terminalAccessConfigService.findByTerminal(createdTerminal);
    const domain: string = `${terminalAccessConfigModel.internalDomain}.${environment.posDomain}`;
    await this.terminalEventsProducer.terminalCreated(business, createdTerminal, domain);
  }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async onBusinessRemoved(business: BusinessModel): Promise<void> {
    for (const terminal of business.terminals) {
      await this.terminalService.removeById(terminal.id);
    }
  }

  @EventListener(TerminalEvent.TerminalCreated)
  public async onTerminalCreated(terminal: TerminalModel): Promise<void> {
    await this.terminalElasticService.saveIndex(terminal);
  }

  @EventListener(TerminalEvent.TerminalUpdated)
  public async onTerminalUpdated(_originalTerminal: TerminalModel, updatedTerminal: TerminalModel): Promise<void> {
    await this.terminalElasticService.saveIndex(updatedTerminal);
  }

  @EventListener(TerminalEvent.TerminalRemoved)
  public async onTerminalRemoved(terminal: TerminalModel, deleteTestData: boolean = false): Promise<void> {
    if (terminal.channelSet && !deleteTestData) {
      await this.channelSetService.deleteOneById(terminal.channelSet.id);
    }

    const compiledTheme: CompiledThemeModel = await this.compiledThemeService.findByApplicationId(terminal._id);
    await this.applicationPagesService.removeByCompiledTheme(compiledTheme);
    await this.compiledThemeService.removeByApplicationId(terminal._id);

    await this.terminalElasticService.deleteIndex(terminal);
  }

  @EventListener(TerminalEvent.DomainUpdated)
  public async onTerminalDomainUpdated(terminalId: string, domain: string): Promise<void> {
    await this.terminalEventsProducer.terminalDomainChanged(terminalId, domain);
  }

  @EventListener(EventEnum.GetPageNotFound)
  public async notFound(terminalId: string): Promise<void> {
    await this.terminalService.resetForceInstallById(terminalId);
  }
}
