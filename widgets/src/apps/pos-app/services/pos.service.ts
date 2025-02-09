import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PosTerminalModel } from '../models';
import { Model } from 'mongoose';
import { PosTerminalEventDto } from '../dto';
import { PosTerminalSchemaName } from '../schemas';

@Injectable()
export class PosService {
  constructor(
    @InjectModel(PosTerminalSchemaName) private readonly posTerminalModel: Model<PosTerminalModel>,
  ) { }

  public async createOrUpdateTerminalFromEvent(data: PosTerminalEventDto): Promise<PosTerminalModel> {
    const businessId: string = data.business ? data.business.id : null;

    return this.posTerminalModel.findOneAndUpdate(
      { _id: data.id },
      {
        $set: {
          active: data.active,
          businessId,
          default: data.default,
          logo: data.logo,
          name: data.name,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteTerminal(data: PosTerminalEventDto): Promise<void> {
    await this.posTerminalModel.deleteOne({ _id: data.id }).exec();
  }

  public async getDefaultBusinessPosTerminal(businessId: string): Promise<PosTerminalModel> {
    return this.posTerminalModel.findOne({
      active: true,
      businessId,
    });
  }
}
