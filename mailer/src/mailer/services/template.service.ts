import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TemplateQueryDto } from '../dto/template';
import { AdminTemplateDto } from '../dto/template/admin-template.dto';
import { TemplateModel } from '../models';
import { TemplateSchemaName } from '../schemas';


@Injectable()
export class TemplateService {

  constructor(
    @InjectModel(TemplateSchemaName) private readonly templateModel: Model<TemplateModel>,
  ) { }

  public async getForAdmin(query: TemplateQueryDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const documents: TemplateModel[] = await this.templateModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total: number = await this.templateModel.count().exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async createForAdmin(dto: AdminTemplateDto): Promise<TemplateModel> {
    return this.templateModel.create(dto);
  }

  public async updateForAdmin(templateId: string, dto: AdminTemplateDto): Promise<TemplateModel> {
    return this.templateModel.findByIdAndUpdate(templateId, dto, { new: true });
  }

  public async deleteById(templateId: string): Promise<void> {
    await this.templateModel.findByIdAndDelete(templateId);
  }
}
