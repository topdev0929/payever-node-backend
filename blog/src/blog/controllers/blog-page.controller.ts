import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  ParamModel,
} from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { BlogPageDto } from '../dto';
import { BlogPageModel, BlogModel } from '../models';
import { BlogPageService } from '../services';

@Controller('business/:businessId/blog/:blogId/page')
@UseGuards(JwtAuthGuard)
@ApiTags('blog Page')
export class BlogPageController extends AbstractController {
  constructor(
    private readonly blogPageService: BlogPageService,
  ) {
    super();
  }

  @Post(':pageId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.create })
  public async create(
    @ParamModel('blogId', BlogSchemaName, true) blog: BlogModel,
    @Param('pageId') pageId: string,
    @Body() blogPageDto: BlogPageDto,
  ): Promise<BlogPageModel> {
    return this.blogPageService.createOrUpdate(blog, pageId, blogPageDto);
  }

  @Delete(':pageId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.delete })
  public async removeById(
    @ParamModel('blogId', BlogSchemaName, true) blog: BlogModel,
    @Param('pageId') pageId: string,
  ): Promise<void> {
    await this.blogPageService.remove(blog._id, pageId);
  }

  @Get()
  @Roles(RolesEnum.anonymous)
  public async findAllByBlog(
    @ParamModel('blogId', BlogSchemaName, true) blog: BlogModel,
  ): Promise<BlogPageModel[]> {
    return this.blogPageService.findByCondition({
      blog: blog._id,
    });
  }

  @Get(':pageId')
  @Roles(RolesEnum.anonymous)
  public async findOneById(
    @ParamModel('blogId', BlogSchemaName, true) blog: BlogModel,
    @Param('pageId') pageId: string,
  ): Promise<BlogPageModel> {
    return this.blogPageService.findOneByCondition({
      blog: blog._id,
      pageId,
    });
  }

  @Patch(':pageId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.update })
  public async updateBlogPageById(
    @ParamModel('blogId', BlogSchemaName, true) blog: BlogModel,
    @Param('pageId') pageId: string,
    @Body() blogPageDto: BlogPageDto,
  ): Promise<BlogPageModel> {
    return this.blogPageService.createOrUpdate(blog, pageId, blogPageDto);
  }
}
