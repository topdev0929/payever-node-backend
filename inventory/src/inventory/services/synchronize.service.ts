import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessModel } from '../../business/models';
import { PaginationDto, SortDirectionEnum, SortDto } from '../dto';
import { StockChangedDto, StockSyncDto } from '../dto/rmq';
import { InventoryModel } from '../models';
import { EventProducer } from '../producer/event.producer';
import { InventoryService } from './inventory.service';

@Injectable()
export class SynchronizeService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly eventProducer: EventProducer,
  ) { }

  public async synchronizeStockOutward(business: BusinessModel): Promise<void> {
    const pagination: PaginationDto = {
      limit: 100,
      page: 1,
    };
    const sort: SortDto = {
      direction: SortDirectionEnum.ASC,
      field: 'updatedAt',
    };

    while (true) {
      const inventories: InventoryModel[] = await this.inventoryService.getList(
        {
          businessId: business.id,
        },
        pagination,
        sort,
      );

      if (!inventories.length) {
        return;
      }

      for (const inventory of inventories) {
        await this.eventProducer.sendStockSynchronize(business, inventory);
      }

      pagination.page++;
    }
  }

  public async createIfNotExists(business: BusinessModel, dto: StockSyncDto): Promise<InventoryModel> {
    let errorMessage: string = '';
    let inventoryModel: InventoryModel = null;
    try {
      const inventory: InventoryModel = await this.inventoryService.create(
        business,
        { sku: dto.sku, barcode: '', origin: dto.origin, isNegativeStockAllowed: dto.isNegativeStockAllowed },
      );
      inventoryModel = await this.inventoryService.addStock(business, inventory, { quantity: Number(dto.stock || 0) });
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        errorMessage = 'Inventory already exists';
      } else {
        errorMessage = e.message;
      }
    }

    if (dto.synchronizationTask) {
      if (!errorMessage) {
        await this.eventProducer.synchronizationSucceeded(dto.sku, dto.synchronizationTask.id);
      } else {
        await this.eventProducer.synchronizationFailed(dto.sku, dto.synchronizationTask.id, errorMessage);
      }
    }

    return inventoryModel;
  }

  public async upsertStock(business: BusinessModel, dto: StockSyncDto): Promise<InventoryModel> {
    let inventory: InventoryModel = await this.inventoryService.findOneByBusinessAndSku(
      business,
      dto.sku,
    );
    if (!inventory) {
      inventory = await this.inventoryService.create(
        business,
        { sku: dto.sku, barcode: '', origin: dto.origin, isNegativeStockAllowed: dto.isNegativeStockAllowed },
      );

      return this.inventoryService.addStock(business, inventory, { quantity: Number(dto.stock || 0) });
    } else {
      if (
        dto.origin === inventory.origin &&
        dto.isNegativeStockAllowed !== null &&
        dto.isNegativeStockAllowed !== undefined
      ) {
        inventory = await this.inventoryService.setIsNegativeStockAllowed(inventory._id, dto.isNegativeStockAllowed);
      }
    }

    if (dto.stock === null || dto.stock === undefined) {
      return this.inventoryService.addStock(business, inventory, { quantity: 0 });
    } else if (inventory.stock < dto.stock) {
      return this.inventoryService.addStock(business, inventory, { quantity: Number(dto.stock - inventory.stock) });
    } else {
      return this.inventoryService.subtractStock(
        business,
        inventory,
        { quantity: Number(inventory.stock - dto.stock) },
      );
    }

  }

  public async addStock(business: BusinessModel, dto: StockChangedDto): Promise<InventoryModel> {
    const inventory: InventoryModel = await this.inventoryService.findOneByBusinessAndSku(business, dto.sku);

    if (!inventory) {
      throw new NotFoundException(`Coldn't found an inventory sku ${dto.sku}`);
    }

    return this.inventoryService.addStock(business, inventory, dto);
  }

  public async subtractStock(business: BusinessModel, dto: StockChangedDto): Promise<InventoryModel> {
    const inventory: InventoryModel = await this.inventoryService.findOneByBusinessAndSku(business, dto.sku);

    if (!inventory) {
      throw new NotFoundException(`Coldn't found an inventory sku ${dto.sku}`);
    }

    return this.inventoryService.subtractStock(business, inventory, dto);
  }
}
