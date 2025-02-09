import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentDefinition } from 'mongoose';

import { BusinessLocalDocument as BusinessModel } from '../../projections/models';
import { CreateContentDto, UpdateContentDto } from '../dto';
import { ContentModel } from '../models';
import { ContentSchemaName } from '../schemas';
import { ContentDataService } from './content-data.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(ContentSchemaName) private readonly contentModel: Model<ContentModel>,
    private readonly contentDataService: ContentDataService,
  ) { }

  public async findAll(businessId: string): Promise<ContentModel[]> {
    return this.contentModel.find({
      businessId: { $in: [null, businessId] },
    });
  }

  public async create(dto: CreateContentDto): Promise<ContentModel> {
    return this.contentModel.create({
      ...dto,
      businessId: dto.business,
    });
  }

  public async update(content: ContentModel, dto: UpdateContentDto): Promise<ContentModel> {
    if (!content.businessId) {
      throw new ForbiddenException('You can only update business generated bot messsages');
    }

    return this.contentModel.findOneAndUpdate(
      {
        _id: content._id,
      },
      dto,
      {
        new: true,
      },
    );
  }

  public async remove(content: ContentModel): Promise<void> {
    if (!content) {
      throw new NotFoundException();
    }

    if (!content.businessId) {
      throw new ForbiddenException('You can only remove business generated bot messsages');
    }

    await this.contentModel.deleteOne({
      _id: content._id,
    });
  }

  public async selectContent(
    business: BusinessModel,
    content: ContentModel,
  ): Promise<DocumentDefinition<ContentModel> & { data?: any }> {
    if (content.name.toLowerCase() === 'shop') {
      const shops: any[] = await this.contentDataService.findAllShops(business);

      return {
        ...content.toObject(),
        data: shops,
      };
    }

    return content.toObject();
  }

}
