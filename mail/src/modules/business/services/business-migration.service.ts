import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MigrateBusinessDto } from '../dto';
import { BusinessModel } from '../models';

@Injectable()
export class BusinessMigrationService {
  public constructor(
    @InjectModel('Business') private readonly businessModel: Model<BusinessModel>,
  ) { }

  public async migrate(businessDto: MigrateBusinessDto): Promise<void> {
    try {
      await this.businessModel.create(businessDto as any);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
