import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, User, UserTokenInterface } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../../business/models';
import { IntegrationForBuilderParamsDto } from '../dto';
import { BlogModel, BlogPageModel } from '../../blog/models';
import { CommentModel, CommentService, CreateCommentDto } from '../../comment';
import { BlogPageDto, BlogPageService, BlogService } from '../../blog';
import { BusinessService } from '../../business/services/business.service';

@Controller('integration/builder')
@UseGuards(JwtAuthGuard)
@ApiTags('integration')
export class IntegrationController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly commentService: CommentService,
    private readonly blogService: BlogService,
    private readonly blogPageService: BlogPageService,
  ) { }

  @Post(`blogCreateComment`)
  @Roles(RolesEnum.user)
  @Acl({ microservice: 'blog', action: AclActionsEnum.create })
  public async postComment(
    @User() user: UserTokenInterface,
    @Body() dto: IntegrationForBuilderParamsDto,
  ): Promise<CommentModel> {
    const business: BusinessModel = await this.businessService.getById(dto.businessId);
    const blog: BlogModel = await this.blogService.findOneById(dto.contextId);
    const createCommentDto: CreateCommentDto = {
      author: user.id,
      content: dto.data.content,
    };

    return this.commentService.createComment(business, blog, createCommentDto);
  }

  @Post(`blogGetComments`)
  @Roles(RolesEnum.anonymous)
  public async getAllByBlog(
    @Body() dto: IntegrationForBuilderParamsDto,
  ): Promise<CommentModel[]> {
    const blog: BlogModel = await this.blogService.findOneById(dto.contextId);

    return this.commentService.findAllByBlog(blog);
  }

  @Post('blogSavePage')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.create })
  public async create(
    @Body() dto: IntegrationForBuilderParamsDto,
  ): Promise<BlogPageModel> {
    const blog: BlogModel = await this.blogService.findOneById(dto.contextId);
    const blogPageDto: BlogPageDto = {
      author: dto.data.author,
      blog: dto.data.blog,
      body: dto.data.body,
      caption: dto.data.caption,
      date: dto.data.date,
      description: dto.data.description,
      image: dto.data.image,
      pageId: dto.data.pageId,
      subtitle: dto.data.subtitle,
      title: dto.data.title,
    };

    return this.blogPageService.createOrUpdate(blog, dto.data.pageId, blogPageDto);
  }

  @Post('blogGetPage')
  @Roles(RolesEnum.anonymous)
  public async findOneById(
    @Body() dto: IntegrationForBuilderParamsDto,
  ): Promise<BlogPageModel> {
    return this.blogPageService.findOneByCondition({
      blog: dto.contextId,
      pageId: dto.data.pageId,
    });
  }

  @Post('blogGetPages')
  @Roles(RolesEnum.anonymous)
  public async findAllByBlog(
    @Body() dto: IntegrationForBuilderParamsDto,
  ): Promise<BlogPageModel[]> {
    return this.blogPageService.findByCondition({
      blog: dto.contextId,
    });
  }

  @Post('blogDeletePage')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.delete })
  public async removeById(
    @Body() dto: IntegrationForBuilderParamsDto,
  ): Promise<void> {
    await this.blogPageService.remove(dto.contextId, dto.data.pageId);
  }
}
