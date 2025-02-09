import { Body, Controller, Get, NotFoundException, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { CheckoutModel, CheckoutSectionModel } from '../../checkout';
import { BusinessSchemaName, ChannelSetSchemaName } from '../../mongoose-schema';
import { ChannelSetCheckoutUpdateDto, ChannelSetUpdateDto } from '../dto';
import { ChannelSetModel } from '../models';
import { ChannelSetService } from '../services';
import { CheckoutDbService } from '../../common/services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const CHANNEL_SET_ID_PLACEHOLDER: string = ':channelSetId';

@ApiTags('channelSet')
@Controller('business/:businessId/channelSet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class ChannelSetCheckoutController {
  constructor(
    private readonly channelSetService: ChannelSetService,
    private readonly checkoutDbService: CheckoutDbService,
  ) { }

  @Get(':channelSetId/checkout')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getCheckoutByChannelSet(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(CHANNEL_SET_ID_PLACEHOLDER, ChannelSetSchemaName) channelSet: ChannelSetModel,
  ): Promise<CheckoutModel> {
    await business.populate('channelSets').execPopulate();
    const channelSets: ChannelSetModel[] = business.channelSets as ChannelSetModel[];
    if (!channelSets.some((x: ChannelSetModel) => x.id === channelSet.id)) {
      throw new NotFoundException(`ChannelSet with id '${channelSet.id}' doesn't belong to business '${business.id}'`);
    }

    await channelSet.populate('checkout').execPopulate();
    channelSet.checkout.sections.sort((a: CheckoutSectionModel, b: CheckoutSectionModel) => a.order - b.order);

    return channelSet.checkout;
  }

  @Patch(':channelSetId')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async updateChannelSet(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(CHANNEL_SET_ID_PLACEHOLDER, ChannelSetSchemaName) channelSet: ChannelSetModel,
    @Body() updateDto: ChannelSetUpdateDto,
  ): Promise<void> {
    await business.populate('channelSets').execPopulate();
    const channelSets: ChannelSetModel[] = business.channelSets as ChannelSetModel[];
    if (!channelSets.find((x: ChannelSetModel) => x._id === channelSet.id)) {
      throw new NotFoundException(`ChannelSet with id '${channelSet.id}' doesn't belong to business '${business.id}'`);
    }

    await this.channelSetService.createOrUpdateById(channelSet.id, updateDto);
  }

  @Patch(':channelSetId/checkout')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async attachCheckoutToChannelSet(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(CHANNEL_SET_ID_PLACEHOLDER, ChannelSetSchemaName) channelSet: ChannelSetModel,
    @Body() updateDto: ChannelSetCheckoutUpdateDto,
  ): Promise<void> {
    await business.populate('channelSets').execPopulate();
    const channelSets: ChannelSetModel[] = business.channelSets as ChannelSetModel[];
    if (!channelSets.find((x: ChannelSetModel) => x.id === channelSet.id)) {
      throw new NotFoundException(`ChannelSet with id '${channelSet.id}' doesn't belong to business '${business.id}'`);
    }

    const checkout: CheckoutModel = updateDto.checkoutId
      ? await this.checkoutDbService.findOneById(updateDto.checkoutId)
      : null
    ;

    if (checkout) {
      await business.populate('checkouts').execPopulate();
      const checkouts: CheckoutModel[] = business.checkouts as CheckoutModel[];
      if (!checkouts.find((x: CheckoutModel) => x.id === checkout.id)) {
        throw new NotFoundException(`Checkout with id '${checkout.id}' doesn't belong to business '${business.id}'`);
      }
    }

    await this.channelSetService.setCheckout(channelSet, checkout);
  }
}
