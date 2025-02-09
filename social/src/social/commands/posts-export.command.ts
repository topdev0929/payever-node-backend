import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { PostModel } from '../models';
import { InnerEventProducer } from '../producers';
import { PostSchemaName } from '../schemas';


@Injectable()
export class PostsExportCommand {
  constructor(
    @InjectModel(PostSchemaName) private readonly postModel: Model<PostModel>,
    private readonly postEventsProducer: InnerEventProducer,
  ) { }

  @Command({ command: 'post:export', describe: 'Export post through the bus' })
  public async postExport(): Promise<void> {
    const count: number = await this.postModel.countDocuments({ }).exec();
    const limit: number = 100;
    let start: number = 0;
    let posts: PostModel[] = [];

    while (start < count) {
      posts = await this.getWithLimit(start, limit);
      start += limit;

      for (const post of posts) {
        await this.postEventsProducer.triggerPostExportedAction(post);
      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<PostModel[]> {
    return this.postModel.find(
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
