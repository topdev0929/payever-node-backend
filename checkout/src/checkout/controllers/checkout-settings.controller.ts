import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { ChannelSetModel, ChannelSetService } from '../../channel-set';
import { ChannelSetSchemaName } from '../../mongoose-schema';
import { FlowCheckoutConverter } from '../conventers';
import { SectionsService } from '../services';
import {
  CheckoutFlowBaseInterface,
  CheckoutFlowInterface,
  CheckoutFlowUiInterface,
  FullSettingResponseInterface,
} from '../interfaces';
import { SectionModel } from '../models';
import { CHANNEL_SET_ID } from '../../common/constants';
import { BusinessService } from '@pe/business-kit';
@Controller(`checkout/channel-set/${CHANNEL_SET_ID}`)
@ApiTags('checkout')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CheckoutSettingsController {
  constructor(
    private readonly flowCheckoutConverter: FlowCheckoutConverter,
    private readonly sectionsService: SectionsService,
    private readonly channelSetService: ChannelSetService,
    private readonly businessService: BusinessService,
  ) { }

  @Get('full-settings')
  @Roles(RolesEnum.anonymous)
  public async getFlowCheckoutByChannelSet(
    @ParamModel(CHANNEL_SET_ID, ChannelSetSchemaName) channelSet: ChannelSetModel,
  ): Promise<FullSettingResponseInterface> {
    return this.flowCheckoutConverter.fromChannelSetToCheckoutResponse(channelSet);
  }

  @Get('ui-settings')
  @Roles(RolesEnum.anonymous)
  public async getFlowCheckoutUiSettingsByChannelSet(
    @ParamModel(CHANNEL_SET_ID, ChannelSetSchemaName) channelSet: ChannelSetModel,
  ): Promise< CheckoutFlowUiInterface> {
    await channelSet.populate('checkout').execPopulate();
    if (!channelSet.checkout) {
      throw new NotFoundException(`ChannelSet "${channelSet.id}" has no checkout.`);
    }

    return this.flowCheckoutConverter.fromCheckoutToCheckoutFlowUIResponse(channelSet.checkout);
  }

  @Get('base-settings')
  @Roles(RolesEnum.anonymous)
  public async getFlowCheckoutBaseSettingsByChannelSet(
    @ParamModel(CHANNEL_SET_ID, ChannelSetSchemaName) channelSet: ChannelSetModel,
  ): Promise<CheckoutFlowBaseInterface & { channelType: string; customPolicy: boolean; policyEnabled: boolean }> {
    await channelSet.populate('checkout').execPopulate();
    if (!channelSet.checkout) {
      throw new NotFoundException(`ChannelSet "${channelSet.id}" has no checkout.`);
    }

    const flowCheckout: CheckoutFlowBaseInterface =
      await this.flowCheckoutConverter.fromCheckoutToCheckoutFlowBaseResponse(channelSet.checkout);

    return {
      ...flowCheckout,
      channelType: channelSet.type,
      customPolicy: channelSet.customPolicy ? channelSet.customPolicy : false,
      policyEnabled: typeof channelSet.policyEnabled === 'boolean' ? channelSet.policyEnabled : true,
    };
  }

  @Get('/sections/available')
  @Roles(RolesEnum.anonymous)
  public async getFlowCheckoutSectionsByChannelSet(
    @ParamModel(CHANNEL_SET_ID, ChannelSetSchemaName) channelSet: ChannelSetModel,
  ): Promise<SectionModel[]> {
    await channelSet.populate('checkout').execPopulate();
    if (!channelSet.checkout) {
      throw new NotFoundException(`ChannelSet "${channelSet.id}" has no checkout.`);
    }

    const business: BusinessModel = await this.channelSetService.getChannelSetBusiness(channelSet);

    return this.sectionsService.getAvailableSections(channelSet.checkout, business);
  }

  @Get('currency')
  @Roles(RolesEnum.anonymous)
  public async getChannelSetCurrency(
    @ParamModel(CHANNEL_SET_ID, ChannelSetSchemaName) channelSet: ChannelSetModel,
  ): Promise<{ currency: string }> {
    await channelSet.populate('checkout').execPopulate();
    if (!channelSet.checkout) {
      throw new NotFoundException(`ChannelSet "${channelSet.id}" has no checkout.`);
    }

    const business: BusinessModel = await this.channelSetService.getChannelSetBusiness(channelSet);

    return {
      currency: business.currency,
    };
  }
}
