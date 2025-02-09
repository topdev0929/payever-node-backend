import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { BlogRabbitEnum } from '../enums';
import { BusinessModel } from '../../business/models';
import { BlogModel, BlogPageModel } from '../models';
import { BlogWithAccessConfigResponseDto } from '../dto/domain-response.dto';
import { ApplicationThemeDto, CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
@Injectable()
export class BlogRabbitEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
    private readonly compiledThemeService: CompiledThemeService,
  ) { }


  public async publishBlogData(
    domainNames: string[],
    accessConfig: BlogWithAccessConfigResponseDto,
    theme: CompiledThemeWithPagesInterface,
    wsKey: string,
    applicationTheme: ApplicationThemeDto,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: 'blog.event.theme.published',
        exchange: 'async_events',
      },
      {
        name: 'blog.event.theme.published',
        payload: {
          applicationTheme: applicationTheme,
          domains: domainNames,
          shop: accessConfig,
          theme: theme,
          wsKey: wsKey,
        },
      },
    );
  }

  public async blogCreated(business: BusinessModel, blog: BlogModel): Promise<void> {
    this.logger.log({
      blog: blog.id,
      business: business.id,
      channelSet: blog.channelSet,
      message: `RabbitmqService blogCreated`,
    });

    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.BlogCreated,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.BlogCreated,
        payload: {
          appType: 'blog',
          business: {
            id: business.id,
          },
          channelSet: {
            id: blog.channelSet.id,
          },
          id: blog.id,
          name: blog.name,
          picture: blog.picture,
          type: 'blog',
        },
      },
    );
  }

  public async blogUpdated(business: BusinessModel, blog: BlogModel): Promise<void> {
    this.logger.log({
      blog: blog.id,
      business: business.id,
      channelSet: blog.channelSet,
      message: `RabbitmqService blogUpdated`,
    });

    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.BlogUpdated,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.BlogUpdated,
        payload: {
          appType: 'blog',
          business: {
            id: blog.business.id,
          },
          channelSet: {
            id: blog.channelSet.id,
          },
          id: blog.id,
          name: blog.name,
          picture: blog.picture,
          type: 'blog',
        },
      },
    );
  }

  public async blogRemoved(businessId: string, blog: BlogModel): Promise<void> {
    this.logger.log({
      blog: blog.id,
      business: businessId,
      channelSet: blog.channelSet,
      message: `RabbitmqService blogRemoved`,
    });

    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.BlogRemoved,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.BlogRemoved,
        payload: {
          id: blog.id,

          appType: 'blog',
          business: {
            id: businessId,
          },
          type: 'blog',
        },
      },
    );
  }

  public async produceBlogExportEvent(blog: BlogModel, domain: string): Promise<void> {

    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.BlogExported,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.BlogExported,
        payload: {
          appType: 'blog',
          business: {
            id: blog.business?.id ? blog.business.id : blog.business,
          },
          domain,
          id: blog.id,
          name: blog.name,
          picture: blog.picture,
          type: 'blog',
        },
      },
    );
  }

  public async elasticSingleIndex(
    data: any,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.ElasticSingleIndex,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.ElasticSingleIndex,
        payload: {
          data,
        },
      },
    );
  }

  public async elasticDeleteByQuery(
    query: any,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.ElasticDeleteByQuery,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.ElasticDeleteByQuery,
        payload: {
          query,
        },
      },
    );
  }

  public async blogPageCreated(
    blogPage: BlogPageModel,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.BlogPageCreated,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.BlogPageCreated,
        payload: {
          blogId: blogPage.blog as string,
          blogPage: blogPage.toObject(),
        },
      },
    );
  }
  public async BlogPageUpdated(
    blogPage: BlogPageModel,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.BlogPageUpdated,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.BlogPageUpdated,
        payload: {
          blogId: blogPage.blog as string,
          blogPage: blogPage.toObject(),
        },
      },
    );
  }
  public async BlogPageRemoved(
    blogId: string,
    blogPageId: string,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: BlogRabbitEnum.BlogPageRemoved,
        exchange: 'async_events',
      },
      {
        name: BlogRabbitEnum.BlogPageRemoved,
        payload: {
          blogId,
          blogPage: {
            _id: blogPageId,
          },
        },
      },
    );
  }
}
