import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminMimeTypeDto, MimeTypeQueryDto } from '../dto';
import { MimeTypeSchemaName } from '../schemas';
import { MimeTypeModel } from '../models';

@Injectable()
export class MimeTypeService {
  
  constructor(
    @InjectModel(MimeTypeSchemaName) private readonly mimeTypeModel: Model<MimeTypeModel>,
  ) { }

  public async getForAdmin(query: MimeTypeQueryDto)
    : Promise<{ documents: MimeTypeModel[]; page: number; total: number }> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.nameRegex) {
      conditions.name = { $regex: query.nameRegex };
    }

    if (query.name) { // exact name
      conditions.name = query.name;
    }

    if (query.group) {
      conditions.groups = query.group;
    }

    const documents: MimeTypeModel[] = await this.mimeTypeModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.mimeTypeModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async createForAdmin(dto: AdminMimeTypeDto): Promise<MimeTypeModel> {
    return this.mimeTypeModel.create(dto);
  }

  public async updateForAdmin(mimeTypeId: string, dto: AdminMimeTypeDto): Promise<MimeTypeModel> {
    return this.mimeTypeModel.findByIdAndUpdate(mimeTypeId, dto, { new: true });
  }

  public async deleteById(mimeTypeId: string): Promise<void> {
    await this.mimeTypeModel.findByIdAndDelete(mimeTypeId);
  }

  public async getAll(): Promise<MimeTypeModel[]> {
    return this.mimeTypeModel.find();
  }
}
