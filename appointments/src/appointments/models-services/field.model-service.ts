import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Field, FieldDocument } from '../schemas';
import { BaseModelService } from '../../common';
import { EventDispatcher } from '@pe/nest-kit';

@Injectable()
export class FieldModelService extends BaseModelService<FieldDocument> {
  constructor(
    @InjectModel(Field.name)
      readonly fieldModel: Model<FieldDocument>,
    readonly eventDispatcher: EventDispatcher,
  ) {
    super(fieldModel, eventDispatcher);
  }
}
