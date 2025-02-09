import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model, QueryCursor } from 'mongoose';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BusinessDto, RemoveBusinessDto } from '../dto';
import { BusinessEventsEnums } from '../enums';
import { BusinessModel } from '../models';
import { BusinessSchemaName } from '../schemas';

export class BusinessService {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async remove(dto: RemoveBusinessDto): Promise<void> {
    const business: BusinessModel = await this.businessModel.findOneAndDelete({
      _id: dto._id,
    });

    await this.eventDispatcher.dispatch(BusinessEventsEnums.BusinessRemoved, business);
  }

  public async upsert(businessDto: BusinessDto): Promise<BusinessModel> {
    return this.businessModel.findOneAndUpdate(
      {
        _id: businessDto._id,
      },
      {
        $set: {
          companyAddress: businessDto.companyAddress,
          currency: businessDto.currency,
          defaultLanguage: businessDto.defaultLanguage,
          name: businessDto.name,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  public async  getById(businessId: string): Promise<BusinessModel> {
    return this.businessModel.findOne({
      _id: businessId,
    });
  }

  public async getListByCountry(country: string): Promise<BusinessModel[]> {
    return this.businessModel.find({
      'companyAddress.country': country,
    });
  }

  public findAllByBatch(batchSize: number): Observable<any> {
    const cursor: QueryCursor<BusinessModel> = this.businessModel
      .find({ })
      .cursor({ batchSize });

    return fromEvent(cursor, 'data')
      .pipe(
        takeUntil(
          fromEvent(cursor, 'end'),
        ),
      );
  }
}
