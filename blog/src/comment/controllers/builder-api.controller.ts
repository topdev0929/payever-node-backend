import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, User, UserTokenInterface } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessService, BusinessModel } from '@pe/business-kit';

import { GetCommentsDto, BuilderCreateCommentDto } from '../dto';
import { CommentModel } from '../models';
import { BlogModel } from '../../blog/models';
import { CommentService } from '../services';
import { BlogService } from '../../blog';

@Controller('business/blog/comments')
@UseGuards(JwtAuthGuard)
@ApiTags('comment')
export class BuilderApiController {
  constructor(
    private readonly commentService: CommentService,
    private readonly blogService: BlogService,
    private readonly businessService: BusinessService,
  ) { }

  @Post('create-comment')
  @Roles(RolesEnum.user)
  @Acl({ microservice: 'blog', action: AclActionsEnum.create })
  public async postComment(
    @User() user: UserTokenInterface,
    @Body() createCommentDto: BuilderCreateCommentDto,
  ): Promise<CommentModel> {
    createCommentDto.author = user.id;

    const blog: BlogModel = await this.blogService.findOneById(createCommentDto.blogId);
    const business: BusinessModel = await this.businessService.findOneById(createCommentDto.businessId);

    delete createCommentDto.blogId;
    delete createCommentDto.businessId;
    
    return this.commentService.createComment(business as any, blog, createCommentDto);
  }

  @Post('get-comments')
  @Roles(RolesEnum.anonymous)
  public async getAllByBlog(
    @Body() getCommentsDto: GetCommentsDto,
  ): Promise<CommentModel[]> {
    const blog: BlogModel = await this.blogService.findOneById(getCommentsDto.blogId);

    return this.commentService.findAllByBlog(blog);
  }
}
