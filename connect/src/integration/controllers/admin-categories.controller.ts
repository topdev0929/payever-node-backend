import {
  Controller,
  Get,
  Delete,
  Post,
  Patch,
  Query,
  Body,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel, JwtAuthGuard, RolesEnum, Roles } from '@pe/nest-kit';
import { CategoryService } from '../services';
import { AdminCategoryDto, CategoryQueryDto } from '../dto';
import { CategorySchemaName } from '../schemas';
import { CategoryModel } from '..';

const CATEGORY_ID: string = ':categoryId';

@Controller('admin/categories')
@ApiTags('admin categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AdminCategoriesController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getCategories(
    @Query() query: CategoryQueryDto,
  ): Promise<any> {
    return this.categoryService.getForAdmin(query);
  }

  @Get(CATEGORY_ID)
  @HttpCode(HttpStatus.OK)
  public async getCategoryById(
    @ParamModel(CATEGORY_ID, CategorySchemaName, true)
    category: CategoryModel,
  ): Promise<CategoryModel> {
    return category;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createCategory(
    @Body() categoryDto: AdminCategoryDto,
  ): Promise<CategoryModel> {
    return this.categoryService.createForAdmin(categoryDto);
  }

  @Patch(CATEGORY_ID)
  @HttpCode(HttpStatus.OK)
  public async updateCategory(
    @Body() categoryDto: AdminCategoryDto,
    @ParamModel(CATEGORY_ID, CategorySchemaName, true)
    category: CategoryModel,
  ): Promise<CategoryModel> {
    return this.categoryService.updateForAdmin(category._id, categoryDto);
  }

  @Delete(CATEGORY_ID)
  @HttpCode(HttpStatus.OK)
  public async deleteCategory(
    @ParamModel(CATEGORY_ID, CategorySchemaName, true)
    category: CategoryModel,
  ): Promise<void> {
    await this.categoryService.deleteForAdmin(category._id);
  }
}
