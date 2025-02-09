import { ConflictException, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import {
  BusinessSchemaName,
  InventorySchemaName,
  InventoryLocationSchemaName,
} from '../../environments/mongoose-schema.names';
import { PaginationDto, SortDto } from '../dto';
import { CartItemDto } from '../dto/api';
import { CheckoutCartItemDto } from '../dto/checkout';
import {
  CreateInventoryDto, UpdateInventoryDto, InventoryQuantityChangeDto,
  InventoryStockTransferDto, InventoryQueryDto, AadminInventoryDto,
} from '../dto/inventory';
import { ImportProductInterface } from '../dto/rmq';
import { InventoryQuantityChangeInterface } from '../interfaces/cart-change-set';
import { InventoryLocationInterface } from '../interfaces';
import { InventoryModel, ReservationModel, InventoryLocationModel } from '../models';
import { InventoryEventsEnum } from '../enums';
import { EventProducer } from '../producer';

const DEFAULT_LOCATION_ID: string = '114b5402-a638-468c-9272-61141f20d7af';
@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventorySchemaName) private readonly inventoryModel: Model<InventoryModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(InventoryLocationSchemaName)
    private readonly inventoryLocationModel: Model<InventoryLocationModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  public async create(business: BusinessModel, body: CreateInventoryDto): Promise<InventoryModel> {
    const inventory: InventoryModel = await this.inventoryModel.create({
      businessId: business._id,
      ...body,
    } as InventoryModel);

    await this.eventDispatcher.dispatch(InventoryEventsEnum.InventoryCreated, inventory);

    return inventory;
  }

  public async findOneById(id: string): Promise<InventoryModel> {
    return this.inventoryModel.findOne({ _id: id });
  }

  public async findOneByBusinessAndSku(business: BusinessModel, sku: string): Promise<InventoryModel> {
    return this.inventoryModel.findOne({
      businessId: business.id,
      sku: sku,
    });
  }

  public async findOneByBusinessIdAndSku(businessId: string, sku: string): Promise<InventoryModel> {
    return this.inventoryModel.findOne({
      businessId: businessId,
      sku: sku,
    });
  }

  public async findOneByApiItem(business: BusinessModel, item: CartItemDto): Promise<InventoryModel> {
    return this.inventoryModel.findOne({
      $or: [
        { sku: item.sku },
        { sku: item.identifier },
      ],
      businessId: business.id,
    });
  }

  public async findOneByCheckoutItem(item: CheckoutCartItemDto): Promise<InventoryModel> {
    return this.inventoryModel.findOne({
      $or: [
        { sku: item.identifier },
        { product: item.product_uuid },
      ],
    });
  }

  public async setIsNegativeStockAllowed(id: string, isNegativeStockAllowed: boolean): Promise<InventoryModel> {
    return this.inventoryModel.findByIdAndUpdate(id, { $set: { isNegativeStockAllowed } }, { new: true });
  }

  public async getForAdmin(query: InventoryQueryDto)
    : Promise<{ documents: InventoryModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = Array.isArray(query.businessIds) ? { $in: query.businessIds } : query.businessIds;
    }

    if (query.productIds) {
      conditions.product = Array.isArray(query.productIds) ? { $in: query.productIds } : query.productIds;
    }

    if (query.skuLike) {
      conditions.sku = { $regex: query.skuLike };
    }

    if (query.sku) {
      conditions.sku = query.sku;
    }

    const documents: InventoryModel[] = await this.inventoryModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.inventoryModel.count(conditions);

    return {
      documents,
      page,
      total,
    };
  }

  public async createForAdmin(adminInventoryDto: AadminInventoryDto)
    : Promise<InventoryModel> {
    const business: BusinessModel = await this.getBusinessById(adminInventoryDto.businessId);
    const existingInventory: InventoryModel = await this.findOneByBusinessAndSku(business, adminInventoryDto.sku);
    if (existingInventory) {
      throw new ConflictException(
        `Inventory for sku "${adminInventoryDto.sku}" already exists for business ${business._id} `
      );
    }

    return this.create(business, adminInventoryDto);
  }

  public async deleteForAdmin(inventory: InventoryModel): Promise<void> {
    await this.inventoryModel.findByIdAndDelete(inventory._id);
  }

  public async transferForAdmin(
    inventory: InventoryModel,
    inventoryTransferDto: InventoryStockTransferDto,
  ): Promise<InventoryLocationModel[]> {
    return this.transfer(inventory, inventoryTransferDto);
  }

  public async update(inventory: InventoryModel, dto: UpdateInventoryDto): Promise<InventoryModel> {
    if (dto.sku && inventory.sku !== dto.sku) {
      await inventory.populate('business').execPopulate();
      const alreadyExists: InventoryModel = await this.findOneByBusinessAndSku(inventory.business, dto.sku);
      if (alreadyExists) {
        throw new ConflictException(
          `Inventory with SKU '${dto.sku}' already exists for business '${inventory.business.id}'`,
        );
      }
    }

    const updatedInventory: InventoryModel = await this.inventoryModel.findOneAndUpdate(
      { _id: inventory.id },
      { $set: dto },
      { new: true },
    );

    await this.eventDispatcher.dispatch(InventoryEventsEnum.InventoryUpdated, updatedInventory);

    return updatedInventory;
  }

  public async updateSku(originalSku: string, updatedSku: string, business: BusinessModel): Promise<InventoryModel> {
    const updatedInventory: InventoryModel = await this.inventoryModel.findOneAndUpdate(
      {
        businessId: business.id,
        sku: originalSku,
      },
      {
        $set: {
          sku: updatedSku,
        },
      },
    );

    await this.eventDispatcher.dispatch(InventoryEventsEnum.InventoryUpdated, updatedInventory);

    await this.inventoryModel.updateMany(
      {
        'originalInventory.businessId': business.id,
        'originalInventory.sku': originalSku,
      },
      {
        $set: {
          'originalInventory.sku': updatedSku,
        },
      },
    );

    return updatedInventory;
  }

  public async getAllByBusiness(business: BusinessModel): Promise<InventoryModel[]> {
    return this.inventoryModel.find({ businessId: business._id });
  }

  public async reserveByDto(
    business: BusinessModel,
    inventory: InventoryModel,
    changeSet: InventoryQuantityChangeInterface,
  ): Promise<boolean> {
    const updated: InventoryModel = await this.inventoryModel.findOneAndUpdate(
      {
        businessId: business.id,
        sku: inventory.sku,
      },
      {
        $inc: {
          reserved: Number(changeSet.quantity),
          stock: Number(-changeSet.quantity),
        },
      },
      {
        new: true,
      },
    ).exec();

    if (updated.stock < 0 && !inventory.isNegativeStockAllowed) {
      await this.releaseByDto(business, inventory, changeSet);

      return false;
    }

    return true;
  }

  public async releaseByDto(
    business: BusinessModel,
    inventory: InventoryModel,
    changeSet: InventoryQuantityChangeInterface,
  ): Promise<void> {
    await this.inventoryModel.findOneAndUpdate(
      {
        businessId: business.id,
        sku: inventory.sku,
      },
      {
        $inc: {
          reserved: Number(-changeSet.quantity),
          stock: Number(changeSet.quantity),
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async releaseReservation(
    reservation: ReservationModel,
  ): Promise<void> {
    await reservation.populate('inventory').execPopulate();
    await this.inventoryModel.findOneAndUpdate(
      {
        _id: reservation.inventory.id,
      },
      {
        $inc: {
          reserved: Number(-reservation.quantity),
          stock: Number(reservation.quantity),
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async closeReservation(
    reservation: ReservationModel,
  ): Promise<void> {
    await this.inventoryModel.findOneAndUpdate(
      {
        _id: reservation.inventory.id,
      },
      {
        $inc: {
          reserved: Number(-reservation.quantity),
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async addStock(
    business: BusinessModel,
    inventory: InventoryModel,
    changeSet: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {
    return this.addOrSubtractStock(business, inventory, changeSet);
  }

  public async subtractStock(
    business: BusinessModel,
    inventory: InventoryModel,
    changeSet: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {
    changeSet.inventoryLocations = changeSet.inventoryLocations || [];
    const subtractChangeSet: InventoryQuantityChangeDto = {
      ...changeSet,
      inventoryLocations: changeSet.inventoryLocations.map((il: any) => ({ ...il, stock: -il.stock })),
      quantity: -changeSet.quantity,
    };

    return this.addOrSubtractStock(business, inventory, subtractChangeSet);
  }

  public async addOrSubtractStock(
    business: BusinessModel,
    inventory: InventoryModel,
    changeSet: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {

    if (!changeSet.inventoryLocations || !changeSet.inventoryLocations.length) {
      changeSet.inventoryLocations = [{ locationId: DEFAULT_LOCATION_ID, stock: changeSet.quantity }];
    }
    this.validateQuantityChangeRequest(changeSet);

    changeSet.inventoryLocations = changeSet.inventoryLocations || [];

    // create inventory locations if not exist
    for (const il of changeSet.inventoryLocations) {
      await this.getOrCreateInventoryLocation(inventory._id, il.locationId);
    }

    if (changeSet.inventoryLocations) {
      await this.inventoryLocationModel.bulkWrite(
        changeSet.inventoryLocations.map((inventoryLocation: InventoryLocationInterface) => ({
          updateOne: {
            filter: {
              inventoryId: inventory._id,
              locationId: inventoryLocation.locationId,
            },
            update: {
              $inc: {
                stock: Number(inventoryLocation.stock),
              },
            },
            upsert: false,
          },
        })),
      );
    }

    const inventoryLocations: InventoryLocationModel[] =
      await this.inventoryLocationModel.find({ inventoryId: inventory._id });
    const inventoryLocationIds: string[] = inventoryLocations.map((il: any) => il._id);

    const updatedInventory: InventoryModel = await this.inventoryModel.findOneAndUpdate(
      {
        businessId: business.id,
        sku: inventory.sku,
      },
      {
        $addToSet: {
          inventoryLocations: inventoryLocationIds,
        },
        $inc: {
          stock: Number(changeSet.quantity),
        },
      },
      {
        new: true,
      },
    );

    if (changeSet.quantity >= 0) {
      await this.eventDispatcher.dispatch(
        InventoryEventsEnum.InventoryStockAdded,
        updatedInventory,
        changeSet.quantity,
      );
    } else if (changeSet.quantity < 0) {
      await this.eventDispatcher.dispatch(
        InventoryEventsEnum.InventoryStockSubtracted,
        updatedInventory,
        -changeSet.quantity,
      );
    }

    inventory.inventoryLocations = inventoryLocations;

    return updatedInventory;
  }


  public async addStockToInventoryLocation(
    business: BusinessModel,
    inventory: InventoryModel,
    inventoryLocation: InventoryLocationModel,
    changeSet: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {

    await this.inventoryLocationModel.findOneAndUpdate(
      { _id: inventoryLocation._id },
      {
        $inc: {
          stock: Number(changeSet.quantity),
        },
      },
      {
        new: true,
      },
    );

    const updatedInventory: InventoryModel = await this.inventoryModel.findOneAndUpdate(
      {
        businessId: business.id,
        sku: inventory.sku,
      },
      {
        $inc: {
          stock: Number(changeSet.quantity),
        },
      },
      {
        new: true,
      },
    );

    await this.eventDispatcher.dispatch(InventoryEventsEnum.InventoryUpdated, updatedInventory);

    return updatedInventory;
  }


  public async subtractStockFromInventoryLocation(
    business: BusinessModel,
    inventory: InventoryModel,
    inventoryLocation: InventoryLocationModel,
    changeSet: InventoryQuantityChangeDto,
  ): Promise<InventoryModel> {

    await this.inventoryLocationModel.findOneAndUpdate(
      { _id: inventoryLocation._id },
      {
        $inc: {
          stock: Number(-changeSet.quantity),
        },
      },
      {
        new: true,
      },
    );

    const updatedInventory: InventoryModel = await this.inventoryModel.findOneAndUpdate(
      {
        businessId: business.id,
        sku: inventory.sku,
      },
      {
        $inc: {
          stock: Number(-changeSet.quantity),
        },
      },
      {
        new: true,
      },
    );

    await this.eventDispatcher.dispatch(InventoryEventsEnum.InventoryUpdated, updatedInventory);

    return updatedInventory;
  }

  public async transfer(
    inventory: InventoryModel,
    dto: InventoryStockTransferDto,
  ): Promise<InventoryLocationModel[]> {

    let fromInventoryLocation: any = await this.getOrCreateInventoryLocation(inventory._id, dto.fromLocationId);
    let toInventoryLocation: any = await this.getOrCreateInventoryLocation(inventory._id, dto.toLocationId);
    const quentity: number = dto.quantity;


    await this.inventoryLocationModel.bulkWrite(
      [
        {
          updateOne: {
            filter: {
              _id: fromInventoryLocation._id,
            },
            update: {
              $inc: {
                stock: Number(-quentity),
              },
            },
          },
        },
        {
          updateOne: {
            filter: {
              _id: toInventoryLocation._id,
            },
            update: {
              $inc: {
                stock: Number(quentity),
              },
            },
          },
        },
      ]);

    fromInventoryLocation = await this.getOrCreateInventoryLocation(inventory._id, dto.fromLocationId);
    toInventoryLocation = await this.getOrCreateInventoryLocation(inventory._id, dto.toLocationId);

    return [fromInventoryLocation, toInventoryLocation];
  }

  public async getList(
    query: object,
    pagination: PaginationDto = { page: 1, limit: 0 },
    sort: SortDto,
  ): Promise<InventoryModel[]> {
    const { page, limit }: { page: number; limit: number } = pagination;
    const skip: number = (page - 1) * limit;

    const orderBy: { [propName: string]: 1 | -1 } = { } as { [propName: string]: 1 | -1 };
    orderBy[sort.field] = sort.direction === 'asc' ? 1 : -1;

    return this.inventoryModel.find(query)
      .sort(orderBy)
      .skip(skip)
      .limit(limit)
      .exec()
      ;
  }

  public async populateInventoryLocations(inventory: InventoryModel): Promise<void> {
    inventory.inventoryLocations = await this.inventoryLocationModel.find({ inventoryId: inventory._id });
  }

  public async importProducts(businessId: string, items: ImportProductInterface[]): Promise<void> {
    // TODO: get somehow stockAmount
    const business: BusinessModel = await this.businessModel.findById(businessId).exec();
    for (const product of items) {
      await this.inventoryModel.findOneAndUpdate(
        { sku: product.sku },
        { $set: { businessId: business.id, sku: product.sku, barcode: product.barcode } },
        { upsert: true },
      ).exec();

      for (const variant of product.variants) {
        await this.inventoryModel.findOneAndUpdate(
          { sku: variant.sku },
          { $set: { businessId: business.id, sku: variant.sku, barcode: variant.barcode } },
          { upsert: true },
        ).exec();
      }
    }
  }

  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {
    await this.inventoryModel.deleteMany({ businessId: business.id }).exec();
  }

  public async removeBySku(sku: string, business: BusinessModel): Promise<void> {
    const inventory: InventoryModel = await this.inventoryModel.findOne({
      businessId: business.id,
      sku: sku,
    }).exec();

    if (!inventory) {
      return;
    }

    if (inventory.stock > 0) {
      this.logger.warn(
        `Trying to remove inventory "${inventory.id}", with sku: "${inventory.sku}", ` +
        `but it has stock items`,
      );

      return;
    }

    if (inventory.reserved > 0) {
      this.logger.warn(
        `Trying to remove inventory "${inventory.id}", with sku: "${inventory.sku}", ` +
        `but it has reserved items`,
      );

      return;
    }

    await this.inventoryModel.deleteOne({
      businessId: business.id,
      sku: sku,
    }).exec();
  }

  public async getStocksBySkus(skus: string[], business: BusinessModel): Promise<{ [key: string]: number }> {
    const inventories: InventoryModel[] = await this.inventoryModel.find({
      businessId: business.id,
      sku: { $in: skus },
    }).exec();

    const result: { [key: string]: number } = { };
    for (const inventory of inventories) {
      if (inventory.originalInventory) {
        const originalInventory: InventoryModel = await this.findOneByBusinessIdAndSku(
          inventory.originalInventory.businessId,
          inventory.originalInventory.sku,
        );

        result[inventory.sku] = originalInventory.stock;
      } else {
        result[inventory.sku] = inventory.stock;
      }
    }

    return result;
  }

  private async getBusinessById(businessId: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessModel.findById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return business;
  }

  private validateQuantityChangeRequest(quantityChangeDto: InventoryQuantityChangeDto): void {

    if (!quantityChangeDto.inventoryLocations || !quantityChangeDto.inventoryLocations.length) {
      throw new BadRequestException(`inventory locations should be filled`);
    }

    const subtotal: number =
      quantityChangeDto.inventoryLocations.reduce((sum: number, item: any) => sum += item.stock, 0);

    if (quantityChangeDto.quantity !== subtotal) {
      throw new BadRequestException(`subtotal of stocks should be equal to the quantity`);
    }
  }

  private async getOrCreateInventoryLocation(inventoryId: string, locationId: string): Promise<InventoryLocationModel> {
    let inventoryLocation: any = await this.inventoryLocationModel.findOne({
      inventoryId: inventoryId,
      locationId: locationId,
    });

    if (!inventoryLocation) {
      inventoryLocation = await this.inventoryLocationModel.create({
        inventoryId: inventoryId,
        locationId: locationId,
        stock: 0,
      });
    }

    return inventoryLocation;
  }
}
