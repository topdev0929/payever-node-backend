import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BlogPageModel, BlogModel } from '../models';
import { BlogPageSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { BlogPageDto } from '../dto';
import { BlogRabbitEventsProducer } from '../producers';

@Injectable()
export class BlogPageService {
  constructor(
    @InjectModel(BlogPageSchemaName)
      private readonly blogPageModel: Model<BlogPageModel>,
    private readonly blogRabbitEventsProducer: BlogRabbitEventsProducer,
  ) { }

  public async createOrUpdate(
    blog: BlogModel,
    pageId: string,
    dto: BlogPageDto,
  ): Promise<BlogPageModel> {
    const currentPage: BlogPageModel = await this.findOneByCondition({
      blog: blog._id,
      pageId,
    });

    return !currentPage
      ? this.create(blog, pageId, dto)
      : this.update(currentPage, pageId, dto);
  }

  public async create(
    blog: BlogModel,
    pageId: string,
    dto: BlogPageDto,
  ): Promise<BlogPageModel> {
    const result: BlogPageModel = await this.blogPageModel.create({
      ...dto,
      blog: blog._id,
      pageId,
    } as BlogPageModel);
    await this.blogRabbitEventsProducer.blogPageCreated(result);

    return result;
  }

  public async update(
    blogPage: BlogPageModel,
    pageId: string,
    dto: BlogPageDto,
  ): Promise<BlogPageModel> {
    const result: BlogPageModel = await this.blogPageModel.findOneAndUpdate(
      { _id: blogPage.id },
      { $set: { ...dto, pageId }},
      { new: true },
    );
    await this.blogRabbitEventsProducer.BlogPageUpdated(result);

    return result;
  }

  public async findOneByCondition(
    condition: FilterQuery<BlogPageModel>,
  ): Promise<BlogPageModel> {
    return this.blogPageModel.findOne(condition);
  }

  public async findByCondition(
    condition: FilterQuery<BlogPageModel>,
  ): Promise<BlogPageModel[]> {
    return this.blogPageModel.find(condition);
  }

  public async remove(
    blogId: string,
    pageId: string,
  ): Promise<void> {
    await this.blogPageModel.findOneAndRemove({
      blog: blogId,
      pageId,
    });
    await this.blogRabbitEventsProducer.BlogPageRemoved(blogId, pageId);
  }
}
