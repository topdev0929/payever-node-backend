import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingZoneSchemaName } from '../schemas';
import { CreateShippingZoneDto, UpdateShippingZoneDto } from '../dto';
import { ShippingZoneModel } from '../models';
import { ShippingZoneInterface } from '../interfaces';
import { ShippingZoneEventsProducer } from '../producer/shipping-zone-events.producer';

@Injectable()
export class ShippingZoneService {
  constructor(
    @InjectModel(ShippingZoneSchemaName) private readonly shippingZoneModel: Model<ShippingZoneModel>,
    private readonly shippingZoneEventsProducer: ShippingZoneEventsProducer,
  ) { }

  public async create(dto: CreateShippingZoneDto | ShippingZoneInterface, businessId: string): 
  Promise<ShippingZoneModel> {
    const zone: ShippingZoneModel = await this.shippingZoneModel.create(dto as ShippingZoneModel);
    await this.shippingZoneEventsProducer.produceZoneCreatedEvent(zone, businessId);
    
    return zone;
  }

  public async findOneById(id: string): Promise<ShippingZoneModel> {
    return this.shippingZoneModel.findById(id).exec();
  }

  public async deleteOneById(id: string, businessId: string): Promise<ShippingZoneModel> {
    const zone: ShippingZoneModel = await this.shippingZoneModel.findOneAndDelete({ _id: id });
    await this.shippingZoneEventsProducer.produceZoneRemovedEvent(zone, businessId);

    return zone;
  }

  public async update(id: string, dto: UpdateShippingZoneDto, businessId: string): Promise<ShippingZoneModel> {
    const zone: ShippingZoneModel = await this.shippingZoneModel
    .findOneAndUpdate({ _id: id }, { $set: dto as ShippingZoneModel }, { new: true }).exec();
    
    await this.shippingZoneEventsProducer.produceZoneUpdatedEvent(zone, businessId);

    return zone;
  }
}
