import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntercomService } from '@pe/nest-kit';
import { environment } from '../../../environments';
import { ContactEventDto } from '../dto';
import { ContactModel } from '../models';
import { ContactSchemaName } from '../schemas';

@Injectable()
export class ContactService {
  private baseUrl: string;
  constructor(
    @InjectModel(ContactSchemaName) private readonly contactModel: Model<ContactModel>,
    private readonly httpService: IntercomService,
  ) {
    this.baseUrl = environment.contactServiceUrl;
  }

  public async createOrUpdateContactFromEvent(data: ContactEventDto): Promise<ContactModel> {

    return this.contactModel.findOneAndUpdate(
      { _id: data.contact._id },
      {
        $set: {
          businessId: data.contact.businessId,
          fields: data.fields.map((a: any) => {
            return {
              name: a.field.name,
              value: a.value,
            };
          }),
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteContact(data: ContactEventDto): Promise<void> {
    await this.contactModel.deleteOne({ _id: data.contact._id }).exec();
  }

  public async count(businessId: string): Promise<number> {
    return this.contactModel.countDocuments( { businessId } );
  }

  public async getBusinessContacts(): Promise<any> {
    return this.contactModel.aggregate(
      [
        {
          '$match': {
            'businessId': {
              '$not': {
                '$eq': null,
              },
            },
          },
        }, {
          '$group': {
            '_id': '$businessId', 
            'contactsCount': {
              '$sum': 1,
            },
          },
        },
      ],
    );
  }

  public async getContactStatisticsByBusiness(businessId: string, token: string): Promise<any> {
    const request: any = (await this.httpService.get<{ unread: number }>(
      `${this.baseUrl}/api/folders/business/${businessId}/folder/items`,
      {
        headers: {
          Authorixation: `bearer ${token}`,
        },
      },
    )).toPromise();

    let data: any[] = (await request).data;
    if (data.length > 4) {
      data = data.slice(0, 4);
    }

    const result: any[] = [];
    for (const folder of data) {
      const items: ContactModel[] = await Promise.all(
        folder.items.map((item: any) => {
          return this.contactModel.findById(item._id);
        }),
      );

      result.push({ ...folder, items });
    }

    return result;
  }
}
