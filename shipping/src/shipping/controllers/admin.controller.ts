import { Body, Controller, UseGuards, Put, Get, Post, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel } from '@pe/nest-kit';
import {
  CreateShippingBoxDto,
  CreateShippingOriginDto,
  CreateShippingZoneDto,
  UpdateShippingBoxDto,
  UpdateShippingOriginDto,
  UpdateShippingZoneDto,
} from '../dto';
import { CreateShippingSettingDto } from '../dto/create-shipping-settings.dto';
import { ShippingBoxModel, ShippingOriginModel, ShippingSettingModel, ShippingZoneModel } from '../models';
import { ShippingBoxSchemaName, ShippingOriginSchemaName, ShippingSettingSchemaName, ShippingZoneSchemaName } from '../schemas';
import { AdminService } from '../services';

@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiTags('admin')
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) { }

  @Get('shipping-box')
  public async getBoxes(
  ): Promise<ShippingBoxModel[]> {
    return this.adminService.getBoxes();
  }

  @Post('shipping-box')
  public async createBox(
    @Body() dto: CreateShippingBoxDto,
  ): Promise<ShippingBoxModel> {
    return this.adminService.createBox(dto);
  }

  @Put('shipping-box/:id')
  public async updateBox(
    @ParamModel(':id', ShippingBoxSchemaName) shippingBoxModel: ShippingBoxModel,
    @Body() dto: UpdateShippingBoxDto,
  ): Promise<ShippingBoxModel> {
    return this.adminService.updateBox(shippingBoxModel, dto);
  }

  @Delete('shipping-box/:id')
  public async deleteBox(
    @ParamModel(':id', ShippingBoxSchemaName) shippingBox: ShippingBoxModel,
  ): Promise<void> {
    await this.adminService.deleteOneBoxById(shippingBox._id);
  }

  @Post('shipping-origin')
  public async createOrigin(
    @Body() dto: CreateShippingOriginDto,
  ): Promise<ShippingOriginModel> {
    return this.adminService.createOrigin(dto);
  }

  @Get('shipping-origin')
  public async getOrigins(): Promise<ShippingOriginModel[]> {
    return this.adminService.findOrigin();
  }

  @Put('shipping-origin/:id')
  public async updateOrigin(
    @ParamModel(':id', ShippingOriginSchemaName) shippingOrigin: ShippingOriginModel,
    @Body() dto: UpdateShippingOriginDto,
  ): Promise<ShippingOriginModel> {
    return this.adminService.updateOrigin(shippingOrigin._id, dto);
  }

  @Delete('shipping-origin/:id')
  public async deleteOrigin(
    @ParamModel(':id', ShippingOriginSchemaName) shippingOrigin: ShippingOriginModel,
  ): Promise<void> {
    await this.adminService.deleteOneOriginById(shippingOrigin._id);
  }

  @Post('shipping-zone')
  public async createZone(
    @Body() dto: CreateShippingZoneDto,
  ): Promise<ShippingZoneModel> {
    return this.adminService.createZone(dto);
  }

  @Get('shipping-zone')
  public async getZone(): Promise<ShippingZoneModel[]> {
    return this.adminService.getZones();
  }

  @Put('shipping-zone/:id')
  public async updateZone(
    @ParamModel(':id', ShippingZoneSchemaName) shippingZone: ShippingZoneModel,
    @Body() dto: UpdateShippingZoneDto,
  ): Promise<ShippingZoneModel> {
    return this.adminService.updateZone(shippingZone._id, dto);
  }

  @Delete('shipping-zone/:id')
  public async deleteZone(
    @ParamModel(':id', ShippingZoneSchemaName) shippingZone: ShippingZoneModel,
  ): Promise<void> {
    await this.adminService.deleteOneZoneById(shippingZone._id);
  }

  @Get('shipping-setting')
  public async get(): Promise<ShippingSettingModel[]> {
    return this.adminService.findAll();
  }

  @Post('shipping-setting')
  public async create(
    @Body() dto: CreateShippingSettingDto,
  ): Promise<ShippingSettingModel> {
    return this.adminService.createProfile(dto);
  }

  @Put('shipping-setting/:id')
  public async update(
    @ParamModel(':id', ShippingSettingSchemaName) setting: ShippingSettingModel,
    @Body() dto: CreateShippingSettingDto,
  ): Promise<ShippingSettingModel> {
    return this.adminService.updateProfile(setting.id, {
      ...dto,
      business: undefined,
      businessId: dto.business,
    });
  }

  @Delete('shipping-setting/:id')
  public async delete(
    @ParamModel(':id', ShippingSettingSchemaName) setting: ShippingSettingModel,
  ): Promise<void> {
    await this.adminService.deleteOneProfileById(setting.id);
  }
}
