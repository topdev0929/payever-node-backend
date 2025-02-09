import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventListener } from '@pe/nest-kit';
import { InventoryService } from '../services';
import { InventoryEventsEnum } from '../enums';
import { InventoryModel } from '../models';
import { InventorySchemaName } from '../../environments/mongoose-schema.names';
import { EventProducer } from '../producer';
import { BusinessModel } from '@pe/business-kit';

@Injectable()
export class InventoryListener {
  constructor(
    @InjectModel(InventorySchemaName) private readonly inventoryModel: Model<InventoryModel>,
    private readonly inventoryService: InventoryService,
    private readonly eventProducer: EventProducer,
  ) { }

  @EventListener(InventoryEventsEnum.InventoryCreated)
  public async onInventoryCreated(inventory: InventoryModel): Promise<void> {
    if (inventory.originalInventory) {
      const originalInventory: InventoryModel = await this.inventoryService.findOneByBusinessIdAndSku(
        inventory.originalInventory.businessId,
        inventory.originalInventory.sku,
      );

      await this.inventoryModel.findOneAndUpdate(
        {
          _id: inventory._id,
        },
        {
          $set: {
            stock: originalInventory.stock,
          },
        },
      );
    }
  }

  @EventListener(InventoryEventsEnum.InventoryUpdated)
  public async onInventoryUpdated(inventory: InventoryModel): Promise<void> {
    await this.updateReferenceStocks(inventory);
  }

  @EventListener(InventoryEventsEnum.InventoryStockAdded)
  public async onInventoryStockAdded(inventory: InventoryModel, quantity: number): Promise<void> {
    if (inventory.originalInventory) {
      const originalInventory: InventoryModel = await this.inventoryModel.findOneAndUpdate(
        {
          businessId: inventory.originalInventory.businessId,
          sku: inventory.originalInventory.sku,
        },
        {
          $inc: {
            stock: Number(quantity),
          },
        },
        {
          new: true,
        },
      );

      await this.updateReferenceStocks(originalInventory);
    } else {
      await this.updateReferenceStocks(inventory);
    }
  }

  @EventListener(InventoryEventsEnum.InventoryStockSubtracted)
  public async onInventoryStockSubtracted(inventory: InventoryModel, quantity: number): Promise<void> {
    if (inventory.originalInventory) {
      const originalInventory: InventoryModel = await this.inventoryModel.findOneAndUpdate(
        {
          businessId: inventory.originalInventory.businessId,
          sku: inventory.originalInventory.sku,
        },
        {
          $inc: {
            stock: Number(-quantity),
          },
        },
        {
          new: true,
        },
      );

      await this.updateReferenceStocks(originalInventory);
    } else {
      await this.updateReferenceStocks(inventory);
    }
  }

  private async updateReferenceStocks(inventory: InventoryModel): Promise<void> {
    await this.inventoryModel.updateMany(
      {
        'originalInventory.businessId': inventory.businessId,
        'originalInventory.sku': inventory.sku,
      },
      {
        $set: {
          stock: inventory.stock,
        },
      },
    );
    await this.eventProducer.sendStockSynchronize({ id: inventory.businessId } as BusinessModel, inventory);
  }
}
