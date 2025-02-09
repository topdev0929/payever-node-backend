import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { CreateBlogDto, UpdateBlogDto, BlogWithAccessConfigResponseDto, UpdateAccessConfigDto } from '../dto';
import { BlogAccessConfigModel, BlogModel } from '../models';
import { BlogService, BlogAccessConfigService } from '../services';


@Controller('admin')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin')
export class AdminController extends AbstractController {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogAccessConfigService: BlogAccessConfigService,
  ) {
    super();
  }

  @Post('business/:businessId/blog')
  public async create(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogWithAccessConfigResponseDto> {
    const blog: BlogModel = await this.blogService.create(business, createBlogDto);

    return this.blogService.blogToBlogWithAccessConfigResponseDto(blog);
  }

  @Delete('business/:businessId/blog/:blogId')
  public async removeById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('blogId', BlogSchemaName) blog: BlogModel,
  ): Promise<void> {
    await this.blogService.removeInBusiness(business, blog);
  }

  @Get('business/:businessId/blog')
  public async findAllByBusiness(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<BlogWithAccessConfigResponseDto[]> {
    const blogs: BlogModel[] = await this.blogService.findAllByBusiness(business);

    return Promise.all(blogs.map((blog: BlogModel) => this.blogService.blogToBlogWithAccessConfigResponseDto(blog)));

  }


  @Patch('business/:businessId/blog/:blogId')
  public async updateBlogById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('blogId', BlogSchemaName) blog: BlogModel,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogModel> {

    return this.blogService.update(business, blog, updateBlogDto);
  }

  @Patch('blog/:blogId/config')
  public async updateAccessConfig(
    @ParamModel(':blogId', BlogSchemaName, true) blog: BlogModel,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<BlogAccessConfigModel> {

    return this.blogAccessConfigService.createOrUpdate(blog, dto);
  }

}
