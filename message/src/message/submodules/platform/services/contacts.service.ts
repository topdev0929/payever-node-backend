import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentDefinition, FilterQuery, UpdateQuery, Query } from 'mongoose';
import { EventDispatcher } from '@pe/nest-kit';

import { ContactDocument } from '../model';
import { ContactSchemaName } from '../schemas/contact.schema';
import { EventOriginEnum } from '../../../enums';
import { MongooseRawResult } from '../../../interfaces';
import { InternalEventCodesEnum } from '../../../../common';


@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(ContactSchemaName)
    private readonly contactModel: Model<ContactDocument>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(
    data: DocumentDefinition<ContactDocument>,
    eventSource: EventOriginEnum,
  ): Promise<ContactDocument> {
    const contact: ContactDocument = await this.contactModel.create(data);
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.ContactCreated, contact, eventSource);

    return contact;
  }

  public async findById(_id: string): Promise<ContactDocument> {
    return this.contactModel.findById(_id);
  }

  public findOne(filter: FilterQuery<ContactDocument>): Query<ContactDocument, ContactDocument> {
    return this.contactModel.findOne(filter);
  }

  public find(filter: FilterQuery<ContactDocument>): Query<ContactDocument[], ContactDocument> {
    return this.contactModel.find(filter);
  }

  public async update(
    data: UpdateQuery<ContactDocument>,
    eventSource: EventOriginEnum,
  ): Promise<ContactDocument> {
    const updatedContact: ContactDocument = await this.contactModel.findByIdAndUpdate(data._id, data, {
      new: true,
    }).exec();
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.ContactUpdated, updatedContact, eventSource);

    return updatedContact;
  }

  public async updateOrCreate(
    data: UpdateQuery<ContactDocument>,
    eventSource: EventOriginEnum,
  ): Promise<ContactDocument> {
    const contactWriteRawResult: MongooseRawResult<ContactDocument> =
      (await this.contactModel.findByIdAndUpdate(data._id, data, {
        new: true,
        rawResult: true,
        upsert: true,
      }).exec()) as any;

    if (contactWriteRawResult.lastErrorObject.updatedExisting === true) {
      await this.eventDispatcher.dispatch(
        InternalEventCodesEnum.ContactUpdated,
        contactWriteRawResult.value,
        eventSource,
      );
    } else {
      await this.eventDispatcher.dispatch(
        InternalEventCodesEnum.ContactCreated,
        contactWriteRawResult.value,
        eventSource,
      );
    }

    return contactWriteRawResult.value;
  }

  public async delete(
    _id: string,
    eventSource: EventOriginEnum,
  ): Promise<ContactDocument> {
    const deletedContact: ContactDocument = await this.contactModel.findOneAndDelete({
      _id,
    }).exec();
    if (!deletedContact) {
      throw new NotFoundException(`Contact with _id "${_id}" not found`);
    }
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.ContactDeleted, deletedContact, eventSource);

    return deletedContact;
  }

  public async setStatus(
    statusDto: { business: string; contactId: string },
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.ContactStatus,
      statusDto,
      eventSource,
    );
  }
}
