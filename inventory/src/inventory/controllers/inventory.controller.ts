import { Body, Controller, ConflictException, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import {
  BusinessSchemaName,
  InventorySchemaName,
  InventoryLocationSchemaName,
} from '../../environments/mongoose-schema.names';
import {
  CreateInventoryDto,
  InventoryQuantityChangeDto,
  UpdateInventoryDto,
  InventoryStockTransferDto,
} from '../dto/inventory';
import { InventoryModel, InventoryLocationModel } from '../models';
import { EventProducer } from '../producer/event.producer';
import { InventoryQuantityChangeInterface } from '../interfaces/cart-change-set';
import { InventoryService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const SKU_PLACEHOLDER: string = ':sku';
const PRODUCT_ID_PLACEHOLDER: string = ':productId';
const INVENTORY_LOCATION_ID_PLACEHOLDER: string = ':inventoryLocationId';
const INVENTORY_ID: string = ':inventoryId';

@Controller('business/:businessId/inventory')
@ApiTags('business inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly eventProducer: EventProducer,
  ) { }

  @Get()
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async get(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
  ): Promise<InventoryModel[]> {
    return this.inventoryService.getAllByBusiness(business);
  }


  @Get(`${INVENTORY_ID}/inventory-locations`)
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async getLocations(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(INVENTORY_ID, InventorySchemaName)
    inventory: InventoryModel,
  ): Promise<InventoryLocationModel[]> {
    await this.inventoryService.populateInventoryLocations(inventory);

    return inventory.inventoryLocations;
  }


  @Post()
  @Acl({ microservice: 'products', action: AclActionsEnum.create })
  public async create(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() body: CreateInventoryDto,
  ): Promise<void> {

    const existingInventory: InventoryModel = await this.inventoryService.findOneByBusinessAndSku(business, body.sku);
    if (existingInventory) {
      throw new ConflictException(`Inventory for sku "${body.sku}" already exists`);
    }

    await this.inventoryService.create(business, body);
  }

  @Get('sku/:sku')
  @Roles(RolesEnum.anonymous)
  public async getBySku(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        sku: SKU_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
  ): Promise<any> {
    await this.inventoryService.populateInventoryLocations(inventory);
    inventory.inventoryLocations = [{ locationId: 'l1' }, { inventoryId: 'inventoryId' }] as any;

    return inventory;
  }

  @Patch('sku/:sku')
  @Acl(
    { microservice: 'products', action: AclActionsEnum.create },
    { microservice: 'products', action: AclActionsEnum.update },
  )
  public async updateBySku(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        sku: SKU_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
    @Body() body: UpdateInventoryDto,
  ): Promise<void> {
    await this.inventoryService.update(inventory, body);
  }

  @Patch('sku/:sku/add')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async addStockBySku(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        sku: SKU_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
    @Body() body: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {
    const updatedInventory: InventoryModel = await this.inventoryService.addStock(business, inventory, body);
    await this.eventProducer.sendStockAdded(business, updatedInventory, body.quantity);

    return updatedInventory;
  }

  @Patch('sku/:sku/subtract')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async subtractStockBySku(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        sku: SKU_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
    @Body() body: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {
    const updatedInventory: InventoryModel = await this.inventoryService.subtractStock(business, inventory, body);
    await this.eventProducer.sendStockSubtracted(business, updatedInventory, body.quantity);
    await this.eventProducer.sendLowStockWarningIfRequired(business, updatedInventory).catch();

    return updatedInventory;
  }

  @Patch('sku/:sku/transfer')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async transferStockBySku(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        sku: SKU_PLACEHOLDER,
      },
      InventorySchemaName,
      true,
    ) inventory: InventoryModel,
    @Body() body: InventoryStockTransferDto,
  ): Promise<InventoryLocationModel[]> {
    return this.inventoryService.transfer(inventory, body);
  }

  @Get('product/:productId')
  @Roles(RolesEnum.anonymous)
  public async getByProduct(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        product: PRODUCT_ID_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
  ): Promise<InventoryModel> {
    return inventory;
  }

  @Patch('product/:productId')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async updateByProduct(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        product: PRODUCT_ID_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
    @Body() body: UpdateInventoryDto,
  ): Promise<void> {
    await this.inventoryService.update(inventory, body);
  }

  @Patch('product/:productId/add')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async addStock(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        product: PRODUCT_ID_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
    @Body() body: InventoryQuantityChangeDto,
  ): Promise<void> {
    const updatedInventory: InventoryModel = await this.inventoryService.addStock(business, inventory, body);
    await this.eventProducer.sendStockAdded(business, updatedInventory, body.quantity);
  }

  @Patch('product/:productId/subtract')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async subtractStock(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        product: PRODUCT_ID_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
    @Body() body: InventoryQuantityChangeDto,
  ): Promise<void> {
    const updatedInventory: InventoryModel = await this.inventoryService.subtractStock(business, inventory, body);
    await this.eventProducer.sendStockSubtracted(business, updatedInventory, body.quantity);
  }

  @Patch('sku/:sku/inventory-location/:inventoryLocationId/add')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async addStockToInventoryLocation(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        sku: SKU_PLACEHOLDER,

      },
      InventorySchemaName,
    ) inventory: InventoryModel,
    @ParamModel(
      {
        _id: INVENTORY_LOCATION_ID_PLACEHOLDER,
      },
      InventoryLocationSchemaName,
    ) inventoryLocation: InventoryLocationModel,
    @Body() body: InventoryQuantityChangeInterface,
  ): Promise<void> {
    const updatedInventory: InventoryModel = await this.inventoryService.addStockToInventoryLocation(
      business,
      inventory,
      inventoryLocation,
      body,
    );
    await this.eventProducer.sendStockAdded(business, updatedInventory, body.quantity);
  }

  @Patch('sku/:sku/inventory-location/:inventoryLocationId/subtract')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async subtractStockFromInventoryLocation(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        sku: SKU_PLACEHOLDER,
      },
      InventorySchemaName,
    ) inventory: InventoryModel,
    @ParamModel(
      {
        _id: INVENTORY_LOCATION_ID_PLACEHOLDER,
      },
      InventoryLocationSchemaName,
    ) inventoryLocation: InventoryLocationModel,
    @Body() body: InventoryQuantityChangeInterface,
  ): Promise<void> {
    const updatedInventory: InventoryModel = await this.inventoryService.subtractStockFromInventoryLocation(
      business,
      inventory,
      inventoryLocation,
      body,
    );
    await this.eventProducer.sendStockSubtracted(business, updatedInventory, body.quantity);
  }
}
