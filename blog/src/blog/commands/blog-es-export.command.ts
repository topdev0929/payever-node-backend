import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDefinition, Model } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticBlogEnum } from '../enums';
import { BlogModel } from '../models';
import { BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';

@Injectable()
export class BlogEsExportCommand {
  constructor(
    @InjectModel(BlogSchemaName) private readonly blogModel: Model<BlogModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity array-type */
  @Command({ command: 'blog:es:export', describe: 'Export blogs for ElasticSearch' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedBlogsCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const blogs: BlogModel[] =
        await this.blogModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip);

      if (!blogs.length) {
        break;
      }

      const batch: Array<DocumentDefinition<BlogModel>> = [];
      for (const blog of blogs) {
        batch.push({
          ...blog.toObject(),
        });
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticBlogEnum.index,
        batch,
      );

      processedBlogsCount += blogs.length;
      page++;
    }

    this.logger.log(processedBlogsCount + ' blogs was processed');
  }
}
