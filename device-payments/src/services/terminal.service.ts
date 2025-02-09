import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, TerminalModel } from '../interfaces';
import { TerminalSchemaName } from '../schemas';

/** @deprecated */
@Injectable()
export class TerminalService {
  constructor(
    @InjectModel(TerminalSchemaName)
    private readonly terminalModel: Model<TerminalModel>,
  ) { }

  public async getByChannelSet(channelSetId: string): Promise<TerminalModel> {
    return this.terminalModel.findOne({ channelSetId }).exec();
  }

  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {
    await this.terminalModel.deleteMany({ businessId: business._id }).exec();
  }
}
