import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards, 
  Query,
  HttpCode, 
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { SampleProductsModel } from '../models';
import { SampleProductQueryDto, CreateSampleProductDto, UpdateSampleProductDto } from '../dto';
import { SampleProductSchemaName } from '../schemas';
import { SampleProductsService } from '../services';

const SAMPLE_PRODUCT_ID: string = ':sampleProductId';

@Controller('admin/sample-products')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin sample-products')
export class AdminSampleProductsController {
  constructor(
    private readonly sampleProductsService: SampleProductsService,
  ) { }

  @Get()
  public async getAll(
    @Query() query: SampleProductQueryDto,
  ): Promise<any> {
    return this.sampleProductsService.getForAdmin(query);
  }

  @Get(SAMPLE_PRODUCT_ID)
  public async getById(
    @ParamModel(SAMPLE_PRODUCT_ID, SampleProductSchemaName, true) sampleProduct: SampleProductsModel,    
  ): Promise<SampleProductsModel> {
    return sampleProduct;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() dto: CreateSampleProductDto,
  ): Promise<SampleProductsModel> {
    return this.sampleProductsService.create(dto);
  }

  @Patch(SAMPLE_PRODUCT_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(SAMPLE_PRODUCT_ID, SampleProductSchemaName, true) sampleProduct: SampleProductsModel,    
    @Body() dto: UpdateSampleProductDto,
  ): Promise<SampleProductsModel> {
    return this.sampleProductsService.update(sampleProduct, dto);
  }

  @Delete(SAMPLE_PRODUCT_ID)
  @HttpCode(HttpStatus.OK)
  public async delete(    
    @ParamModel(SAMPLE_PRODUCT_ID, SampleProductSchemaName, true) sampleProduct: SampleProductsModel,    
  ): Promise<void> {
    await this.sampleProductsService.remove(sampleProduct);
  }
}
