import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApplicationThemePublishedDto, ApplicationTypesEnum } from '@pe/builder-theme-kit';
import { ConsumerService } from '@pe/builder-theme-kit/module/service';
import { OnPublishConsumerService } from '../services';


export function BuilderMessagesConsumerFactory(applicationType: ApplicationTypesEnum, channel: string): any {
  @Controller()
  class BuilderMessagesConsumer {
    constructor(
      private readonly onPublishConsumerService: OnPublishConsumerService,
      private readonly consumerService: ConsumerService,
    ) { }

    @MessagePattern({
      channel,
      name: `builder-${applicationType}.event.theme.published`,
    })
    public async onBuilderThemePublishConsumer(dto: ApplicationThemePublishedDto): Promise<void> {
      const promises: any[] = [];
      let data: any;

      const BTKITPromise: Promise<void> = this.consumerService.onBuilderThemePublished(dto);
      promises.push(BTKITPromise);

      const publishPromise: Promise<any> = this.onPublishConsumerService.publishData(
        dto.application.id,
        dto.version,
      );
      promises.push(publishPromise);

      await Promise.all(promises).then((values: any) => {
        data = values;
      });
    }
  }

  return BuilderMessagesConsumer;
}
