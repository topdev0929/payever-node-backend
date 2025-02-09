import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingSettingSchemaName } from '../schemas';
import { ShippingBoxModel, ShippingOriginModel, ShippingSettingModel, ShippingZoneModel } from '../models';
import { ShippingBoxInterface, ShippingSettingInterface } from '../interfaces';
import { ShippingSettingDto } from '../dto';
import { ShippingBoxService } from './shipping-box.service';
import { BusinessModel } from '../../business';
import { ProductModel } from '../models/product.model';
import { ProductSchemaName } from '../schemas/product.schema';
import { ProductInterface } from '../interfaces/products.interface';
import { CreateShippingSettingDto } from '../dto/create-shipping-settings.dto';
import { ShippingOriginService } from './shipping-origin.service';
import { ShippingZoneService } from './shipping-zone.service';
import { CreatedByEnum, RateTypesEnums } from '../enums';
import { ShippingSettingEventsProducer } from '../producer/shipping-setting-events.producer';

@Injectable()
export class ShippingSettingService {
  constructor(
    private readonly shippingBoxService: ShippingBoxService,
    private readonly shippingOriginService: ShippingOriginService,
    private readonly shippingZoneService: ShippingZoneService,
    private readonly shippingSettingEventsProducer: ShippingSettingEventsProducer,
    @InjectModel(ShippingSettingSchemaName) private readonly shippingSettingModel: Model<ShippingSettingModel>,
    @InjectModel(ProductSchemaName) private readonly productModel: Model<ProductModel>,
  ) {
  }

  public async create(setting: ShippingSettingDto | CreateShippingSettingDto)
  : Promise<ShippingSettingModel> {
    const shippingSettingModel: ShippingSettingInterface = {
      ...setting,
      business: undefined,
      businessId: setting.business as string,
    };

    if ((await this.findByBusinessId(shippingSettingModel.businessId)).length === 0) {
      shippingSettingModel.isDefault = true;
    }

    if (setting.products) {
      shippingSettingModel.products = [];
      for (const product of setting.products) {
        const productData: ProductModel = await this.createOrUpdateProduct(product);
        if (productData) {
          shippingSettingModel.products.push(productData.id);
        }
      }
    }

    const settings: ShippingSettingModel =
      await this.shippingSettingModel.create(shippingSettingModel as ShippingSettingModel);

    await this.shippingSettingEventsProducer.produceSettingCreatedEvent(settings);

    return this.findOneById(settings.id);
  }

