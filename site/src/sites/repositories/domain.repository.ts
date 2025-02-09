import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { DomainInterface } from '../interfaces';
import { DomainModel } from '../models';
import { DomainSchemaName } from '../schemas';
import { EventDispatcher } from '@pe/nest-kit';
import { KubernetesEventEnum } from '@pe/kubernetes-kit/module/kubernetes/enums';

/**
 * @source nodejs-backend/shop/src/shops/services/domain.service.ts
 */
@Injectable()
export class DomainRepository {
    constructor(
        @InjectModel(DomainSchemaName) private readonly domainModel: Model<DomainModel>,
        private readonly eventDispatcher: EventDispatcher,
    ) {

    }

    public async create(domain: DomainInterface): Promise<DomainModel> {
        const domainModel: DomainModel = await this.domainModel.create(domain);
        await this.eventDispatcher.dispatch(KubernetesEventEnum.DomainCreated, domainModel);

        return domainModel;
    }

    public async read(condition: FilterQuery<DomainModel>): Promise<DomainModel[]> {
        return this.domainModel.find(condition);
    }

    public async update(domain: UpdateQuery<DomainModel>): Promise<DomainModel> {
        const current: DomainModel = await this.domainModel.findById(domain._id).exec();
        const newDomain: DomainModel =  await this.domainModel.findByIdAndUpdate(domain._id, domain, {
            new: true,
        }).exec();
        await this.eventDispatcher.dispatch(KubernetesEventEnum.DomainUpdated, current, newDomain);

        return newDomain;
    }

    public async delete(domain: DomainModel): Promise<void> {
        await this.domainModel.deleteOne({
            _id: domain._id,
        }).exec();
        await this.eventDispatcher.dispatch(KubernetesEventEnum.DomainRemoved, domain);
    }
}
