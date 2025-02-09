import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OptionDocument } from '../models/option.document';

@Injectable()
export class OptionsService {
  constructor(@InjectModel('Option') private readonly optionModel: Model<OptionDocument>) { }

  public async createOption(createData: Partial<OptionDocument>): Promise<OptionDocument> {
    return this.optionModel.create(createData as OptionDocument);
  }

  public async updateOption(id: string, updateData: Partial<OptionDocument>): Promise<OptionDocument> {
    const option: OptionDocument = await this.optionModel.findById(id);
    if (option) {
      Object.assign(option, updateData);
      await option.save();
    }

    return option;
  }

  public async deleteOption(id: string): Promise<OptionDocument> {
    const option: OptionDocument = await this.optionModel.findById(id);
    if (option) {
      await option.deleteOne();
    }

    return option;
  }

  public async getOption(id: string): Promise<OptionDocument> {
    return this.optionModel.findById(id);
  }

  public async getOptions(): Promise<OptionDocument[]> {
    return this.optionModel.find();
  }
}
