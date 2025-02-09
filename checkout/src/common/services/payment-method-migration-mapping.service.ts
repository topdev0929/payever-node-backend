import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethodMigrationMappingSchemaName } from '../../mongoose-schema';
import { PaymentMethodMigrationMappingModel } from '../models';

@Injectable()
export class PaymentMethodMigrationMappingService {
  constructor(
    @InjectModel(PaymentMethodMigrationMappingSchemaName)
    private readonly paymentMethodMigrationMappingModel: Model<PaymentMethodMigrationMappingModel>,
  ) { }

  public async createPaymentMethodMapping(
    paymentMethodFrom: string,
    paymentMethodTo: string,
    businessId?: string,
    enabled: boolean = true,
  ): Promise<PaymentMethodMigrationMappingModel> {
    return this.paymentMethodMigrationMappingModel.create({
      businessId,
      enabled,
      paymentMethodFrom,
      paymentMethodTo,
    });
  }

  public async findPaymentMethodMappingForBusiness(
    paymentMethodFrom: string,
    paymentMethodTo: string,
    businessId: string = null,
  ): Promise<PaymentMethodMigrationMappingModel> {
    return this.paymentMethodMigrationMappingModel.findOne({
      businessId,
      paymentMethodFrom,
      paymentMethodTo,
    });
  }

  public async enablePaymentMethodMapping(
    paymentMethodMapping: PaymentMethodMigrationMappingModel,
  ): Promise<PaymentMethodMigrationMappingModel> {
    return this.paymentMethodMigrationMappingModel.findOneAndUpdate(
      {
        _id: paymentMethodMapping.id,
      },
      {
        $set: { enabled: true },
    });
  }

  public async disablePaymentMethodMapping(
    paymentMethodMapping: PaymentMethodMigrationMappingModel,
  ): Promise<PaymentMethodMigrationMappingModel> {
    return this.paymentMethodMigrationMappingModel.findOneAndUpdate(
      {
        _id: paymentMethodMapping.id,
      },
      {
        $set: { enabled: false },
      });
  }

  public async findEnabledPaymentMethodMapping(
    paymentMethod: string,
    businessId: string,
  ): Promise<PaymentMethodMigrationMappingModel> {
    return this.paymentMethodMigrationMappingModel.findOne({
      $or: [{ businessId: null }, { businessId }],
      enabled: true,
      paymentMethodFrom: paymentMethod,
    });
  }
}
