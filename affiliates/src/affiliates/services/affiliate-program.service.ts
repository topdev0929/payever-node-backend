import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AffiliateProgramModel } from '../models';
import { Model } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';
import { EventDispatcher, EncryptionService } from '@pe/nest-kit';
import { v4 as uuid } from 'uuid';
import { AffiliateProgramDto, AffiliatesProgramQueryDto, CookieDataDto, TargetUrlDto } from '../dto';
import { AffiliateProgramSchemaName } from '../schemas';
import { ProductsService } from './product.service';
import { AffiliateProgramEventsEnum, AffiliateStatusEnum, AppliesToEnum, CommissionTypeEnum } from '../enums';
import { AffiliateProgramInterface, CookieDataInterface, TragetUrlResultInterface } from '../interfaces';
import { environment } from '../../environments';

@Injectable()
export class AffiliateProgramsService {
  constructor(
    @InjectModel(AffiliateProgramSchemaName) private readonly affiliateProgramModel: Model<AffiliateProgramModel>,
    private readonly productService: ProductsService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly encryptionService: EncryptionService,
  ) { }

  public async getByBusiness(business: BusinessModel)
  : Promise<AffiliateProgramModel[]> {
    return this.affiliateProgramModel.find({ business: business._id });
  }

  public async getByBranding(brandingId: string)
  : Promise<AffiliateProgramModel[]> {
    return this.affiliateProgramModel.find({ affiliateBranding: brandingId });
  }

  public async getForAdmin(query: AffiliatesProgramQueryDto): Promise<any> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    if (query.brandingIds) {
      conditions.affiliateBranding = { $in: query.brandingIds };
    }

    const documents: any = await this.affiliateProgramModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.affiliateProgramModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async create(business: BusinessModel, createAffiliateProgramDto: AffiliateProgramDto)
  : Promise<AffiliateProgramInterface & { applicationScopeElasticId: string; businessScopeElasticId: string }> {
    const folderId: string = createAffiliateProgramDto.parentFolderId;
    delete createAffiliateProgramDto.parentFolderId;

    const program: AffiliateProgramModel = {
      ...createAffiliateProgramDto as any,
      affiliates: [],
      business: business._id,
      products: [],
    };

    for (const product of createAffiliateProgramDto.products) {
      program.products.push((await this.productService.findOrCreate(business, product))._id);
    }

    const elasticIds: any = { 
      applicationScopeId: uuid(),
      businessScopeId: uuid(),
    };

    const affiliateProgram: AffiliateProgramModel = await this.affiliateProgramModel.create(program);
    await this.eventDispatcher.dispatch(
      AffiliateProgramEventsEnum.AffiliateProgramCreated,
      affiliateProgram,
      { parentFolderId: folderId, elasticIds },
    );

    return {
      ...affiliateProgram.toObject(),
      applicationScopeElasticId: elasticIds.applicationScopeId,
      businessScopeElasticId: elasticIds.businessScopeId,
    };
  }

  public async createDefault(business: BusinessModel, brandingId: string): 
  Promise<AffiliateProgramInterface & { applicationScopeElasticId: string; businessScopeElasticId: string }> {

    return this.create(business, { 
      affiliateBranding: brandingId,
      affiliates: [],
      appliesTo: AppliesToEnum.ALL_PRODUCTS,
      assets: 0,
      categories: [],
      channelSets: [],
      clicks: 0,
      commission: [],
      commissionType: CommissionTypeEnum.Amount,
      cookie: 0,
      currency: 'usd',
      inviteLink: '',
      name: 'Start Plan',
      products: [],
      programApi: '',
      status: AffiliateStatusEnum.UNACTIVE,
      url: '',
    } as any);
  }

  public async update(
    business: BusinessModel,
    programModel: AffiliateProgramModel,
    createAffiliateProgramDto: AffiliateProgramDto,
  ): Promise<AffiliateProgramModel> {
    const folderId: string = createAffiliateProgramDto.parentFolderId;
    delete createAffiliateProgramDto.parentFolderId;

    const program: AffiliateProgramModel = {
      ...createAffiliateProgramDto as any,
      products: [],
    };

    for (const product of createAffiliateProgramDto.products) {
      program.products.push((await this.productService.findOrCreate(business, product))._id);
    }

    await this.affiliateProgramModel.updateOne(
      { _id: programModel._id },
      {
        $set: program,
      },      
    ).exec();
    
    const affiliateProgram: AffiliateProgramModel = await this.affiliateProgramModel.findOne(         
      { _id: programModel._id },
    ).exec();

    await this.eventDispatcher.dispatch(
      AffiliateProgramEventsEnum.AffiliateProgramUpdated,
      affiliateProgram,
      folderId,
    );

    return affiliateProgram;
  }

  public async delete(affiliateProgram: AffiliateProgramModel): Promise<void> {
    await this.affiliateProgramModel.findByIdAndDelete(affiliateProgram._id).exec();

    await this.eventDispatcher.dispatch(AffiliateProgramEventsEnum.AffiliateProgramDeleted, affiliateProgram);
  }

  public async generateCookieData(dto: CookieDataDto): Promise<CookieDataInterface> {

    const affiliateProgram: AffiliateProgramModel = await this.affiliateProgramModel.findOne(         
      { _id: dto.affiliateProgramId },
    ).exec();

    const text: string = `${dto.affiliateId};${affiliateProgram._id};${affiliateProgram.business}`;

    const encryptedText: string = 
    await this.encryptionService.encryptWithSalt(text, environment.encryptionOptions.salt);

    return {
      affiliateId: dto.affiliateId,
      affiliateProgramId: affiliateProgram._id,
      cookieTime: affiliateProgram.cookie,
      hash: encryptedText,
      url: affiliateProgram.url,
    };
  }

  public async getCookieData(encryptedText: string): Promise<CookieDataInterface> {

    let affiliateId: string;
    let affiliateProgramId: string;

    try {
      const decryptedText: string = 
      await this.encryptionService.decryptWithSalt(encryptedText, environment.encryptionOptions.salt);

      affiliateId = decryptedText.split(';')[0];
      affiliateProgramId = decryptedText.split(';')[1];

    } catch (err) {
      throw new BadRequestException('Can\'t decrypt given text');
    }

    const affiliateProgram: AffiliateProgramModel = await this.affiliateProgramModel.findOne(         
      { _id: affiliateProgramId },
    ).exec();

    
    return {
      affiliateId,
      affiliateProgramId,
      cookieTime: affiliateProgram.cookie,
      hash: encryptedText,
      url: affiliateProgram.url,
    };
  }

  public async getTargetUrl(dto: TargetUrlDto): Promise<TragetUrlResultInterface> {
    const affiliateProgram: AffiliateProgramModel = await this.affiliateProgramModel.findOne(         
      { _id: dto.affiliateProgramId },
    ).exec();

    return {
      params: {
        pe_affiliate_id: dto.affiliateId,
        pe_affiliate_program: dto.affiliateProgramId,
      },
      type: HttpStatus.PERMANENT_REDIRECT,
      url: affiliateProgram.url,
    };
  }
}
