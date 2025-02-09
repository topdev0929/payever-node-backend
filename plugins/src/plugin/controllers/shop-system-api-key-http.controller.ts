import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelModel } from '@pe/channels-sdk';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { ApiKeyDto } from '../dto';
import { ShopSystemModel } from '../models';
import { ShopSystemApiKeyService, ShopSystemService } from '../services';

@Controller('business/:businessId/shopsystem/type/:channelType/api-key')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('shopsystem')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ShopSystemApiKeyHttpController {
  public constructor(
    private readonly apiKeyService: ShopSystemApiKeyService,
    private readonly shopSystemService: ShopSystemService,
  ) { }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The channel-set has been successfully created.' })
  @Acl({ microservice: 'connect', action: AclActionsEnum.create })
  public async addApiKey(
    @ParamModel(':businessId', 'Business') business: BusinessModel,
    @ParamModel({ type: ':channelType' }, 'Channel') channel: ChannelModel,
    @Body() apiKeyDto: ApiKeyDto,
  ): Promise<void> {
    const shopSystem: ShopSystemModel = await this.shopSystemService.findOneByChannelAndBusiness(channel, business);
    if (!shopSystem) {
      throw new NotFoundException(
        `Shop system integration for business with id '${business.id}' `
        + `and channel of type '${channel.type}' not found'`,
      );
    }

    await this.apiKeyService.create(shopSystem, apiKeyDto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findAllByShopSystem(
    @ParamModel(':businessId', 'Business') business: BusinessModel,
    @ParamModel({ type: ':channelType' }, 'Channel') channel: ChannelModel,
  ): Promise<string[]> {
    const shopSystem: ShopSystemModel = await this.shopSystemService.findOneByChannelAndBusiness(channel, business);
    if (!shopSystem) {
      throw new NotFoundException(
        `Shop system integration for business with id '${business.id}' `
        + `and channel of type '${channel.type}' not found'`,
      );
    }

    return this.apiKeyService.findAllByShopSystem(shopSystem);
  }
}
