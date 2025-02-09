import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocalDeliverySchemaName, LocalPickUpSchemaName, ShippingOriginSchemaName } from '../schemas';
import { CreateShippingOriginDto, UpdateShippingOriginDto } from '../dto';
import { LocalDeliveryModel, LocalPickUpModel, ShippingOriginModel } from '../models';
import { ShippingOriginInterface } from '../interfaces';

@Injectable()
export class ShippingOriginService {
  constructor(
    @InjectModel(ShippingOriginSchemaName) private readonly shippingOriginModel: Model<ShippingOriginModel>,
    @InjectModel(LocalDeliverySchemaName) private readonly localDeliveryModel: Model<LocalDeliveryModel>,
    @InjectModel(LocalPickUpSchemaName) private readonly localPickUpModel: Model<LocalPickUpModel>,
  ) { }

  public async create(dto: CreateShippingOriginDto | ShippingOriginInterface): Promise<ShippingOriginModel> {
    const shippingOriginModel: ShippingOriginModel = await this.shippingOriginModel.create(dto as ShippingOriginModel);
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

  public async findOneById(id: string): Promise<ShippingOriginModel> {
    return this.shippingOriginModel.findById(id).exec();
  }

  public async deleteOneById(id: string): Promise<ShippingOriginModel> {
    return this.shippingOriginModel.findOneAndDelete({ _id: id });
  }

  public async update(id: string, dto: UpdateShippingOriginDto ): Promise<ShippingOriginModel> {
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
}
