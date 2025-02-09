import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';

import { BusinessModel } from '../../business/models';
import { CommentSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { CreateCommentDto } from '../dto';
import { CommentEvent } from '../enums';
import { CommentInterface } from '../interfaces';
import { CommentModel } from '../models';
import { CommentRabbitEventsProducer } from '../producers';
import { BlogModel } from '../../blog/models';
import { BlogService } from '../../blog/services';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentSchemaName) private readonly commentModel: Model<CommentModel>,
    private readonly blogService: BlogService,
    private readonly commentEventsProducer: CommentRabbitEventsProducer,
    private readonly dispatcher: EventDispatcher,
  ) { }

  public async createComment(
    business: BusinessModel,
    blog: BlogModel,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentModel> {

    let comment: CommentModel = null;
    const createDto: CommentInterface = {
      ...createCommentDto,
      blog: blog,
      businessId: business._id,
    };

    comment = await this.commentModel.create(createDto as CommentModel);

    const commentsCount: number = await this.commentModel.count({ blog: comment.blog });

    await this.blogService.updateCommentsCount(business, blog, commentsCount);

    await this.dispatcher.dispatch(CommentEvent.CommentCreated, comment);

    await this.commentEventsProducer.commentCreated(business, blog, comment);

    return comment;
  }

  public async findAllByBlog(
    blog: BlogModel,
  ): Promise<CommentModel[]> {

    return this.commentModel.find({ blog: blog.id });
  }
}
