import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessModel, BusinessSchemaName, BusinessService } from '@pe/business-kit';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { AppointmentAvailabilityService } from '../services';
@Injectable()
export class CreateDefaultAvailabilityCommand {
  constructor(
    private readonly businessService: BusinessService,
    private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
  ) { }

  @Command({ command: 'create-default:availability', describe: 'Create or update default availabilities' })
  public async createDefaultAvailability(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedBusinessesCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const businesses: BusinessModel[] = 
        await this.businessService.findAll({ }).sort([['createdAt', 1]]).limit(limit).skip(skip).exec();

      if (!businesses.length) {
        break;
      }
  
      for (const business of businesses) {
        await this.appointmentAvailabilityService.createDefault(business);
      }

      processedBusinessesCount += businesses.length;
      page++;
      Logger.log(`Processed ${processedBusinessesCount} businesses`);
    }
  }

}
