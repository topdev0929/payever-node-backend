/* eslint-disable sonarjs/prefer-single-boolean-return */
import { BadRequestException, HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosResponse } from 'axios';
import { ChannelSetModel } from '../models';
import { BusinessModel } from '../../business/models';
import { ChannelSetSchemaName } from '../schemas';
import { ShippingZoneInterface } from '../../shipping/interfaces/shipping-zone.interface';
import { ShippingRateInterface } from '../../shipping/interfaces/shipping-rate.interface';
import { IntegrationSubscriptionModel } from '../../integration/models/integration-subscription.model';
import { ShippingMethodInterface } from '../../shipping/interfaces/shipping-method.interface';
import { environment } from '../../environments';
import { ShippingProductItemDto } from '../dto';
import { RateResponseInterface } from '../../integration';
import {
  AddressDto,
  CreateShippingOrderDto,
  ShippingBoxInterface,
  ShippingOrderModel,
  ShippingOrderService,
  ShippingOriginModel,
  ShippingOriginService,
  ShippingSettingService,
} from '../../shipping';
import { PackageCalculator } from '../../common';
import { IntegrationsEnum } from '../enums';
import { BusinessService } from '@pe/business-kit';
import { BusinessServiceLocal } from '../../business';

@Injectable()
export class ChannelSetService {
  constructor(
    @InjectModel(ChannelSetSchemaName) private readonly channelSetModel: Model<ChannelSetModel>,
    private readonly http: HttpService,
    private readonly businessService: BusinessService,
    private readonly shippingSettingService: ShippingSettingService,
    private readonly shippingOrderService: ShippingOrderService,
    private readonly shippingOriginService: ShippingOriginService,
    private readonly businessServiceLocal: BusinessServiceLocal,
  ) { }

  public async create(channelSet: ChannelSetModel): Promise<ChannelSetModel> {

    return this.channelSetModel.create(channelSet);
  }

  public async remove(id: string): Promise<any> {

    return this.channelSetModel.remove({ _id: id });
  }

  public async findOneById(id: string): Promise<ChannelSetModel> {

    return this.channelSetModel.findOne({ _id: id });
  }

  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {
    await this.channelSetModel.deleteMany({ businessId: business._id });
  }

  public async getThirdPartyShippingMethods(
    subscriptions: IntegrationSubscriptionModel[], 
    business: BusinessModel,
  ): Promise<ShippingMethodInterface[]> {
    const shippingMethods: ShippingMethodInterface[] = [];

    for (const subscription of subscriptions) {
      const response: AxiosResponse<any> = await this.http.get<any>(
        this.getThirdPartyShippingUrl(business._id, subscription.integration.name),
      ).toPromise();


      shippingMethods.push({
        business,
        businessId: business._id,
        currency: response.data.currency,
        icon: subscription.integration.displayOptions.icon || null,
        integration: subscription.integration.id || null,
        integrationRule: null,
        integrationSubscriptionId: subscription._id || null,
        name: subscription.integration.name,
        rate: response.data.rate,
      } as ShippingMethodInterface);
    }

    return shippingMethods;
  }

  public collectShippingMethods(
    zones: ShippingZoneInterface[],
    orderTotal: number,
    totalWeight: number,
    subscriptions: IntegrationSubscriptionModel[],
    business: BusinessModel,
  ): ShippingMethodInterface[] {

    const shippingMethods: ShippingMethodInterface[] = [];
    zones.forEach((zone: ShippingZoneInterface) => {
      const eligibleDatas: ShippingRateInterface[] = zone.rates.filter((rate: ShippingRateInterface) => {
        if (
          (rate.maxPrice && rate.maxPrice < orderTotal)
          || (rate.minPrice && rate.minPrice > orderTotal)
          || (rate.maxWeight && rate.maxWeight < totalWeight)
          || (rate.minWeight && rate.minWeight > totalWeight)
        ) {
          return false;
        }

        return true;
      });
      this.processEligableDate(eligibleDatas, subscriptions, business, shippingMethods);
    });

    return shippingMethods;
  }

