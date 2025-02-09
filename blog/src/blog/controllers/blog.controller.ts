import { Body, Controller, Delete, Get, Patch, Post, UseGuards, Query, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, ParamModel, User, UserTokenInterface } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { CreateBlogDto, UpdateBlogDto, IsValidNameDto, BlogWithAccessConfigResponseDto } from '../dto';
import { BlogModel, BlogAccessConfigModel } from '../models';
import { BlogService, BlogAccessConfigService } from '../services';
import { BlogEditVoter } from '../voters';
import { ValidateBlogNameResponseInterface } from '../interfaces';

@Controller('business/:businessId/blog')
@UseGuards(JwtAuthGuard)
@ApiTags('blog')
export class BlogController extends AbstractController {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogAccessConfigService: BlogAccessConfigService,
  ) {
    super();
  }

  @Post()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.create })
  public async create(
    @User() user: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogWithAccessConfigResponseDto> {
    await this.denyAccessUnlessGranted(BlogEditVoter.EDIT, business, user);

    const blog: BlogModel = await this.blogService.create(business, createBlogDto);

    return this.blogService.blogToBlogWithAccessConfigResponseDto(blog);
  }

  @Delete(':blogId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.delete })
  public async removeById(
    @User() user: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('blogId', BlogSchemaName) blog: BlogModel,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(BlogEditVoter.EDIT, business, user);
    await this.blogService.removeInBusiness(business, blog);
  }

  @Get()
  @Roles(RolesEnum.anonymous)
  public async findAllByBusiness(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<BlogWithAccessConfigResponseDto[]> {
    const blogs: BlogModel[] = await this.blogService.findAllByBusiness(business);

    return Promise.all(blogs.map((blog: BlogModel) => this.blogService.blogToBlogWithAccessConfigResponseDto(blog)));

  }

  @Get(':blogId')
  @Roles(RolesEnum.anonymous)
  public async findOneById(
    @User() user: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('blogId', BlogSchemaName) blog: BlogModel,
  ): Promise<BlogModel & { accessConfig: BlogAccessConfigModel} > {
    const accessConfig: BlogAccessConfigModel = await this.blogAccessConfigService.findByBlog(blog);

    return { ...blog.toObject(), accessConfig: accessConfig } as any;
  }

  @Patch(':blogId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.update })
  public async updateBlogById(
    @User() user: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('blogId', BlogSchemaName) blog: BlogModel,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogModel> {
    await this.denyAccessUnlessGranted(BlogEditVoter.EDIT, blog.business, user);

    return this.blogService.update(business, blog, updateBlogDto);
  }

  @Get('default')
  @Acl({ microservice: 'shop', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getDefaultShop(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<Pick<BlogModel, 'id'>> {
    const blog: BlogModel = await this.blogService.getDefault(business);

    return {
      id: blog?._id,
    };
  }

  @Patch(':id/default')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.update })
  public async makeBusinessBlogDefault(
    @User() user: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(':id', BlogSchemaName) blog: BlogModel,
  ): Promise<BlogModel & { accessConfig: BlogAccessConfigModel}> {
    await this.denyAccessUnlessGranted(BlogEditVoter.EDIT, blog.business, user);

    const accessConfig: BlogAccessConfigModel = await this.blogAccessConfigService.findByBlog(blog);

    const updatedBlog: BlogModel = await this.blogService.makeDefault(blog, business);

    return { ...updatedBlog.toObject(), accessConfig: accessConfig } as any;
  }

  @Get('isValidName')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'blog', action: AclActionsEnum.read })
  public async isValidName(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() isValidNameDto: IsValidNameDto,
  ): Promise<ValidateBlogNameResponseInterface> {
    return this.blogService.validateBlogName(isValidNameDto.name, business, null);
  }
}
