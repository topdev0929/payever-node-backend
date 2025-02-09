import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards, Query,
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
import { CreateSampleProductDto, SampleProductQueryDto, UpdateSampleProductDto } from '../dto';
import { SampleProductSchemaName } from '../schemas';
import { SampleProductsService } from '../services';

@Controller('admin/sample-products')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly sampleProductsService: SampleProductsService,
  ) { }

  @Get()
  public async getSampleProducts(
    @Query() dto: SampleProductQueryDto,
  ): Promise<any> {
    return this.sampleProductsService.getForAdmin(dto);
  }

  @Post()
  public async createSampleProducts(
    @Body() dto: CreateSampleProductDto,
  ): Promise<SampleProductsModel> {
    return this.sampleProductsService.create(dto);
  }

  @Patch(':sampleProductId')
  public async updateSampleProducts(
    @ParamModel(':sampleProductId', SampleProductSchemaName, true) sampleProduct: SampleProductsModel,
    @Param('sampleProductId') swagger__sampleProductId: string,
    @Body() dto: UpdateSampleProductDto,
  ): Promise<SampleProductsModel> {
    return this.sampleProductsService.update(sampleProduct, dto);
  }

  @Delete(':sampleProductId')
  public async deleteSite(
    @User() user: UserTokenInterface,
    @ParamModel(':sampleProductId', SampleProductSchemaName, true) sampleProduct: SampleProductsModel,
    @Param('sampleProductId') swagger__sampleProductId: string,
  ): Promise<void> {
    await this.sampleProductsService.remove(sampleProduct);
  }
}