  public async getMethods(
      channelSet: ChannelSetModel,
      shippingAddress: AddressDto,
      shippingItems: ShippingProductItemDto[],
  ): Promise<RateResponseInterface> {
    await channelSet.populate('business').execPopulate();
    if (!channelSet.business) {
      throw new NotFoundException('shipping.errors.business.notfound');
    }
    const business: BusinessModel =
        await this.businessService.findOneById(channelSet.businessId) as BusinessModel;
    const defaultOriginId: string = await this.shippingSettingService.getBusinessDefaultOriginId(business._id);
    if (!defaultOriginId) {
      throw new NotFoundException('shipping.errors.business.defaultorigin.notfound');
    }
    const shippingZones: ShippingZoneInterface[] = await this.shippingSettingService
        .getZonesByBusinessId(business._id);
    const zones: ShippingZoneInterface[] = shippingZones
        .filter((z: ShippingZoneInterface) => z.countryCodes.indexOf(shippingAddress.countryCode) > -1);
    const shippingOrigin: ShippingOriginModel = await this.shippingOriginService.findOneById(defaultOriginId);
    const subscriptions: IntegrationSubscriptionModel[] = await this.businessServiceLocal
        .activeIntegrationSubscriptions(business);
    const customIntegrationSubscripton: IntegrationSubscriptionModel = subscriptions
        .find((subscription: IntegrationSubscriptionModel) => subscription.integration.name === 'custom');
    if (customIntegrationSubscripton && zones.length === 0) {
      throw new BadRequestException('shipping.errors.country.notsupported');
    }
    if (shippingItems.length === 0) {
      throw new BadRequestException('shipping.errors.items.empty');
    }
    const shippingBoxes: ShippingBoxInterface[] = await this.shippingSettingService
        .getBoxesByBusinessId(business._id);
    const shippingBox: ShippingBoxInterface = PackageCalculator.calculate(shippingBoxes, shippingItems);
    const { orderTotal, totalWeight }: { orderTotal: number; totalWeight: number } = shippingItems
        .map((item: ShippingProductItemDto) =>
            ({ orderTotal: item.price * item.quantity, totalWeight: item.weight * item.quantity}))
        .reduce((a: any, b: any) =>
                ({
                  orderTotal: a.orderTotal + b.orderTotal,
                  totalWeight: a.totalWeight + b.totalWeight,
                }),
            { orderTotal: 0, totalWeight: 0 },
        );

    const customIntegrations: IntegrationSubscriptionModel[] = subscriptions
        .filter(
            (subscription: IntegrationSubscriptionModel) => subscription.integration.name === IntegrationsEnum.Custom,
        );

    const thirdPartyIntegrations: IntegrationSubscriptionModel[] = subscriptions
        .filter(
            (subscription: IntegrationSubscriptionModel) => subscription.integration.name !== IntegrationsEnum.Custom,
        );

    const customShippingMethods: ShippingMethodInterface[] = this.collectShippingMethods(
        zones,
        orderTotal,
        totalWeight,
        customIntegrations,
        business,
    );

    const thirdPartyShippingMethods: ShippingMethodInterface[] = await this.getThirdPartyShippingMethods(
            thirdPartyIntegrations,
            business,
        );

    const shippingMethods: ShippingMethodInterface[] = [...customShippingMethods, ...thirdPartyShippingMethods];

    if (shippingMethods.length === 0) {
      throw new NotFoundException('shipping.errors.noanymethod');
    }
    if (customIntegrationSubscripton) {
      const customIntegrationSubscriptionMethod: ShippingMethodInterface = shippingMethods
          .find((method: ShippingMethodInterface) =>
              method.business.integrationSubscriptions.find(
                  (subscription: IntegrationSubscriptionModel) => subscription._id === customIntegrationSubscripton._id,
              ));
      if (!customIntegrationSubscriptionMethod.integrationRule) {
        throw new NotFoundException('shipping.errors.nomatchedrules');
      }
    }

    const shippingOrderDto: CreateShippingOrderDto = new CreateShippingOrderDto();
    shippingOrderDto.business = business._id;
    shippingOrderDto.businessId = business._id;
    shippingOrderDto.shippingOrigin = shippingOrigin;
    shippingOrderDto.shippingMethod = shippingMethods[0];
    shippingOrderDto.shippingItems = shippingItems;
    shippingOrderDto.shippingBoxes = [shippingBox];
    shippingOrderDto.shippingAddress = shippingAddress;
    const shippingOrderModel: ShippingOrderModel = await this.shippingOrderService.create(shippingOrderDto);

    return {
      methods: shippingMethods,
      shippingOrderId: shippingOrderModel._id,
    } as RateResponseInterface;
  }

  private processEligableDate(
      eligibleDatas: ShippingRateInterface[],
      subscriptions: IntegrationSubscriptionModel[],
      business: BusinessModel,
      shippingMethods: ShippingMethodInterface[],
  ): ShippingMethodInterface[] {

    eligibleDatas.forEach((eligibleData: ShippingRateInterface) => {
      const integrationSubscription: IntegrationSubscriptionModel
          = subscriptions.find((sub: IntegrationSubscriptionModel) => {
        return eligibleData.integration ? sub.integration.name === eligibleData.integration.name : false;
      });
      shippingMethods.push({
        business,
        businessId: business._id,
        currency: '',
        icon: integrationSubscription ? integrationSubscription.integration.displayOptions.icon : null,
        integration: integrationSubscription ? integrationSubscription.integration.id : null,
        integrationRule: null,
        integrationSubscriptionId: integrationSubscription ? integrationSubscription._id : null,
        name: eligibleData.integration ? eligibleData.integration.name : eligibleData.name,
        rate: eligibleData.integration ? eligibleData.integration.flatAmount : eligibleData.ratePrice,
        serviceCode: eligibleData.serviceCode,
      } as ShippingMethodInterface);
    });

    return shippingMethods;
  }

  private getThirdPartyShippingUrl(businessId: string, integrationName: string): string {
    return `${environment.thirdPartyShippingMicroUrl}/api/business/${businessId}/shipping/${integrationName}/rates`;
  }
}
