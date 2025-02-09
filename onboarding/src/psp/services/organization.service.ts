import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrganizationDto } from '../dto';
import { OrganizationModel, OrganizationBusinessModel } from '../models';
import { OrganizationBusinessSchemaName, OrganizationSchemaName } from '../schemas';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(OrganizationSchemaName) private readonly organizationModel: Model<OrganizationModel>,
    @InjectModel(OrganizationBusinessSchemaName)
    private readonly organizationBusinessModel: Model<OrganizationBusinessModel>,
  ) { }

  public async getBusinessesByOrganizationId(organizationId: string): Promise<OrganizationBusinessModel[]> {
    return this.organizationBusinessModel.find({ organizationId });
  }

  public async getBusinessByBusinessId(
    businessId: string,
  ): Promise<OrganizationBusinessModel[]> {
    return this.organizationBusinessModel.find({ businessId });
  }

  public async upsert(dto: OrganizationDto): Promise<any> {
    return this.organizationModel.findOneAndUpdate(
      {
        _id: dto._id,
      },
      {
        $set: dto,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  public async addBusinessToOrganization(
    organizationId: string,
    businessId: string,
  ): Promise<OrganizationBusinessModel> {
    return this.organizationBusinessModel.create({
      businessId,
      organizationId,
    });
  }

  public async removeBusinessFromOrganization(
    organizationId: string,
    businessId: string,
  ): Promise<OrganizationBusinessModel> {
    return this.organizationBusinessModel.findOneAndRemove({
      businessId,
      organizationId,
    });
  }
}
