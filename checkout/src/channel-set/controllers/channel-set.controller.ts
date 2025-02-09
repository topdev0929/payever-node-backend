import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { CheckoutModel } from '../../checkout';
import { BusinessSchemaName, CheckoutSchemaName } from '../../mongoose-schema';
import { ChannelSetModel } from '../models';
import { ChannelSetService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';

@ApiTags('channelSet')
@Controller('business/:businessId/channelSet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class ChannelSetController {
  constructor(
    private readonly channelSetService: ChannelSetService,
  ) { }

  @Get()
  @Acl(
    { microservice: 'checkout', action: AclActionsEnum.read },
    { microservice: 'pos', action: AclActionsEnum.read },
  )
  public async getByBusiness(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
  ): Promise<any[]> {
    await business.populate('channelSets').execPopulate();
    const channelSets: ChannelSetModel[] = business.channelSets as ChannelSetModel[];

    return channelSets.map(
      (x: ChannelSetModel) => ({
        active: x.active,
        checkout: x.checkout,
        customPolicy: x.customPolicy ? x.customPolicy : false,
        id: x.id,
        name: x.name,
        policyEnabled: typeof x.policyEnabled === 'boolean' ? x.policyEnabled : true,
        subType: x.subType,
        type: x.type,
      }),
    );
  }

  @Get('type/:type/checkout/:checkoutId')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getByTypeAndCheckout(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: ':checkoutId',
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
    @Param('type') type: string,
  ): Promise<any[]> {
    const channelSets: ChannelSetModel[] = await this.channelSetService.findAllByTypeAndCheckout(type, checkout);

    return channelSets.map(
      (x: ChannelSetModel) => ({
        checkout: x.checkout,
        customPolicy: x.customPolicy ? x.customPolicy : false,
        id: x.id,
        name: x.name,
        policyEnabled: typeof x.policyEnabled === 'boolean' ? x.policyEnabled : true,
        subType: x.subType,
        type: x.type,
      }),
    );
  }

  @Get('checkout/:checkoutId')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getByCheckout(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: ':checkoutId',
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<any[]> {
    const channelSets: ChannelSetModel[] = await this.channelSetService.findAllByCheckout(checkout);

    return channelSets.map(
      (x: ChannelSetModel) => ({
        checkout: x.checkout,
        customPolicy: x.customPolicy ? x.customPolicy : false,
        id: x.id,
        name: x.name,
        policyEnabled: typeof x.policyEnabled === 'boolean' ? x.policyEnabled : true,
        subType: x.subType,
        type: x.type,
      }),
    );
  }
}
