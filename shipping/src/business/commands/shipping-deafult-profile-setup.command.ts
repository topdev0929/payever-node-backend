import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { BusinessModel } from '../models';
import { BusinessSchemaName  } from '@pe/business-kit';
import { ShippingSettingModel, ShippingSettingService } from '../../shipping';

@Injectable()
export class ShippingDeafultProfileSetupCommand {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly shippingSettingService: ShippingSettingService,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity array-type */
  @Command({ command: 'shipping-default-profile:setup', describe: 'Setup default shipping profile' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedBusinessCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const businesses: BusinessModel[] =
        await this.businessModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip).exec();

      if (!businesses.length) {
        break;
      }

      let processedCount: number = 0;
      for (const business of businesses) {
        const profiles: ShippingSettingModel[] = 
          await this.shippingSettingService.findByBusinessId(business._id);
        
        if (profiles.length === 0) {
          await this.shippingSettingService.createAutoProfile(business);
          processedCount++;
        }
      }

      processedBusinessCount += businesses.length;
      page++;
      this.logger.log(
        'batch' + processedBusinessCount / 100  + ' - ' + processedCount + ' businesses were processed',
      );
    }

    this.logger.log(processedBusinessCount + ' businesses were processed');
  }
}
