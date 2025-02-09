import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessModel, UserModel } from '../models';
import { BusinessEventsProducer } from '../producers';
import { BusinessSchemaName, UserSchemaName } from '../schemas';
import { BusinessService, BusinessExporterService } from '../services';

@Injectable()
export class BusinessExportCommand {
  constructor(
    @InjectModel(BusinessSchemaName)
    private readonly businessModel: Model<BusinessModel>,
    @InjectModel(UserSchemaName)
    private readonly userModel: Model<UserModel>,
    private readonly businessEventsProducer: BusinessEventsProducer,
    private readonly businessService: BusinessService,
    private readonly businessExporterService: BusinessExporterService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'business:export [--uuid] [--date-from]',
    describe: 'Export business through the bus',
  })
  public async businessExport(
    @Option({ name: 'uuid' }) businessId?: string,
    @Option({ name: 'date-from' }) dateFrom?: string,
  ): Promise<void> {
    if (businessId) {
      const business: BusinessModel = await this.businessModel.findById(businessId);
      if (!business) {
        throw Error(`Unable to find business: ${businessId}`);
      }

      await this.sendEvent(business);
    } else {
      const limit: number = 50;
      let start: number = 0;
      let businesses: BusinessModel[] = [];
      const filter: any = { };

      if (dateFrom) {
        filter.$or = [
          { createdAt: { $gte: dateFrom } },
          { updatedAt: { $gte: dateFrom } },
        ];
      }

      let processedCount: number = 0;
      const totalRecords: number = await this.businessModel.count(filter);
      this.logger.log({ message: `total business to export: ${totalRecords}` });

      while (processedCount < totalRecords) {
        businesses = await this.getWithLimit(start, limit, filter);
        start += limit;

        for (const business of businesses) {
          await this.sendEvent(business);
          processedCount++;
        }
        this.logger.log({ progress: `${processedCount}/${totalRecords}` });
      }

      this.logger.log({ message: `${processedCount} business exported.` });
    }
  }

  @Command({
    command: 'business:clean [--userid]',
    describe: 'Remove all business for user',
  })
  public async businessClean(
    @Option({
      name: 'userid',
    })
    userId: string,
  ): Promise<void> {
    if (userId) {
      const owner: UserModel = await this.userModel.findById(userId).exec();
      if (!owner) {
        throw Error(`Unable to find user: ${userId}`);
      }
      await this.businessService.removeBusinessesForOwner(owner);
    }
  }



  @Command({
    command: 'business:export-excel [--from] [--to] [--registration-origins]',
    describe: 'Create and send to email business in part of time',
  })
  public async sendBusinessExportEmail(
    @Option({ name: 'from' }) dateFrom?: string,
    @Option({ name: 'to' }) dateTo?: string,
    @Option({ name: 'registration-origins' }) registrationOriginString: string = null,
  ): Promise<void> {
    const registrationOrigins: string[] = this.parseRegistrationOrigins(registrationOriginString);
    let modifiedFrom: Date = null;
    let modifiedTo: Date = null;
    if (dateFrom && dateTo) {
      modifiedFrom = new Date(dateFrom);
      modifiedTo = new Date(dateTo);
      modifiedFrom.setUTCHours(0, 0, 0, 0);
      modifiedTo.setUTCHours(23, 59, 59, 999);
      if (modifiedFrom > modifiedTo) {
        throw new BadRequestException('Wrong date params');
      }
    }
    await this.businessExporterService.export(modifiedFrom, modifiedTo, registrationOrigins);
  }
  private async getWithLimit(
    start: number,
    limit: number,
    filter: any,
  ): Promise<BusinessModel[]> {
    return this.businessModel.find(filter, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }
  private parseRegistrationOrigins(registrationOriginString: string): string[] {
    const registrationOrigins: string[] = [];
    if (!registrationOriginString) {
      return registrationOrigins;
    }
    if (registrationOriginString.includes(',')) {
      registrationOrigins.push(...registrationOriginString.split(','));
    } else {
      registrationOrigins.push(registrationOriginString);
    }

    return registrationOrigins;
  }

  private async sendEvent(business: BusinessModel): Promise<void> {
    return this.businessEventsProducer.produceBusinessExportEvent(business);
  }
}
