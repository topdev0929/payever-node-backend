import {
  Body, Controller, Get, Patch,
  Post, UseGuards, HttpCode, HttpStatus,
  Query, NotFoundException, Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { InventorySchemaName, InventoryLocationSchemaName } from '../../environments/mongoose-schema.names';
import {
  InventoryQuantityChangeDto,
  InventoryStockTransferDto,
  InventoryQueryDto,
  AadminInventoryDto,
} from '../dto/inventory';
import { InventoryModel, InventoryLocationModel } from '../models';
import { EventProducer } from '../producer/event.producer';
import { InventoryQuantityChangeInterface } from '../interfaces/cart-change-set';
import { InventoryService } from '../services';
import { BusinessService } from '@pe/business-kit';

const INVENTORY_ID: string = ':inventoryId';
const INVENTORY_LOCATION_ID: string = ':inventoryLocationId';

@Controller('admin/inventories')
@ApiTags('admin inventories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
export class AdminInventoriesController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly eventProducer: EventProducer,
    private readonly businessService: BusinessService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(
    @Query() query: InventoryQueryDto,
  ): Promise<any> {
    return this.inventoryService.getForAdmin(query);
  }

  @Get(INVENTORY_ID)
  @HttpCode(HttpStatus.OK)
  public async getById(
    @ParamModel(INVENTORY_ID, InventorySchemaName) inventory: InventoryModel,
  ): Promise<InventoryModel> {
    return inventory;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() adminInventoryDto: AadminInventoryDto,
  ): Promise<InventoryModel> {
    return this.inventoryService.createForAdmin(adminInventoryDto);
  }

  @Patch(INVENTORY_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @Body() adminInventoryDto: AadminInventoryDto,
    @ParamModel(INVENTORY_ID, InventorySchemaName) inventory: InventoryModel,
  ): Promise<InventoryModel> {
    const updatedInventory: InventoryModel = await this.inventoryService.update(inventory, adminInventoryDto);
    const business: BusinessModel = await this.businessService.findOneById(inventory.businessId);
    await this.eventProducer.sendLowStockWarningIfRequired(business, updatedInventory);

    return updatedInventory;
  }

  @Delete(INVENTORY_ID)
  @HttpCode(HttpStatus.OK)
  public async delete(
    @ParamModel(INVENTORY_ID, InventorySchemaName) inventory: InventoryModel,
  ): Promise<void> {
    await this.inventoryService.deleteForAdmin(inventory);
  }

  @Patch(`${INVENTORY_ID}/add-stock`)
  @HttpCode(HttpStatus.OK)
  public async addStockByInventory(
    @ParamModel(INVENTORY_ID, InventorySchemaName) inventory: InventoryModel,
    @Body() body: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {
    const business: BusinessModel = await this.getBusinessById(inventory.businessId);
    const updatedInventory: InventoryModel = await this.inventoryService.addStock(business, inventory, body);
    await this.eventProducer.sendStockAdded(business, updatedInventory, body.quantity);

    return updatedInventory;
  }

  @Patch(`${INVENTORY_ID}/subtract-stock`)
  @HttpCode(HttpStatus.OK)
  public async subtractStockByInventory(
    @ParamModel(INVENTORY_ID, InventorySchemaName) inventory: InventoryModel,
    @Body() body: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {
    const business: BusinessModel = await this.getBusinessById(inventory.businessId);
    const updatedInventory: InventoryModel = await this.inventoryService.subtractStock(business, inventory, body);
    await this.eventProducer.sendStockSubtracted(business, updatedInventory, body.quantity);
    await this.eventProducer.sendLowStockWarningIfRequired(business, updatedInventory);

    return updatedInventory;
  }

  @Patch(`${INVENTORY_ID}/transfer-stock`)
  @HttpCode(HttpStatus.OK)
  public async transferStockByInventory(
    @ParamModel(INVENTORY_ID, InventorySchemaName) inventory: InventoryModel,
    @Body() inventoryTransferDto: InventoryStockTransferDto,
  ): Promise<InventoryLocationModel[]> {
    return this.inventoryService.transferForAdmin(inventory, inventoryTransferDto);
  }

  @Patch(`${INVENTORY_ID}/inventory-location/${INVENTORY_LOCATION_ID}/add-stock`)
  @HttpCode(HttpStatus.OK)
  public async addStockToInventoryLocation(
    @ParamModel(INVENTORY_ID, InventorySchemaName) inventory: InventoryModel,
    @ParamModel(INVENTORY_LOCATION_ID, InventoryLocationSchemaName) inventoryLocation: InventoryLocationModel,
    @Body() inventoryQuantityChange: InventoryQuantityChangeInterface,
  ): Promise<InventoryModel> {
    const business: BusinessModel = await this.getBusinessById(inventory.businessId);
    const updatedInventory: InventoryModel = await this.inventoryService.addStockToInventoryLocation(
      business,
      inventory,
      inventoryLocation,
      inventoryQuantityChange,
    );
    await this.eventProducer.sendStockAdded(business, updatedInventory, inventoryQuantityChange.quantity);

    return updatedInventory;
  }

  @Patch(`${INVENTORY_ID}/inventory-location/${INVENTORY_LOCATION_ID}/subtract-stock`)
  @HttpCode(HttpStatus.OK)
  public async subtractStockFromInventoryLocation(
    @ParamModel(INVENTORY_ID, InventorySchemaName) inventory: InventoryModel,
    @ParamModel(INVENTORY_LOCATION_ID, InventoryLocationSchemaName) inventoryLocation: InventoryLocationModel,
    @Body() inventoryQuantityChange: InventoryQuantityChangeInterface,
  ): Promise<InventoryModel> {
    const business: BusinessModel = await this.getBusinessById(inventory.businessId);
    const updatedInventory: InventoryModel = await this.inventoryService.subtractStockFromInventoryLocation(
      business,
      inventory,
      inventoryLocation,
      inventoryQuantityChange,
    );
    await this.eventProducer.sendStockSubtracted(business, updatedInventory, inventoryQuantityChange.quantity);
    await this.eventProducer.sendLowStockWarningIfRequired(business, updatedInventory).catch();

    return updatedInventory;
  }

  private async getBusinessById(businessId: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return business;
  }
}