  public async createAutoProfile(business: BusinessModel): Promise<void> {
    const adminDefaults: ShippingSettingModel[]
      = await this.shippingSettingModel.find({ createdBy: CreatedByEnum.Admin } as any).exec();

    if (adminDefaults.length > 0) {
      for (const setting of adminDefaults) {
        const settingModel: ShippingSettingInterface = {
          boxes: setting.boxes,
          businessId: business.id,
          isDefault: adminDefaults.length === 1,
          name: setting.name,
          origins: setting.origins,
          products: setting.products,
          zones: setting.zones,
        };

        const shippingSetting: ShippingSettingModel = await this.shippingSettingModel.create({
          ...settingModel as ShippingSettingModel,
        });

        await this.shippingSettingEventsProducer.produceSettingCreatedEvent(shippingSetting);
      }

      return;
    }

    const origin: ShippingOriginModel = await this.shippingOriginService.create(
      {
        city: business.companyAddress?.city ? business.companyAddress.city : '-',
        countryCode: business.companyAddress?.country ? business.companyAddress.country : '-',
        isDefault: true,
        streetName: business.companyAddress?.street ? business.companyAddress.street : '-',
        streetNumber: '-',
        zipCode: business.companyAddress?.zipCode ? business.companyAddress.zipCode : '-',
      } as ShippingOriginModel,
    );

    const zone: ShippingZoneModel = await this.shippingZoneService.create(
      {
        countryCodes: business.companyAddress?.country ? [business.companyAddress.country] : [],
        name: business.name,
        rates: [
          {
            integration: null,
            name: 'Free shipping',
            ratePrice: 0,
            rateType: RateTypesEnums.Own,
          },
        ],
      },
      business.id,
    );

    const defaultBoxes: ShippingBoxModel[] = await this.shippingBoxService.getDefaultBoxes();
    const shippingSettingModel: ShippingSettingInterface = {
      boxes: defaultBoxes.map((box: ShippingBoxModel) => box._id),
      businessId: business.id,
      isDefault: true,
      name: business.name,
      origins: [ origin.id ],
      products: [],
      zones: [ zone.id ],
    };

    const settings: ShippingSettingModel = await this.shippingSettingModel.findOneAndUpdate(
      {
        businessId: business.id,
        isDefault: false,
        name: business.name,
      },
      {
        $set: shippingSettingModel as ShippingSettingModel,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    ).exec();

    await this.shippingSettingEventsProducer.produceSettingCreatedEvent(settings);
  }

  public async createOrUpdateProduct(product: ProductInterface): Promise<ProductModel> {
    const productModel: ProductModel = await this.productModel.findOne({ productId: product.productId }).exec();

    if (productModel) {
      await this.productModel.updateOne(
        { productId: product.productId },
        product,
      ).exec();
    } else {
      await this.productModel.create(product);
    }

    return this.productModel.findOne({ productId: product.productId });
  }

  public async findOneById(id: string): Promise<ShippingSettingModel> {

    return this.shippingSettingModel.findById(id)
      .populate('products')
      .populate('origins')
      .populate('boxes')
      .populate('zones');
  }

  public async findByBusinessId(businessId: string): Promise<ShippingSettingModel[]> {

    return this.shippingSettingModel.find({ businessId: businessId } as any)
      .populate('products')
      .populate('origins')
      .populate('boxes')
      .populate('zones');
  }

  public async findOrCreate(businessId: string): Promise<ShippingSettingModel> {
    const shippingSetting: ShippingSettingModel
      = await this.shippingSettingModel.findOne({ businessId: businessId } as any)
      .populate('products')
      .populate('origins')
      .populate('boxes')
      .populate('zones').exec();

    if (!shippingSetting) {
      const defaultBoxes: ShippingBoxModel[] = await this.shippingBoxService.getDefaultBoxes();
      const settingDto: ShippingSettingDto = new ShippingSettingDto();
      settingDto.business = businessId;
      settingDto.boxes = defaultBoxes.map((box: ShippingBoxModel) => box._id);
      settingDto.origins = [];
      settingDto.zones = [];
      settingDto.products = [];

      return this.create(settingDto);
    }

    return shippingSetting;
  }

  public async deleteOneById(id: string, businessId?: string): Promise<ShippingSettingModel> {
    const setting: ShippingSettingModel = await this.findOneById(id);
    if (businessId && setting.businessId !== businessId) {
      throw new BadRequestException('Shipping settings does not match with your business');
    }

    if (setting.isDefault) {
      throw new BadRequestException('Can not delete default shipping settings');
    }

    const settings: ShippingSettingModel = await this.shippingSettingModel.findOneAndDelete({ _id: id });

    await this.shippingSettingEventsProducer.produceSettingRemovedEvent(settings);

    return settings;    
  }

  public async update(id: string, setting: CreateShippingSettingDto): Promise<ShippingSettingModel> {
    const shippingSettingModel: ShippingSettingInterface = {
      ...setting,
      business: undefined,
      businessId: setting.business,
    };
    if (setting.products) {
      shippingSettingModel.products = [];
      for (const product of setting.products) {
        const productData: ProductModel = await this.createOrUpdateProduct(product as ProductInterface);
        if (productData) {
          shippingSettingModel.products.push(productData.id);
        }
      }
    }

    await this.shippingSettingModel.updateOne(
      { _id: id },
      { $set: shippingSettingModel as ShippingSettingModel },
    ).exec();

    
    const settings: ShippingSettingModel = await this.findOneById(id);
    await this.shippingSettingEventsProducer.produceSettingUpdatedEvent(settings); 

    return settings;
  }

  public async addShippingBox(
    shippingBoxModel: ShippingBoxModel,
    settingModel: ShippingSettingModel,
  ): Promise<ShippingSettingModel> {
    settingModel.boxes.push(shippingBoxModel.id);

    const settings: ShippingSettingModel = await settingModel.save();

    await this.shippingSettingEventsProducer.produceSettingUpdatedEvent(settings); 

    return settings;
  }

  public async removeShippingBox(
    shippingBoxModel: ShippingBoxModel,
    settingModel: ShippingSettingModel,
  ): Promise<ShippingSettingModel> {

    const settings: ShippingSettingModel = await this.shippingSettingModel.findByIdAndUpdate(
      settingModel.id,
      {
        $pull: {
          boxes: [shippingBoxModel.id],
        },
      },
    );

    await this.shippingSettingEventsProducer.produceSettingUpdatedEvent(settings); 

    return settings;
  }

  public async addShippingOrigin(
    shippingOriginModel: ShippingOriginModel,
    settingModel: ShippingSettingModel,
  ): Promise<ShippingSettingModel> {
    settingModel.origins.push(shippingOriginModel.id);
    await settingModel.populate('origins').execPopulate();

    const origins: ShippingOriginModel[] = settingModel.origins as ShippingOriginModel[];
    if (origins.findIndex((origin: ShippingOriginModel) => origin.isDefault) === -1) {
      await this.setBusinessDefaultOrigin(settingModel.businessId, shippingOriginModel._id);
    }

    const settings: ShippingSettingModel = await settingModel.save();

    await this.shippingSettingEventsProducer.produceSettingUpdatedEvent(settings); 

    return settings;
  }

  public async removeShippingOrigin(
    shippingOriginModel: ShippingOriginModel,
    settingModel: ShippingSettingModel,
  ): Promise<ShippingSettingModel> {

    const settings: ShippingSettingModel = await this.shippingSettingModel.findByIdAndUpdate(
      settingModel.id,
      {
        $pull: {
          origins: shippingOriginModel.id,
        },
      },
    );

    await this.shippingSettingEventsProducer.produceSettingUpdatedEvent(settings); 

    return settings;
  }

  public async addShippingZone(
    shippingZoneModel: ShippingZoneModel,
    settingModel: ShippingSettingModel,
  ): Promise<ShippingSettingModel> {
    settingModel.zones.push(shippingZoneModel.id);

    const settings: ShippingSettingModel = await settingModel.save();

    await this.shippingSettingEventsProducer.produceSettingUpdatedEvent(settings); 

    return settings;
  }

  public async removeShippingZone(
    shippingZoneModel: ShippingZoneModel,
    settingModel: ShippingSettingModel,
  ): Promise<ShippingSettingModel> {
    await settingModel.populate('zones').execPopulate();

    const settings: ShippingSettingModel = await this.shippingSettingModel.findByIdAndUpdate(
      settingModel.id,
      {
        $pull: {
          zones: shippingZoneModel.id,
        },
      },
    );

    await this.shippingSettingEventsProducer.produceSettingUpdatedEvent(settings); 

    return settings;
  }

  public async getWithBoxesAndOrigins(settingModel: ShippingSettingModel): Promise<ShippingSettingModel> {
    await settingModel
      .populate('origins')
      .populate('boxes')
      .populate('zones')
      .execPopulate();

    return settingModel;
  }

  public async getBoxesByBusinessId(businessId: string): Promise<ShippingBoxInterface[]> {
    const settingModel: ShippingSettingModel = await this.shippingSettingModel.findOne(
      { businessId: businessId },
    ).exec();
    await settingModel.populate('boxes').execPopulate();

    return settingModel.boxes;
  }

  public async getZonesByBusinessId(businessId: string): Promise<ShippingZoneModel[]> {
    const settingModel: ShippingSettingModel = await this.shippingSettingModel.findOne(
      { businessId: businessId } as any,
    ).populate('zones').exec();

    return settingModel.zones as ShippingZoneModel[];
  }

  public async getBusinessDefaultOriginId(businessId: string): Promise<string | undefined> {
    const settingModel: ShippingSettingModel = await this.shippingSettingModel.findOne(
      { businessId: businessId } as any,
    ).populate('origins').exec();
    const origins: ShippingOriginModel[] = settingModel.origins as ShippingOriginModel[];

    return (origins.find((origin: ShippingOriginModel) => origin.isDefault) || { })._id;
  }

  public async setBusinessDefaultOrigin(businessId: string, shippingOriginId: string): Promise<ShippingSettingModel> {
    await this.shippingOriginService.update(shippingOriginId, { isDefault: true } as any);

    const settings: ShippingSettingModel = await this.shippingSettingModel.findOneAndUpdate(
      { businessId },
      { $set: { defaultOrigin: shippingOriginId }},
    ).exec();

    await this.shippingSettingEventsProducer.produceSettingUpdatedEvent(settings); 

    return settings;
  }
}
