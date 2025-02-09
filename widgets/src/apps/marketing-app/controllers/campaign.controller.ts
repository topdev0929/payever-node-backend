import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../../business/models';
import { MongooseModel as CommonMongooseModel } from '../../../common/enums';
import { CampaignModel } from '../models';

import { CampaignAppService } from '../services';

@Controller('campaign-app/business/:businessId')
@ApiTags('campaign')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class CampaignController {

  public constructor(
    private readonly campaignAppService: CampaignAppService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  public async retrieveLastDaily(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<CampaignModel[]> {
    const campaigns: CampaignModel[] = await this.campaignAppService.getLast(business);

    for (const campaign of campaigns) {
      await campaign.populate('channelSet').execPopulate();
    }

    return campaigns;
  }
}
