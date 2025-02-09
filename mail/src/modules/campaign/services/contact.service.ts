import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import { ContactClass } from '../classes';
import { ContactModel } from '../models';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('Business') private businessModel: Model<BusinessModel>,
    @InjectModel('Contact') private contactModel: Model<ContactModel>,
  ) {
  }

  public async getContact(businessId: string): Promise<ContactModel> {
    return this.contactModel.findOne({
      business: businessId,
    });
  }

  public async setContact(business: BusinessModel, data: ContactClass): Promise<ContactModel> {
    return this.contactModel.findOneAndUpdate(
      {
        business: business.id,
      },
      {
        $set: data,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }
}
