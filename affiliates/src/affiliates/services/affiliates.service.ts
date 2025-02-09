import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AffiliateDto } from '../dto';
import { AffiliateModel } from '../models';
import { Model } from 'mongoose';
import { AffiliateSchemaName } from '../schemas';

@Injectable()
export class AffiliatesService {
  constructor(
    @InjectModel(AffiliateSchemaName) private readonly affiliateModel: Model<AffiliateModel>,
  ) { }

  public async findOrCreate(createAffiliateDto: AffiliateDto): Promise<AffiliateModel> {
    const affiliate: AffiliateModel = await this.affiliateModel.findOne({
      email: createAffiliateDto.email.toLowerCase(),
    });

    if (affiliate) {
      return affiliate;
    }

    return this.create(createAffiliateDto);
  }

  private create(createAffiliateDto: AffiliateDto): Promise<AffiliateModel> {
    return this.affiliateModel.create({
      email: createAffiliateDto.email.toLowerCase(),
      firstName: createAffiliateDto.firstName,
      lastName: createAffiliateDto.lastName,
    });
  }
}
