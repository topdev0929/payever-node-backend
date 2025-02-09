import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from 'src/modules/business';
import { BusinessSchemaName, CampaignSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { CreateCampaignInput, UpdateCampaignInput } from '../classes';
import { AdminCampaignListDto, AdminCreateCampaignDto } from '../dto';
import { CampaignModel } from '../models';
import { CampaignService } from '../services';

const CAMPAIGN_PLACEHOLDER: string = ':campaignId';
const BUSINESS_PLACEHOLDER: string = ':businessId';

@Controller('admin/campaign')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin')
@ApiBearerAuth()
export class AdminCampaignController {
  constructor(
    private campaignService: CampaignService,
  ) { }

  @Get(CAMPAIGN_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': CAMPAIGN_PLACEHOLDER }, CampaignSchemaName) campaign: CampaignModel,
  ): Promise<CampaignModel> {

    return campaign;
  }

  @Get('list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: AdminCampaignListDto,
  ): Promise<any[]> {

    return this.campaignService.retrieveListForAdmin(dto);
  }

  @Post(BUSINESS_PLACEHOLDER)
  public async create(
    @Body() dto: AdminCreateCampaignDto,
    @ParamModel({ '_id': BUSINESS_PLACEHOLDER }, BusinessSchemaName) business: BusinessModel,
  ): Promise<CampaignModel> {

    return this.campaignService.createCampaign(business, dto as CreateCampaignInput);
  }

  @Patch(CAMPAIGN_PLACEHOLDER)
  public async update(
    @Param('campaignId') campaignId: string,
    @Body() dto: Partial<AdminCreateCampaignDto>,
  ): Promise<CampaignModel> {

    return this.campaignService.updateCampaign(campaignId, dto as UpdateCampaignInput);
  }

  @Delete(CAMPAIGN_PLACEHOLDER)
  public async delete(
    @Param('campaignId') campaignId: string,
  ): Promise<CampaignModel> {

    return this.campaignService.adminDelete(campaignId);
  }
}
