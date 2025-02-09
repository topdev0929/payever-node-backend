import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TemplateInterface } from '../interfaces';
import { TemplateModel } from '../models';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel('Template') private readonly templateModel: Model<TemplateModel>,
  ) { }

  public async create(data: TemplateInterface): Promise<TemplateModel> {
    const existing: TemplateModel = await this.findByName(data.name);
    if (!existing) {
      return this.templateModel.create(data);
    }

    return this.templateModel.findOneAndUpdate(
      {
        name: data.name,
      },
      {
        $set: {
          config: data.config,
        },
      },
      {
        new: true,
      },
    );
  }

  public async findAll(): Promise<TemplateModel[]> {
    return this.templateModel.find();
  }

  public async findById(id: string): Promise<TemplateModel> {
    return this.templateModel.findById(id);
  }

  public async findByName(name: string): Promise<TemplateModel> {
    return this.templateModel.findOne({ name });
  }

  public async removeById(id: string): Promise<TemplateModel> {
    return this.templateModel.findByIdAndRemove(id);
  }

  public async removeByName(name: string): Promise<TemplateModel> {
    return this.templateModel.findOneAndRemove({ name });
  }
}
