import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import { RabbitMessagesEnum } from '@pe/builder-kit/module/themes';
import { IntegrationRabbitMessagesEnum } from '@pe/builder-kit/module/integrations-v2/enums';
import { PageIntegrationCacheProducer } from '@pe/builder-kit/module/integrations-v2/producers';
import { PageUpdatedProducer } from '@pe/builder-kit/module/themes/producers';

@Injectable()
export class PageMessagesMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(`builder-shop.${RabbitMessagesEnum.PageUpdated}`)
  public async shopPageUpdatedMock(): Promise<void> {
    return this.mockPageUpdated();
  }

  @PactRabbitMqMessageProvider(`builder-site.${RabbitMessagesEnum.PageUpdated}`)
  public async sitePageUpdatedMock(): Promise<void> {
    return this.mockPageUpdated();
  }

  @PactRabbitMqMessageProvider(`builder-blog.${RabbitMessagesEnum.PageUpdated}`)
  public async blogPageUpdatedMock(): Promise<void> {
    return this.mockPageUpdated();
  }

  private async mockPageUpdated(): Promise<void> {
    const producer2: PageUpdatedProducer = await this.getProvider<PageUpdatedProducer>(
      PageUpdatedProducer,
    );

    const pageIds: string[] = [uuid.v4()];

    await producer2.pageUpdated(pageIds);
  }

  @PactRabbitMqMessageProvider(`builder-shop.${IntegrationRabbitMessagesEnum.PageIntegrationCache}`)
  public async shopPageIntegrationCacheMock(): Promise<void> {
    return this.mockPageIntegrationCache();
  }

  @PactRabbitMqMessageProvider(`builder-site.${IntegrationRabbitMessagesEnum.PageIntegrationCache}`)
  public async sitePageIntegrationCacheMock(): Promise<void> {
    return this.mockPageIntegrationCache();
  }

  @PactRabbitMqMessageProvider(`builder-blog.${IntegrationRabbitMessagesEnum.PageIntegrationCache}`)
  public async blogPageIntegrationCacheMock(): Promise<void> {
    return this.mockPageIntegrationCache();
  }

  private async mockPageIntegrationCache(): Promise<void> {
    const producer: PageIntegrationCacheProducer = await this.getProvider<PageIntegrationCacheProducer>(
      PageIntegrationCacheProducer,
    );

    await producer.invalidateCache({
      context: {
        ids: [uuid.v4()],
      },
    });
  }
}
