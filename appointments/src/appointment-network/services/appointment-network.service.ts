import { Injectable } from '@nestjs/common';
import { EventDispatcher } from '@pe/nest-kit';
import { InjectModel } from '@nestjs/mongoose';
import { AppointmentNetworkDto, AppWithAccessConfigDto } from '../dto';

import { AppointmentNetworkModel, AccessConfigModel, BusinessModel } from '../models';

import { Model } from 'mongoose';
import { AppointmentNetworkSchemaName } from '../schemas';
import { AppointmentNetworkEventsEnum } from '../enums';
import { AccessConfigService } from './access-config.service';
import { ValidateAppointmentNameResponseInterface } from '../interfaces';
import { DomainHelper } from '../helpers';
import { AppointmentNetworkQueryDto } from '../dto/appointment-network-query.dto';

@Injectable()
export class AppointmentNetworkService {
  constructor(
    @InjectModel(AppointmentNetworkSchemaName) 
    private readonly appointmentNetworkModel: Model<AppointmentNetworkModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly accessConfigService: AccessConfigService,
  ) { }

  public async getById(id: string)
  : Promise<AppointmentNetworkModel> {
    return this.appointmentNetworkModel.findOne({ _id: id });
  }

  public async getByBusiness(business: BusinessModel)
  : Promise<AppointmentNetworkModel[]> {
    return this.appointmentNetworkModel.find({ business: business._id });
  }

  public async getForAdmin(query: AppointmentNetworkQueryDto)
    : Promise<{ documents: AppointmentNetworkModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.business = { $in: query.businessIds };
    }

    const documents: AppointmentNetworkModel[] = await this.appointmentNetworkModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.appointmentNetworkModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async getDefault(business: BusinessModel)
  : Promise<AppointmentNetworkModel> {
    return this.appointmentNetworkModel.findOne({ business: business._id, isDefault: true });
  }

  public async appWithAccessConfig(
    appointmentNetworkId: string,
  ): Promise<AppWithAccessConfigDto> {
    const appointmentNetwork: AppointmentNetworkModel = await this.appointmentNetworkModel.findOne({ 
      _id: appointmentNetworkId, 
    });

    const accessConfig: AccessConfigModel = await this.accessConfigService.findOneByCondition({
      appointmentNetwork: appointmentNetworkId,
    });
    await appointmentNetwork.populate('business channelSet').execPopulate();

    return {
      ...appointmentNetwork.toObject(),
      accessConfig: accessConfig?.toObject(),
    };
  }

  public async setDefault(appointmentNetworkId: string, businessId: string): Promise<AppointmentNetworkModel> {

    await this.appointmentNetworkModel.updateMany(
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

    return this.appointmentNetworkModel.findOneAndUpdate(
      {
        _id: appointmentNetworkId,
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

  public async create(business: BusinessModel, createAppointmentNetworkDto: AppointmentNetworkDto)
  : Promise<AppointmentNetworkModel> {
    const networkNameAvailable: ValidateAppointmentNameResponseInterface = 
    await this.isNetworkNameAvailable(createAppointmentNetworkDto.name, business, null);

    if (!networkNameAvailable.result) {
      const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      createAppointmentNetworkDto.name = createAppointmentNetworkDto.name + '-' + suffix;
    }

    const appointmentNetwork: AppointmentNetworkModel = await this.appointmentNetworkModel.create({
      ...createAppointmentNetworkDto,
      business: business._id,
    });

    await this.eventDispatcher.dispatch(AppointmentNetworkEventsEnum.AppointmentNetworkCreated, appointmentNetwork);

    return appointmentNetwork;
  }

  public async update(
    network: AppointmentNetworkModel,
    createAppointmentNetworkDto: AppointmentNetworkDto,
    business: BusinessModel,
  ): Promise<AppointmentNetworkModel> {

    if (createAppointmentNetworkDto.name) {
      const networkNameAvailable: ValidateAppointmentNameResponseInterface = 
      await this.isNetworkNameAvailable(createAppointmentNetworkDto.name, business, network.id);

      if (!networkNameAvailable.result) {
        const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
        createAppointmentNetworkDto.name = createAppointmentNetworkDto.name + '-' + suffix;
      }
    }

    await this.appointmentNetworkModel.updateOne(        
      { _id: network._id },
      {
        $set: {
          ...createAppointmentNetworkDto,
        },
      },      
    );
    
    const appointmentNetwork: AppointmentNetworkModel = await this.appointmentNetworkModel.findOne(         
      { _id: network._id },
    );

    await this.eventDispatcher.dispatch(
      AppointmentNetworkEventsEnum.AppointmentNetworkUpdated, appointmentNetwork);

    return appointmentNetwork;
  }

  public async delete(appointmentNetwork: AppointmentNetworkModel): Promise<void> {
    await appointmentNetwork.remove();
    await this.eventDispatcher.dispatch(AppointmentNetworkEventsEnum.AppointmentNetworkRemoved, appointmentNetwork);
  }

  public async isNetworkNameAvailable(
    name: string,
    business: BusinessModel,
    networkId: string,
  ): Promise<ValidateAppointmentNameResponseInterface> {
    if (!name) {
      return {
        message: 'Name must be not empty',
        result: false,
      };
    }

    if (await this.isNameOccupied(name, business, networkId)) {
      return {
        message: `Appointment Network with name "${name}" already exists for business: "${business.id}"`,
        result: false,
      };
    }

    const domain: string = DomainHelper.nameToDomain(name);

    if (await this.accessConfigService.isDomainOccupied(domain, networkId)) {
      return {
        message: `Appointment Network with domain "${name}" already exists"`,
        result: false,
      };
    }

    if (await this.accessConfigService.isInternalDomainOccupied(domain, networkId)) {
      return {
        message: `Appointment Network with domain "${name}" already exists"`,
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
    const networkByName: AppointmentNetworkModel = await this.appointmentNetworkModel.findOne({
      business: business._id,
      name: name,
    }).exec();

    return networkByName && networkByName.id !== networkId;
  }
}
