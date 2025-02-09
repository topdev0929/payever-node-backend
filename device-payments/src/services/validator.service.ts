import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDto } from '../dto';
import { ApplicationModel, BusinessInterface } from '../interfaces';
import { ApplicationSchemaName } from '../schemas';

@Injectable()
export class ValidatorService {
  constructor(
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
  ) { }

  public async checkPayment(business: BusinessInterface, dto: PaymentDto): Promise<void> {
    const apps: ApplicationModel[] = await this.applicationModel.find({ businessId: business._id }).exec();
    if (apps.length > 1 && !dto.terminal_id && !dto.application_id) {
      throw new BadRequestException('There are many applications in this business. ' +
        'Application id should be specified.');
    }
  }
}
