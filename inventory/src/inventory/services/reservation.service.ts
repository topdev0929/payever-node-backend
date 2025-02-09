import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { ReservationSchemaName } from '../../environments/mongoose-schema.names';
import { InventoryQuantityChangeDto } from '../dto/inventory';
import { InventoryModel, ReservationModel } from '../models';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(ReservationSchemaName) private readonly reservationModel: Model<ReservationModel>,
  ) { }

  public async create(
    business: BusinessModel,
    inventory: InventoryModel,
    changeSet: InventoryQuantityChangeDto,
  ): Promise<ReservationModel> {
    return this.reservationModel.create({
      businessId: business.id,
      inventory: inventory.id,
      quantity: changeSet.quantity,
    });
  }

  public async updateQuantity(
    reservation: ReservationModel,
    changeSet: InventoryQuantityChangeDto,
  ): Promise<ReservationModel> {
    return this.reservationModel.findOneAndUpdate(
      {
        _id: reservation.id,
      },
      {
        $inc: {
          quantity: changeSet.quantity,
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async remove(
    reservation: ReservationModel,
  ): Promise<void> {
    await this.reservationModel.remove(
      {
        _id: reservation,
      },
    ).exec();
  }

  public async deleteAllByBusinessId(businessId: string): Promise<void> {
    await this.reservationModel.deleteMany({ businessId: businessId }).exec();
  }
}
