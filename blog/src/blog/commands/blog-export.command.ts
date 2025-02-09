import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { BlogModel } from '../models';
import { BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { BlogRabbitEventsProducer } from '../producers';
import { DomainService } from '../services';

@Injectable()
export class BlogExportCommand {
  constructor(
    @InjectModel(BlogSchemaName) private readonly blogModel: Model<BlogModel>,
    private readonly blogRabbitEventsProducer: BlogRabbitEventsProducer,
    private readonly domainService: DomainService,
  ) { }

  @Command({ command: 'blog:export', describe: 'Export blogs through the bus' })
  public async blogExport(): Promise<void> {
    const count: number = await this.blogModel.countDocuments({ }).exec();
    const limit: number = 100;
    let start: number = 0;
    let blogs: BlogModel[] = [];

    while (start < count) {
      blogs = await this.getWithLimit(start, limit);
      start += limit;

      for (const blog of blogs) {
        const domain: string = await this.domainService.getDomain(blog);
        await this.blogRabbitEventsProducer.produceBlogExportEvent(blog, domain);
      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<BlogModel[]> {
    return this.blogModel.find(
      { },
      null,
      {
        limit: limit,
        skip: start,
        sort: { createdAt: 1 },
      },
    );
  }
}
