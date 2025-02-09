import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApplicationThemePublishedDto, CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';
import { CompiledThemeService, ConsumerService } from '@pe/builder-theme-kit/module/service';
import { BlogService, CommonService, OnPublishConsumerService } from '../services';
import { BlogRabbitEventsProducer } from '../producers';
import { LogHelper } from '../../common';
import { LinksMaskingIngressDto } from '../dto';

@Controller()
export class BuilderMessagesConsumer {
  constructor(
    private readonly onPublishConsumerService: OnPublishConsumerService,
    private readonly consumerService: ConsumerService,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly blogMessagesProducer: BlogRabbitEventsProducer,
    private readonly blogService: BlogService,
    private readonly commonService: CommonService,
  ) { }

  @MessagePattern({
    name: 'builder-blog.links.masking.ingress',
  })
  public async onLinksMaskingIngress(dto: LinksMaskingIngressDto): Promise<void> {
    await this.blogService.linksMaskingIngress(dto);
  }

  @MessagePattern({
    name: 'builder-blog.event.theme.published',
  })
  public async onBuilderThemePublishConsumer(dto: ApplicationThemePublishedDto): Promise<void> {
    LogHelper.timeLog('onBuilderThemePublishConsumer');
    let startTime: any;
    let endTime: any;

    const wsKey: string = dto.wsKey ? dto.wsKey : `publish:${dto.theme.id}-${dto.version}`;
    const process: any[] = [];
    let data: any;

    const on: any = this.consumerService.onBuilderThemePublished(dto);
    process.push(on);
    const dataPromise: any =
    this.onPublishConsumerService.publishBlogData(dto.application.id, dto.version, wsKey);
    process.push(dataPromise);

    await Promise.all(process).then((values: any) => {
      data = values;
    });

    startTime = new Date();
    const theme: CompiledThemeWithPagesInterface = await this.compiledThemeService.getCompiledTheme(
      dto.application.id,
    );
    endTime = new Date();
    LogHelper.log('onBuilderThemePublishConsumer getCompiled', `${endTime - startTime}`);

    startTime = new Date();
    await this.blogMessagesProducer.publishBlogData(
      data[1].domainNames,
      data[1].accessConfig,
      theme,
      wsKey,
      dto.applicationTheme,
    );
    endTime = new Date();
    LogHelper.log('onBuilderThemePublishConsumer produce message n done', `${endTime - startTime}`);

    await this.commonService.refreshThemeCache(dto.application.id);
  }
}

