// tslint:disable: no-dead-store
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { InstalledApp } from '../../models/interfaces/installed-app';
import { UuidDocument } from '../../models/interfaces/uuid-document';
import { BusinessModel } from '../../models/business.model';
import { DefaultAppsModel } from '../../models/default-apps.model';
import { BusinessDto, ThemeSettingsDto } from '../dto';
import { BusinessEvents } from '../enums';
import { NotifierService } from './notifier.service';
import { DefaultAppIds } from '../../environments';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel('Business') private readonly businessModel: Model<BusinessModel>,
    @InjectModel('DefaultApps') private readonly defaultAppsModel: Model<DefaultAppsModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly notifier: NotifierService,
  ) { }

  public async create(createBusinessDto: BusinessDto): Promise<BusinessModel> {

    let installedApps: any[] = [];

    const defaultApps: DefaultAppsModel = await this.defaultAppsModel.findById(DefaultAppIds.Business);
    if (defaultApps) {
      installedApps = defaultApps.installedApps as Types.DocumentArray<InstalledApp & UuidDocument>;
    }

    if (createBusinessDto?.companyDetails?.product === 'psp') {
      const pspDefaultApps: DefaultAppsModel = await this.defaultAppsModel.findById(DefaultAppIds.PSP);
      if (pspDefaultApps) {
        installedApps = [
          ...installedApps,
          ...pspDefaultApps.installedApps,
        ] as Types.DocumentArray<InstalledApp & UuidDocument>;
      }
    }

    const business: BusinessModel = await this.businessModel.findOneAndUpdate(
      { _id: createBusinessDto._id },
      {
        $addToSet: {
          installedApps: (defaultApps ?
            defaultApps.installedApps
            : []) as Types.DocumentArray<InstalledApp & UuidDocument>,
        },
        $set: {
          owner: createBusinessDto.owner,
          registrationOrigin: createBusinessDto.registrationOrigin,
          themeSettings: createBusinessDto.themeSettings,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );


    await this.eventDispatcher.dispatch(
      BusinessEvents.BusinessCreated,
      business,
    );

    return business;
  }

  public async update(updateDto: BusinessDto): Promise<BusinessModel> {
    return this.businessModel.findOneAndUpdate(
      {
        _id: updateDto._id,
      },
      {
        $set: {
          owner: updateDto.owner,
          themeSettings: {
            theme: updateDto.themeSettings.theme,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  public findOneById(businessId: string): Promise<BusinessModel> {
    return this.businessModel.findById(businessId).exec();
  }

  public getList(query: any, limit: number, skip: number): Promise<BusinessModel[]> {
    return this.businessModel
      .find(query)
      .limit(limit)
      .skip(skip)
      .exec();
  }

  public async deleteOneById(businessId: string): Promise<void> {
    const business: BusinessModel = await this.businessModel.findOneAndDelete({ _id: businessId });

    await this.eventDispatcher.dispatch(
      BusinessEvents.BusinessRemoved,
      business,
    );
  }

  // tslint:disable-next-line cognitive-complexity
  public async getOrCreate(
    id: string,
    defaultId: string,
    themeSettings: ThemeSettingsDto = null,
    registrationOrigin: string = null,
  ): Promise<BusinessModel> {
    let business: BusinessModel = await this.businessModel.findById(id);

    if (!business) {
      try {
        const defaultApps: DefaultAppsModel = await this.defaultAppsModel.findById(defaultId);

        business = await this.businessModel.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              installedApps: (defaultApps ?
                defaultApps.installedApps
                : []) as Types.DocumentArray<InstalledApp & UuidDocument>,
              registrationOrigin,
              themeSettings,
            },
          },
          {
            new: true,
            upsert: true,
          },
        );

        if (defaultApps) {
          await this.notifier.notifyTakeTourBatch(business, defaultApps.installedApps);
        }

      } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          business = await this.businessModel.findById(id);
        } else {
          throw err;
        }
      }
    }

    return business;
  }
}
