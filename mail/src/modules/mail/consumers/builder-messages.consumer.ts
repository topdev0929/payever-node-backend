import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApplicationThemePublishedDto, CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';
import { MailService, OnPublishConsumerService } from '../services';
import { CompiledThemeService, ConsumerService } from '@pe/builder-theme-kit/module/service';
import { MailRabbitEventsProducer } from '../producers';
import { MailModel } from '../models';

@Controller()
export class BuilderMessagesConsumer {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly onPublishConsumerService: OnPublishConsumerService,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly mailService: MailService,
    private readonly logger: Logger,
    private readonly mailRabbitEventsProducer: MailRabbitEventsProducer,
  ) { }

  @MessagePattern({
    name: 'builder-mail.event.theme.published',
  })
  public async onBuilderThemePublishConsumer(dto: ApplicationThemePublishedDto): Promise<void> {
    const mail: MailModel = await this.mailService.findOneById(dto.application.id);
    if (!mail) {
      this.logger.warn({
        data: dto,
        event: 'builder-mail.event.theme.published',
        message: 'Mail not found',
      });

      return;
    }

    const wsKey: string = dto.wsKey ? dto.wsKey : `publish:${dto.theme.id}-${dto.version}`;

    const process: any[] = [];
    let data: any;
    const on: any = this.consumerService.onBuilderThemePublished(dto);
    process.push(on);

    const dataPromise: any = this.onPublishConsumerService.publishMailData(
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

    await this.mailRabbitEventsProducer.publishMailData(
      data[1].domainNames,
      data[1].accessConfig,
      theme,
      wsKey,
      dto.theme.id,
    );
  }
}

