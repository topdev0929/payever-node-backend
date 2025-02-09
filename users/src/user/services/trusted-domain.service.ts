import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { CreateTrustedDomainDto, DeleteTrustedDomainDto } from '../dto';
import { TrustedDomainEventsEnum } from '../enums';
import { TrustedDomainInterface } from '../interfaces';
import { TrustedDomainModel } from '../models';
import { TrustedDomainSchemaName } from '../schemas';

@Injectable()
export class TrustedDomainService {

  constructor(
    @InjectModel(TrustedDomainSchemaName) private readonly domainModel: Model<TrustedDomainModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async getByBusiness(businessId: string): Promise<TrustedDomainInterface[]> {
    return this.domainModel.find({ businessId: businessId }).exec();
  }

  public async add(data: CreateTrustedDomainDto): Promise<void> {
    if (data.domain.includes('@')) {
      data.domain = data.domain.split('@').pop();
    }
    const createdModel: TrustedDomainInterface = await this.domainModel.create(data);
    await this.eventDispatcher.dispatch(TrustedDomainEventsEnum.TrustedDomainCreated, createdModel);
  }

  public async delete(data: DeleteTrustedDomainDto): Promise<void> {
    if (data.domain.includes('@')) {
      data.domain = data.domain.split('@').pop();
    }
    const deletedModel: TrustedDomainInterface = await this.domainModel.findOneAndDelete({
      businessId: data.businessId,
      domain: data.domain,
    }).exec();
    await this.eventDispatcher.dispatch(
      TrustedDomainEventsEnum.TrustedDomainRemoved,
      deletedModel,
    );
  }
}
