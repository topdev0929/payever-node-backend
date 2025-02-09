import { Injectable } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { BlogService } from '../services';
import { BlogModel } from '../models';
import { BusinessModel } from '../../business/models';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { Model } from 'mongoose';

@Injectable()
export class DeleteInactiveBlogCommand {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly blogService: BlogService,
  ) { }

  @Command({
    command: 'delete:inactive:blog',
    describe: 'delete inactive blog',
  })
  public async deleteInactiveBlog(
    @Positional({
      name: 'businessId',
    }) businessId: string,
    @Positional({
      name: 'blogId',
    }) blogId: string,
  ): Promise<void> {
    if (businessId) {
      const blogs: BlogModel[] = await this.blogService.findInactiveByBusinessId(businessId);
      for (const blog of blogs) {
        await this.deleteBlog(blog);
      }
    } else if (blogId) {
      const blog: BlogModel = await this.blogService.findOneById(blogId);
      await blog.populate('business').execPopulate();
      await this.deleteBlog(blog);
    } else {
      while (true) {
        const blogs: BlogModel[] = await this.blogService.findInactive();
        if (blogs.length === 0) {
          break;
        }

        for (const blog of blogs) {
          await this.deleteBlog(blog);
        }
      }
    }
  }

  private async deleteBlog(blog: BlogModel): Promise<void> {
    await this.blogService.removeInBusinessId(blog.business as any, blog, true);
  }
}
