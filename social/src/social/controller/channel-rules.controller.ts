import { Controller, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit';
import { BusinessSchemaName } from '../../business/schemas';
import { BusinessLocalModel } from '../../business/models';
import { ChannelSetService } from '../../channel-set/services';
import { ChannelSetModel } from '../../channel-set';
import { ChannelSetWithRulesDto } from '../dtos';
import { ThirdpartyRulesService } from '@pe/third-party-rules-sdk';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('business/:businessId/channel-rules')
@ApiTags('Channel Set')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class ChannelRulesController extends AbstractController {
  constructor(
    private readonly channelRulesService: ThirdpartyRulesService,
    private readonly channelSetService: ChannelSetService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async getAllChannelsWithRules(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessLocalModel,
  ): Promise<ChannelSetWithRulesDto[]> {
    const channelSets: ChannelSetModel[] = await this.channelSetService.findAllByBusiness(business);

    const result: ChannelSetWithRulesDto[] = [];
    for (const channelSet of channelSets) {
      result.push({
        channelSet,
        rules: await this.channelRulesService.getBy({ integrationName: channelSet.type }),
      });
    }

    return result;
  }
}
