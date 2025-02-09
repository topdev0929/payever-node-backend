import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import { CompiledThemeMessagesProducer } from '@pe/builder-kit/module/application-theme/producers';
import { ApplicationThemeModel, CompiledThemeModel } from '@pe/builder-kit/module/application-theme/interfaces';
import { RabbitMessagesEnum, ThemeVersionModel } from '@pe/builder-kit/module/themes';

@Injectable()
export class BuilderPublishMessagesMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(`builder-shop.${RabbitMessagesEnum.EventThemePublish}`)
  public async shopEventThemePublishMock(): Promise<void> {
    return this.mockProduceEventThemePublish();
  }

  @PactRabbitMqMessageProvider(`builder-site.${RabbitMessagesEnum.EventThemePublish}`)
  public async siteEventThemePublishMock(): Promise<void> {
    return this.mockProduceEventThemePublish();
  }

  @PactRabbitMqMessageProvider(`builder-blog.${RabbitMessagesEnum.EventThemePublish}`)
  public async blogEventThemePublishMock(): Promise<void> {
    return this.mockProduceEventThemePublish();
  }

  @PactRabbitMqMessageProvider(`builder-shop.${RabbitMessagesEnum.EventApplicationThemeCacheToDelete}`)
  public async shopCacheToDeleteMock(): Promise<void> {
    return this.mockCacheToDelete();
  }

  @PactRabbitMqMessageProvider(`builder-site.${RabbitMessagesEnum.EventApplicationThemeCacheToDelete}`)
  public async siteCacheToDeleteMock(): Promise<void> {
    return this.mockCacheToDelete();
  }

  @PactRabbitMqMessageProvider(`builder-blog.${RabbitMessagesEnum.EventApplicationThemeCacheToDelete}`)
  public async blogCacheToDeleteMock(): Promise<void> {
    return this.mockCacheToDelete();
  }

  private async mockProduceEventThemePublish(): Promise<void> {
    const producer: CompiledThemeMessagesProducer = await this.getProvider<CompiledThemeMessagesProducer>(
      CompiledThemeMessagesProducer,
    );

    const appTheme: ApplicationThemeModel = {
      id: uuid.v4(),
      theme: {
        id: uuid.v4(),
      },
    } as any;
    const compiledTheme: CompiledThemeModel = {
      application: uuid.v4(),
      context: { },
      data: { },
      id: uuid.v4(),
      routing: { },
      themeSource: uuid.v4(),
    } as any;
    const version: ThemeVersionModel = {
      id: uuid.v4(),
      name: `name`,
      versionNumber: 1,
    } as any;

    await producer.sendThemePublished(appTheme, compiledTheme, version);
  }

  private async mockCacheToDelete(): Promise<void> {
    const producer: CompiledThemeMessagesProducer = await this.getProvider<CompiledThemeMessagesProducer>(
      CompiledThemeMessagesProducer,
    );

    const themeIds: string[] = [uuid.v4()];

    await producer.cacheToDelete(themeIds);
  }
}
