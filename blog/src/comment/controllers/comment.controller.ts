import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelEventMessagesProducer } from '@pe/channels-sdk';
import { Acl, AclActionsEnum, ParamModel, RabbitMqClient, User, UserTokenInterface } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { CreateCommentDto } from '../dto';
import { CommentModel } from '../models';
import { BlogModel, BlogAccessConfigModel } from '../../blog/models';
import { CommentService } from '../services';

@Controller('business/:businessId/blog/:blogId/comments')
@UseGuards(JwtAuthGuard)
@ApiTags('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) { }

  @Post()
  @Roles(RolesEnum.user)
  @Acl({ microservice: 'blog', action: AclActionsEnum.create })
  public async postComment(
    @User() user: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('blogId', BlogSchemaName) blog: BlogModel,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentModel> {
    createCommentDto.author = user.id;
    
    return this.commentService.createComment(business, blog, createCommentDto);
  }

  @Get()
  @Roles(RolesEnum.anonymous)
  public async getAllByBlog(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('blogId', BlogSchemaName) blog: BlogModel,
  ): Promise<CommentModel[]> {
    return this.commentService.findAllByBlog(blog);
  }
}
