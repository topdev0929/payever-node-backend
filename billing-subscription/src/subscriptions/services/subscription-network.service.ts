import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriptionNetworkDto, AppWithAccessConfigDto, SubscriptionNetworkQueryDto } from '../dto';

import { SubscriptionNetworkModel, AccessConfigModel } from '../models';

import { Model } from 'mongoose';
import { SubscriptionNetworkSchemaName } from '../schemas';
import { BusinessModel } from '../../business';
import { EventDispatcher } from '@pe/nest-kit';
import { SubscriptionNetworkEventsEnum } from '../enums';
import { AccessConfigService } from './access-config.service';
import { ValidateSubscriptionNameResponseInterface } from '../interfaces';
import { DomainHelper } from '../helpers';

@Injectable()
export class SubscriptionNetworkService {
  constructor(
    @InjectModel(SubscriptionNetworkSchemaName) 
    private readonly subscriptionNetworkModel: Model<SubscriptionNetworkModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly accessConfigService: AccessConfigService,
  ) { }

  public async getById(id: string)
  : Promise<SubscriptionNetworkModel> {
    return this.subscriptionNetworkModel.findOne({ _id: id });
  }

  public async getByBusiness(business: BusinessModel)
  : Promise<SubscriptionNetworkModel[]> {
    return this.subscriptionNetworkModel.find({ business: business._id });
  }

  public async getForAdmin(query: SubscriptionNetworkQueryDto)
    : Promise<{ documents: SubscriptionNetworkModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.business = { $in: query.businessIds };
    }

    const documents: SubscriptionNetworkModel[] = await this.subscriptionNetworkModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.subscriptionNetworkModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async getDefault(business: BusinessModel)
  : Promise<SubscriptionNetworkModel> {
    return this.subscriptionNetworkModel.findOne({ business: business._id, isDefault: true });
  }

  public async appWithAccessConfig(
    subscriptionNetworkId: string,
  ): Promise<AppWithAccessConfigDto> {
    const subscriptionNetwork: SubscriptionNetworkModel = await this.subscriptionNetworkModel.findOne({ 
      _id: subscriptionNetworkId, 
    });

    const accessConfig: AccessConfigModel = await this.accessConfigService.findOneByCondition({
      subscriptionNetwork: subscriptionNetworkId,
    });
    await subscriptionNetwork.populate('business channelSet').execPopulate();

    return {
      ...subscriptionNetwork.toObject(),
      accessConfig: accessConfig?.toObject(),
    };
  }

  public async setDefault(subscriptionNetworkId: string, businessId: string): Promise<SubscriptionNetworkModel> {

    await this.subscriptionNetworkModel.updateMany(
      {
        business: businessId,
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );

    return this.subscriptionNetworkModel.findOneAndUpdate(
      {
        _id: subscriptionNetworkId,
      },
      {
        $set: {
          isDefault: true,
        },
      },
      {
        new: true,
      },
    );
  }

  public async create(business: BusinessModel, createSubscriptionNetworkDto: SubscriptionNetworkDto)
  : Promise<SubscriptionNetworkModel> {
    const networkNameAvailable: ValidateSubscriptionNameResponseInterface = 
    await this.isNetworkNameAvailable(createSubscriptionNetworkDto.name, business, null);

    if (!networkNameAvailable.result) {
      const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      createSubscriptionNetworkDto.name = createSubscriptionNetworkDto.name + '-' + suffix;
    }

    const subscriptionNetwork: SubscriptionNetworkModel = await this.subscriptionNetworkModel.create({
      ...createSubscriptionNetworkDto,
      business: business._id,
    });

    await this.eventDispatcher.dispatch(SubscriptionNetworkEventsEnum.SubscriptionNetworkCreated, subscriptionNetwork);

    return subscriptionNetwork;
  }

  public async update(
    network: SubscriptionNetworkModel,
    createSubscriptionNetworkDto: SubscriptionNetworkDto,
    business: BusinessModel,
  ): Promise<SubscriptionNetworkModel> {

    if (createSubscriptionNetworkDto.name) {
      const networkNameAvailable: ValidateSubscriptionNameResponseInterface = 
      await this.isNetworkNameAvailable(createSubscriptionNetworkDto.name, business, network.id);

      if (!networkNameAvailable.result) {
        const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
        createSubscriptionNetworkDto.name = createSubscriptionNetworkDto.name + '-' + suffix;
      }
    }

    await this.subscriptionNetworkModel.updateOne(        
      { _id: network._id },
      {
        $set: {
          ...createSubscriptionNetworkDto,
        },
      },      
    );
    
    const subscriptionNetwork: SubscriptionNetworkModel = await this.subscriptionNetworkModel.findOne(         
      { _id: network._id },
    );

    await this.eventDispatcher.dispatch(
      SubscriptionNetworkEventsEnum.SubscriptionNetworkUpdated, subscriptionNetwork);

    return subscriptionNetwork;
  }

  public async delete(subscriptionNetwork: SubscriptionNetworkModel): Promise<void> {
    await subscriptionNetwork.remove();
    await this.eventDispatcher.dispatch(SubscriptionNetworkEventsEnum.SubscriptionNetworkRemoved, subscriptionNetwork);
  }

  public async isNetworkNameAvailable(
    name: string,
    business: BusinessModel,
    networkId: string,
  ): Promise<ValidateSubscriptionNameResponseInterface> {
    if (!name) {
      return {
        message: 'Name must be not empty',
        result: false,
      };
    }

    if (await this.isNameOccupied(name, business, networkId)) {
      return {
        message: `Subscription Network with name "${name}" already exists for business: "${business.id}"`,
        result: false,
      };
    }

    const domain: string = DomainHelper.nameToDomain(name);

    if (await this.accessConfigService.isDomainOccupied(domain, networkId)) {
      return {
        message: `Subscription Network with domain "${name}" already exists"`,
        result: false,
      };
    }

    if (await this.accessConfigService.isInternalDomainOccupied(domain, networkId)) {
      return {
        message: `Subscription Network with domain "${name}" already exists"`,
        result: false,
      };
    }

    return {
      result: true,
    };
  }

  private async isNameOccupied(
    name: string,
    business: BusinessModel,
    networkId: string,
  ): Promise<boolean> {
    const networkByName: SubscriptionNetworkModel = await this.subscriptionNetworkModel.findOne({
      business: business._id,
      name: name,
    }).exec();

    return networkByName && networkByName.id !== networkId;
  }
}
