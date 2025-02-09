import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LocalDeliverySchemaName,
  LocalPickUpSchemaName,
  ShippingBoxSchemaName,
  ShippingOriginSchemaName,
  ShippingSettingSchemaName,
  ShippingZoneSchemaName,
} from '../schemas';
import {
  LocalDeliveryModel,
  LocalPickUpModel,
  ShippingBoxModel,
  ShippingOriginModel,
  ShippingSettingModel,
  ShippingZoneModel,
} from '../models';
import { ShippingBoxInterface, ShippingOriginInterface, ShippingSettingInterface, ShippingZoneInterface } from '../interfaces';
import {
  CreateShippingBoxDto,
  CreateShippingOriginDto,
  CreateShippingZoneDto,
  ShippingSettingDto,
  UpdateShippingBoxDto,
  UpdateShippingOriginDto,
  UpdateShippingZoneDto,
} from '../dto';
import { ProductModel } from '../models/product.model';
import { ProductInterface } from '../interfaces/products.interface';
import { CreateShippingSettingDto } from '../dto/create-shipping-settings.dto';
import { CreatedByEnum } from '../enums';
import { ShippingSettingService } from './shipping-setting.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(ShippingBoxSchemaName) private readonly shippingBoxModel: Model<ShippingBoxModel>,
    @InjectModel(ShippingOriginSchemaName) private readonly shippingOriginModel: Model<ShippingOriginModel>,
    @InjectModel(ShippingZoneSchemaName) private readonly shippingZoneModel: Model<ShippingZoneModel>,
    @InjectModel(ShippingSettingSchemaName) private readonly shippingSettingModel: Model<ShippingSettingModel>,
    @InjectModel(LocalDeliverySchemaName) private readonly localDeliveryModel: Model<LocalDeliveryModel>,
    @InjectModel(LocalPickUpSchemaName) private readonly localPickUpModel: Model<LocalPickUpModel>,
    private readonly settingService: ShippingSettingService,
  ) {
  }

  public async createBox(dto: CreateShippingBoxDto): Promise<ShippingBoxModel> {
    return this.shippingBoxModel.create({
      ...dto,
      createdBy: CreatedByEnum.Admin,
    });
  }

  public async getBoxes(): Promise<ShippingBoxModel[]> {
    return this.shippingBoxModel.find({ createdBy: CreatedByEnum.Admin });
  }

  public async deleteOneBoxById(id: string): Promise<ShippingBoxInterface> {
    return this.shippingBoxModel.findOneAndDelete({ _id: id });
  }

  public async updateBox(shippingBoxModel: ShippingBoxModel, dto: UpdateShippingBoxDto ): Promise<ShippingBoxModel> {
    return this.shippingBoxModel.findOneAndUpdate(
      { _id: shippingBoxModel._id },
      { $set: dto as ShippingBoxModel },
    ).exec();
  }

  public async createZone(dto: CreateShippingZoneDto | ShippingZoneInterface): Promise<ShippingZoneModel> {
    return this.shippingZoneModel.create({
      ...dto,
      createdBy: CreatedByEnum.Admin,
    } as ShippingZoneModel);
  }

  public async getZones(): Promise<ShippingZoneModel[]> {
    return this.shippingZoneModel.find({ createdBy: CreatedByEnum.Admin }).exec();
  }

  public async deleteOneZoneById(id: string): Promise<ShippingZoneModel> {
    return this.shippingZoneModel.findOneAndDelete({ _id: id });
  }

  public async updateZone(id: string, dto: UpdateShippingZoneDto ): Promise<ShippingZoneModel> {
    return this.shippingZoneModel.findOneAndUpdate(
      { _id: id },
      { $set: dto as ShippingZoneModel },
    ).exec();
  }

  public async createOrigin(dto: CreateShippingOriginDto | ShippingOriginInterface): Promise<ShippingOriginModel> {
    const shippingOriginModel: ShippingOriginModel = await this.shippingOriginModel.create({
      ...dto,
      createdBy: CreatedByEnum.Admin,
    } as ShippingOriginModel);
    if (dto.localDelivery) {
      dto.localDelivery.shippingOrigin = shippingOriginModel.id;
      await this.localDeliveryModel.create(dto.localDelivery as LocalDeliveryModel);
    }
    if (dto.localPickUp) {
      dto.localPickUp.shippingOrigin = shippingOriginModel.id;
      await this.localPickUpModel.create(dto.localPickUp as LocalPickUpModel);
    }

    return shippingOriginModel;
  }

  public async findOrigin(): Promise<ShippingOriginModel[]> {
    return this.shippingOriginModel.find({ createdBy: CreatedByEnum.Admin }).exec();
  }

  public async deleteOneOriginById(id: string): Promise<ShippingOriginModel> {
    return this.shippingOriginModel.findOneAndDelete({ _id: id });
  }

  public async updateOrigin(id: string, dto: UpdateShippingOriginDto ): Promise<ShippingOriginModel> {
    const shippingOriginModel: ShippingOriginInterface = { ...dto };
    if (dto.localDelivery) {
      dto.localDelivery.shippingOrigin = id;
      shippingOriginModel.localDelivery = dto.localDelivery.id ?
        (await this.localDeliveryModel
          .findOneAndUpdate(
            { _id: dto.localDelivery.id },
            { $set: dto.localDelivery as LocalDeliveryModel },
          ).exec()).id
        : (await this.localDeliveryModel.create(dto.localDelivery as LocalDeliveryModel)).id;
    }
    if (dto.localPickUp) {
      dto.localPickUp.shippingOrigin = id;
      shippingOriginModel.localPickUp = dto.localPickUp.id ?
      (await this.localPickUpModel
        .findOneAndUpdate(
          { _id: dto.localPickUp.id },
          { $set: dto.localPickUp as LocalPickUpModel },
        ).exec()).id
      : (await this.localPickUpModel.create(dto.localPickUp as LocalPickUpModel)).id;
    }

    return this.shippingOriginModel.findOneAndUpdate(
      { _id: id }, 
      { $set: shippingOriginModel as ShippingOriginModel },
    ).exec();
  }

  public async createProfile(setting: ShippingSettingDto | CreateShippingSettingDto)
  : Promise<ShippingSettingModel> {
    const shippingSettingModel: ShippingSettingInterface = {
      ...setting,
      business: undefined,
      businessId: setting.business as string,
    };

    if (setting.products) {
      shippingSettingModel.products = [];
      for (const product of setting.products) {
        const productData: ProductModel = await this.settingService.createOrUpdateProduct(product);
        if (productData) {
          shippingSettingModel.products.push(productData.id);
        }
      }
    }

    const settings: ShippingSettingModel =
      await this.shippingSettingModel.create({
        ...shippingSettingModel,
        createdBy: CreatedByEnum.Admin,
      } as ShippingSettingModel);

    return this.settingService.findOneById(settings.id);
  }

  public async deleteOneProfileById(id: string): Promise<ShippingSettingModel> {
    return this.shippingSettingModel.findOneAndDelete({ _id: id });
  }

  public async updateProfile(id: string, setting: ShippingSettingInterface): Promise<ShippingSettingModel> {
    const shippingSettingModel: ShippingSettingInterface = { ...setting };
    if (setting.products) {
      shippingSettingModel.products = [];
      for (const product of setting.products) {
        const productData: ProductModel = await this.settingService.createOrUpdateProduct(product as ProductInterface);
        if (productData) {
          shippingSettingModel.products.push(productData.id);
        }
      }
    }

    await this.shippingSettingModel.updateOne(
      { _id: id },
      { $set: shippingSettingModel as ShippingSettingModel },
    ).exec();

    return this.settingService.findOneById(id);
  }

  public async findAll(): Promise<ShippingSettingModel[]> {

    return this.shippingSettingModel.find({ createdBy: CreatedByEnum.Admin } as any)
      .populate('products')
      .populate('origins')
      .populate('boxes')
      .populate('zones');
  }
}
