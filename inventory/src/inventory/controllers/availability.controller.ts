import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessSchemaName, InventorySchemaName } from '../../environments/mongoose-schema.names';
import { InventoryModel } from '../models';
import { BusinessModel } from '../../business/models';
import { GetStocksBySkusDto } from '../dto/inventory';
import { InventoryService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const SKU_PLACEHOLDER: string = ':sku';

@Controller('business/:businessId/inventory')
@ApiTags('available amount inventory')
export class AvailabilityController {
  constructor(
    private readonly inventoryService: InventoryService,
  ) { }

  @Get('sku/:sku/stock')
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
  ): Promise<number> {
    if (inventory.originalInventory) {
      const originalInventory: InventoryModel =
        await this.inventoryService.findOneByBusinessIdAndSku(
          inventory.originalInventory.businessId,
          inventory.originalInventory.sku,
        );

      return originalInventory.stock;
    }

    return inventory.stock;
  }

  @Post('sku/stock')
  @Roles(RolesEnum.anonymous)
  public async getBySkus(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() body: GetStocksBySkusDto,
  ): Promise<{ [key: string]: number }> {
    return this.inventoryService.getStocksBySkus(body.skus, business);
  }
}
