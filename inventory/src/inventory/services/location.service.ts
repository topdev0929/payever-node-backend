import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { LocationSchemaName } from '../../environments/mongoose-schema.names';
import { LocationModel } from '../models';
import { AdminLocationDto, CreateLocationDto, LocationQueryDto, UpdateLocationDto } from '../dto/location';
import { BusinessSchemaName, BusinessService } from '@pe/business-kit';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(LocationSchemaName) private locationModel: Model<LocationModel>,
    @InjectModel(BusinessSchemaName) private businessModel: Model<BusinessModel>,
  ) { }

  public async create(
    business: BusinessModel,
    dto: CreateLocationDto,
  ): Promise<LocationModel> {
    return this.locationModel.create({
      businessId: business.id,
      ...dto,
    } as LocationModel);
  }

  public async findAllByBusiness(business: BusinessModel): Promise<LocationModel[]> {
    return this.locationModel.find({ businessId: business._id });
  }

  public async getForAdmin(query: LocationQueryDto)
    : Promise<{ documents: LocationModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = Array.isArray(query.businessIds) ? { $in: query.businessIds } : query.businessIds;
    }

    const documents: LocationModel[] = await this.locationModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.locationModel.count(conditions);

    return {
      documents,
      page,
      total,
    };
  }

  public async createForAdmin(adminLocationDto: AdminLocationDto)
    : Promise<LocationModel> {
    const business: BusinessModel = await this.getBusinessById(adminLocationDto.businessId);

    return this.create(business, adminLocationDto);
  }

  public async updateForAdmin(locationId: string, adminLocationDto: AdminLocationDto)
    : Promise<LocationModel> {
    return this.locationModel.findOneAndUpdate(
      { _id: locationId },
      { $set: adminLocationDto },
      { new: true },
    );
  }

  public async update(location: LocationModel, dto: UpdateLocationDto): Promise<LocationModel> {
    return this.locationModel.findOneAndUpdate(
      { _id: location._id },
      { $set: dto },
      { new: true },
    );
  }

  public async delete(location: LocationModel): Promise<void> {
    await this.locationModel.deleteOne({ _id: location._id });
  }

  private async getBusinessById(businessId: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessModel.findById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return business;
  }
}

