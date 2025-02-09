import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ChannelSetServiceInterface,
  ChannelModel,
  ChannelService,
  ChannelSetModel,
  ChannelSubscriptionService,
  CHANNEL_SET_SERVICE,
} from '@pe/channels-sdk';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../business/models';
import { ShopSystemDto } from '../dto';
import { ShopSystemModel } from '../models';
import { ShopSystemService } from '../services';

@Controller('business/:businessId/shopsystem')
@UseGuards(JwtAuthGuard)
@ApiTags('shopsystem')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ShopSystemHttpController {
  public constructor(
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
    private readonly businessService: BusinessService,
    private readonly channelService: ChannelService,
    private readonly subscriptionService: ChannelSubscriptionService,
    private readonly shopSystemService: ShopSystemService,
  ) { }

  @Get(':shopSystemId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findOneById(
    @ParamModel(':shopSystemId', 'ShopSystem') shopSystem: ShopSystemModel,
  ): Promise<ShopSystemModel> {
    return shopSystem;
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({  microservice: 'connect', action: AclActionsEnum.read })
  public async findAllByBusiness(
    @ParamModel(':businessId', 'Business') business: BusinessModel,
  ): Promise<ShopSystemModel[]> {
    return this.shopSystemService.findAllByBusiness(business);
  }

  @Get('type/:channelType')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findOneByChannelAndBusiness(
    @ParamModel({ type: ':channelType' }, 'Channel') channel: ChannelModel,
    @ParamModel(':businessId', 'Business') business: BusinessModel,
  ): Promise<ShopSystemModel> {
    const shopSystem: ShopSystemModel = await this.shopSystemService.findOneByChannelAndBusiness(channel, business);
    if (!shopSystem) {
      throw new NotFoundException(
        `Shop system integration for business with id '${business.id}' `
        + `and channel of type '${channel.type}' not found'`,
      );
    }

    return shopSystem;
  }

  @Post('type/:channelType')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The shop system integration has been successfully created.' })
  @Acl({ microservice: 'connect', action: AclActionsEnum.create })
  public async create(
    @ParamModel({ type: ':channelType' }, 'Channel') channel: ChannelModel,
    @ParamModel(':businessId', 'Business') business: BusinessModel,
    @Body() shopSystemDto: ShopSystemDto,
  ): Promise<ShopSystemModel> {
    const channelSets: ChannelSetModel[] = await this.channelSetService.create(channel, business);
    const defaultChannelSet: ChannelSetModel = channelSets.shift();

    return this.shopSystemService.create(defaultChannelSet, channel, business);
  }

  @Delete(':shopSystemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    description: 'The shop system integration has been successfully deleted.',
    status: HttpStatus.NO_CONTENT,
  })
  @Acl({ microservice: 'connect', action: AclActionsEnum.delete })
  public async remove(
    @Param('shopSystemId') shopSystemId: string,
  ): Promise<void> {
    await this.shopSystemService.deleteOneById(shopSystemId);
  }
}
