import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BusinessModel } from '../../business';
import { ChannelSetModel, ChannelSetService } from '../../channel-set';
import { DeprecatedChannelEnum } from '../../legacy-api/enum';
import { CheckoutDbService } from './checkout-db.service';
import { CheckoutModel } from '../../checkout/models';
import { ApiCallInterface } from '../interfaces';

@Injectable()
export class ChannelSetRetriever {
  constructor(
    private readonly channelSetService: ChannelSetService,
    private readonly checkoutDbService: CheckoutDbService,
  ) { }

  public async getChannelSetFromApiCall(apiCall: ApiCallInterface, business: BusinessModel): Promise<ChannelSetModel> {
    let channelSet: ChannelSetModel;

    if (apiCall.channel_set_id) {
      channelSet = await this.channelSetService.findOneByIdOrOriginalId(apiCall.channel_set_id.toString());
      if (!channelSet) {
        throw new NotFoundException(`ChannelSet with id "${apiCall.channel_set_id}" not found`);
      }

      await channelSet.populate('checkout').execPopulate();
      if (channelSet.checkout.businessId !== apiCall.businessId) {
        throw new ForbiddenException(
          `Channel set "${apiCall.channel_set_id}" doesn't belong to business "${apiCall.businessId}"`,
        );
      }

      return channelSet;
    }

    const channelType: string = ChannelSetRetriever.mapOldChannelToNewOne(
      apiCall.channel
        ? apiCall.channel
        : 'shopware'
      ,
    );

    const defaultCheckout: CheckoutModel = await this.checkoutDbService.findDefaultForBusiness(business);

    if (apiCall.channel_type) {
      channelSet = await this.channelSetService.findSpecificSubTypeChannelSet(
        business,
        channelType,
        apiCall.channel_type,
        defaultCheckout,
      );

      if (!channelSet) {
        throw new NotFoundException(`ChannelSet with type "${apiCall.channel_type}" not found`);
      }

      return channelSet;
    }

    return this.channelSetService.findDefaultForBusiness(business, channelType, defaultCheckout);
  }

  private static mapOldChannelToNewOne(channelType: string): string {
    switch (channelType) {
      case DeprecatedChannelEnum.OLD_OTHER_SHOPSYSTEM_TYPE:
        return 'api';
      case DeprecatedChannelEnum.OLD_STORE_TYPE:
        return 'shop';
      case DeprecatedChannelEnum.OLD_WOO_COMMERCE_TYPE:
        return 'woo_commerce';
      default:
        return channelType;
    }
  }
}
