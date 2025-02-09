import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplicationModel, BusinessModel, CheckoutInterface } from '../interfaces';
import { ApplicationSchemaName, BusinessSchemaName } from '../schemas';
import { ApplicationEnum } from '../enum';
import { PhoneNumberService } from './phone-number.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationSchemaName)
    private readonly applicationModel: Model<ApplicationModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly phoneNumberService: PhoneNumberService,
  ) { }


  public async getByChannelSet(channelSetId: string): Promise<ApplicationModel> {
    return this.applicationModel.findOne({ channelSetId }).exec();
  }
  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {
    await this.applicationModel.deleteMany({ businessId: business._id }).exec();
  }
  public async deleteByApplicationId(applicationId: string): Promise<void> {
    await this.applicationModel.deleteOne({ applicationId }).exec();
  }
  public async setCheckout(channelSetId: string, checkoutId: string): Promise<void> {
    await this.applicationModel.updateOne(
      { channelSetId },
      {
        $set: { checkout: checkoutId },
      },
    ).exec();
  }

  public async findBusinessByCheckout(checkout: any): Promise<BusinessModel> {
    const application: ApplicationModel = await this.applicationModel.findOne({
      checkout: checkout,
    }).exec();

    if (!application) {
      return ;
    }

    return this.businessModel.findOne({
      'defaultApplications._id': application.applicationId,
    }).exec();
  }

  public async onApplicationEvent(data: any, type: ApplicationEnum): Promise<void> {
    let business: BusinessModel = await this.businessModel.findOne({
      _id: data.business.id,
      'defaultApplications.type': type,
    });
    if (!business) {
      business = await this.setBusiness(data.business.id, data.id, type);
    }

    await this.applicationModel.updateOne(
      { applicationId: data.id },
      {
        $set: {
          applicationId: data.id,
          businessId: data.business.id,
          channelSetId: data.channelSet.id || data.channelSet._id,
          name: data.name,
          type,
        },
      },
      {
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async setDefaultApplication(businessId: string, applicationId: string, type: ApplicationEnum): Promise<void> {
    const application: ApplicationModel = await this.applicationModel
      .findOne({ applicationId: applicationId })
      .populate('checkout').exec();

    await this.setBusiness(businessId, applicationId, type);

    if (
      application
      && application.checkout
      && (application.checkout as CheckoutInterface).phoneNumber) {
      await this.phoneNumberService
        .setupPhoneNumber((application.checkout as CheckoutInterface).phoneNumber, businessId);
    }
  }

  public async setBusiness(businessId: string, applicationId: string, type: ApplicationEnum): Promise<any> {
    await this.businessModel.findOneAndUpdate(
      {
        _id: businessId,
      },
      {
        $addToSet: {
          defaultApplications: [
            {
              _id: applicationId,
              type,
            },
          ],
        },
        $set: {
          businessId: businessId,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      }
    );
  }
}
