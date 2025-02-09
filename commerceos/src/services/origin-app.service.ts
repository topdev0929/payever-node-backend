import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OriginAppModel } from '../models/origin-app.model';
import { OriginApp } from '../models/interfaces/origin-app';
import { BusinessService } from '../business/services';
import { BusinessModel } from '../models/business.model';

@Injectable()
export class OriginAppService {

  constructor(
    @InjectModel('OriginApps') private readonly originAppModel: Model<OriginAppModel>,
    private readonly businessService: BusinessService,
  ) {

  }

  public async findAppIdsByOrigin(registeredOrigin: string): Promise<string[] | null> {
    if (!registeredOrigin) {
      return null;
    }

    const originApp: OriginApp = await this.originAppModel.findById({ _id: registeredOrigin });

    if (originApp && originApp.defaultApps && originApp.defaultApps.length !== 0) {
      return originApp.defaultApps || [];
    }

    return null;
  }

  public async findAppIdsByBusiness(businessId: string): Promise<string[] | null> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    if (!business || !business.registrationOrigin) {
      return null;
    }

    return  this.findAppIdsByOrigin(business.registrationOrigin);
  }

  public async isAppAvailableForOrigin(appId: string, origin: string): Promise<boolean> {
    return this.findAppIdsByOrigin(origin).then((apps: string[] | null) => apps ? apps.includes(appId) : true);
  }
}
