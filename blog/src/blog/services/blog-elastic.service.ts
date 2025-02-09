import { Injectable } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticBlogEnum } from '../enums';
import { BlogModel } from '../models';
import { BlogRabbitEventsProducer } from '../producers';

@Injectable()
export class BlogElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly blogRabbitEventsProducer: BlogRabbitEventsProducer,
  ) { }

  public async saveIndex(blog: BlogModel): Promise<void> {
    try {
      await this.elasticSearchClient.singleIndex(
        ElasticBlogEnum.index,
        {
          ...blog.toObject(),
        },
      );
    } catch (e) {
      await this.blogRabbitEventsProducer.elasticSingleIndex(
        {
          ...blog.toObject(),
        },
      );
    }
  }

  public async deleteIndex(blog: BlogModel): Promise<void> {
    try {
      await this.elasticSearchClient.deleteByQuery(
        ElasticBlogEnum.index,
        {
          query: {
            match_phrase: {
              mongoId: blog._id,
            },
          },
        },
      );
    } catch (e) {
      await this.blogRabbitEventsProducer.elasticDeleteByQuery(
        {
          query: {
            match_phrase: {
              mongoId: blog._id,
            },
          },
        },
      );
    }
  }

  public async saveIndexRBMQ(data: any): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticBlogEnum.index,
      data,
    );
  }

  public async deleteIndexRBMQ(query: any): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticBlogEnum.index,
      query,
    );
  }
}
