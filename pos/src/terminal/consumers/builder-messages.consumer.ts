import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApplicationThemePublishedDto, CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';
import { OnPublishConsumerService, TerminalService } from '../services';
import { CompiledThemeService, ConsumerService } from '@pe/builder-theme-kit/module/service';
import { TerminalRabbitEventsProducer } from '../producers';
import { TerminalModel } from '../models';

@Controller()
export class BuilderMessagesConsumer {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly onPublishConsumerService: OnPublishConsumerService,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly terminalService: TerminalService,
    private readonly logger: Logger,
    private readonly terminalRabbitEventsProducer: TerminalRabbitEventsProducer,
  ) { }

  @MessagePattern({
    name: 'builder-pos.event.theme.published',
  })
  public async onBuilderThemePublishConsumer(dto: ApplicationThemePublishedDto): Promise<void> {
    try {
      let terminal: TerminalModel | null = null;
      if (dto.application.id) {
        terminal = await this.terminalService.findOneById(dto.application.id);
      }
      
      if (!terminal) {
        this.logger.warn({
          data: dto,
          event: 'builder-pos.event.theme.published',
          message: 'Terminal not found',
        });

        return;
      }

      const wsKey: string = dto.wsKey ? dto.wsKey : `publish:${dto.theme.id}-${dto.version}`;

      const process: any[] = [];
      let data: any;
      const on: any = this.consumerService.onBuilderThemePublished(dto);
      process.push(on);

      const dataPromise: any = this.onPublishConsumerService.publishPosData(
        dto.application.id,
        dto.versionDiff.pageIds,
        dto.version,
      );
      process.push(dataPromise);

      await Promise.all(process).then((values: any) => {
        data = values;
      });

      const theme: CompiledThemeWithPagesInterface = await this.compiledThemeService.getCompiledTheme(
        dto.application.id,
        dto.versionDiff.pageIds,
      );

      await this.terminalRabbitEventsProducer.publishPosData(
        data[1].domainNames,
        data[1].accessConfig,
        theme,
        wsKey,
        dto.applicationTheme,
      );
    } catch (err) {
      this.logger.warn({
        data: dto,
        event: 'builder-pos.event.theme.published',
        message: 'Error while publishing theme!',
      });
    }
  } 
}
