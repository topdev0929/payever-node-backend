import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessModel } from '../../src/business';
import { ChannelSetModel } from '../../src/channel-set';
import {
  CheckoutIntegrationSubModel,
  CheckoutInterface,
  CheckoutModel,
  CheckoutSectionInterface,
  CheckoutSectionModel,
  CheckoutSettingsInterface,
} from '../../src/checkout';
import { FlowModel, FlowSchemaName } from '../../src/flow';
import { BusinessIntegrationSubModel, CheckoutSection, IntegrationModel } from '../../src/integration';
import {
  BusinessSchemaName,
  ChannelSetSchemaName,
  CheckoutIntegrationSubSchemaName,
  CheckoutSchemaName,
  IntegrationSchemaName,
  SectionSchemaName,
} from '../../src/mongoose-schema';

class FixtureCreatorHelper {
  public static integrationCreated: number = 0;
  public static checkoutsCreated: number = 0;

  public static async createBusiness(
    businessModel: Model<BusinessModel>,
    integrationModel: Model<IntegrationModel>,
    subscriptionModel: Model<BusinessIntegrationSubModel>,
    businessId: string,
    integrationCategory: string,
    subscriptionsCount: number,
    isEnabledSubscription: boolean = true,
  ): Promise<BusinessModel> {
    for (let i: number = 0; i < subscriptionsCount; i++) {
      await FixtureCreatorHelper.createBusinessIntegrationSub(
        integrationModel,
        subscriptionModel,
        integrationCategory,
        businessId,
        isEnabledSubscription,
      );
    }

    return businessModel.create({
      _id: businessId,
      channelSets: [],
      currency: 'USD',
      name: 'testB',
    } as BusinessModel);
  }

  public static async createIntegration(
    model: Model<IntegrationModel>,
    name: string,
    category: string,
  ): Promise<IntegrationModel> {
    return model.create({
      _id: name,
      category: category,
      displayOptions: {
        icon: '#icon-payment-option-santander1',
        title: 'integrations.payments.santander_pos_installment.title1',
      },
      name: name,
      settingsOptions: {
        source: 'source',
      },
    } as IntegrationModel);
  }

  public static async createCheckout({
    businessModel,
    integrationModel,
    subscriptionModel,
    sectionModel,
    checkoutModel,
    chanelSetModel,
    businessId,
    checkoutId,
    nameTemplate,
    count,
    addChannel = false,
    isDefault = false,
  }: {
    businessModel: Model<BusinessModel>;
    integrationModel: Model<IntegrationModel>;
    subscriptionModel: Model<CheckoutIntegrationSubModel>;
    sectionModel: Model<CheckoutSectionModel>;
    checkoutModel: Model<CheckoutModel>;
    chanelSetModel: Model<ChannelSetModel>;
    businessId: string;
    checkoutId: string;
    nameTemplate: string;
    count: number;
    addChannel?: boolean;
    isDefault?: boolean;
  }): Promise<CheckoutModel[]> {
    await FixtureCreatorHelper.createCheckoutIntegrationSub(
      integrationModel,
      subscriptionModel,
      nameTemplate,
      checkoutId,
    );

    const businessSubscriptions: BusinessIntegrationSubModel[] = [];
    businessSubscriptions.push(
      await FixtureCreatorHelper.createBusinessIntegrationSub(
        integrationModel,
        subscriptionModel,
        nameTemplate,
        businessId,
      ),
    );

    const status: CheckoutSectionInterface = await sectionModel.create({
      code: CheckoutSection.Payment,
      enabled: true,
      order: 1,
    } as CheckoutSectionModel);

    const checkouts: CheckoutModel[] = [];
    for (let i: number = 0; i < count; i++) {
      const name: string =
        nameTemplate + (
          FixtureCreatorHelper.checkoutsCreated++ > 0
            ? FixtureCreatorHelper.checkoutsCreated.toString()
            : ''
        );
      const id: string = i > 0 ? checkoutId + i : checkoutId;
      const createdModel: CheckoutModel = await checkoutModel.create(
        {
          _id: id,
          businessId: businessId,
          connections: [],
          default: isDefault,
          name: name,
          sections: [status],
          settings: {
            message: 'Hello!',
            testingMode: true,
          } as CheckoutSettingsInterface,
        } as CheckoutModel,
      );

      checkouts.push(createdModel);
    }

    const channels: ChannelSetModel[] = [];
    if (addChannel) {
      let channel: ChannelSetModel = await chanelSetModel.create({
        active: true,
        checkout: checkouts[0],
        name: 'test',
        type: 'testType',
      } as ChannelSetModel);
      channels.push(channel);

      channel = await chanelSetModel.create({
        _id: businessId,
        active: true,
        checkout: checkouts[0],
        name: 'test1',
        type: 'testType1',
      } as ChannelSetModel);
      channels.push(channel);
    }

    await businessModel.create({
      _id: businessId,
      channelSets: channels,
      checkouts: checkouts,
      currency: 'USD',
      name: 'testB',
    } as BusinessModel);

    return checkouts;
  }

  public static async createBusinessIntegrationSub(
    integrationModel: Model<IntegrationModel>,
    subscriptionModel: Model<BusinessIntegrationSubModel>,
    integrationCategory: string,
    businessId: string,
    isEnabledSubscription: boolean = true,
  ): Promise<BusinessIntegrationSubModel> {
    const name: string = 'testName' + (this.integrationCreated++ > 0 ? this.integrationCreated.toString() : '');
    const integration: IntegrationModel = await FixtureCreatorHelper.createIntegration(
      integrationModel,
      name,
      integrationCategory,
    );

    return subscriptionModel.create({
      _id: name,
      businessId: businessId,
      enabled: isEnabledSubscription,
      installed: isEnabledSubscription,
      integration: integration,
    } as any);
  }

  public static async createCheckoutIntegrationSub(
    integrationModel: Model<IntegrationModel>,
    subscriptionModel: Model<CheckoutIntegrationSubModel>,
    integrationCategory: string,
    checkoutId: string,
    isEnabledSubscription: boolean = true,
  ): Promise<CheckoutIntegrationSubModel> {
    const name: string = 'testName' + (this.integrationCreated++ > 0 ? this.integrationCreated.toString() : '');
    const integration: IntegrationModel = await FixtureCreatorHelper.createIntegration(
      integrationModel,
      name,
      integrationCategory,
    );

    return subscriptionModel.create({
      _id: name,
      checkout: checkoutId || "",
      enabled: isEnabledSubscription,
      installed: isEnabledSubscription,
      integration: integration,
    } as any);
  }

  public static async createFlowFull(
    application: INestApplication,
    businessId: string,
    checkoutId: string,
    flowId: string,
    channelId: string = null,
  ): Promise<void> {
    const flowModel: Model<FlowModel> = application.get(getModelToken(FlowSchemaName));

    const sectionModel: Model<CheckoutSectionModel> = application.get(
      getModelToken(SectionSchemaName),
    );

    const checkoutModel: Model<CheckoutModel> = application.get(getModelToken(CheckoutSchemaName));
    const channelModel: Model<ChannelSetModel> = application.get(getModelToken(ChannelSetSchemaName));
    const businessModel: Model<BusinessModel> = application.get(getModelToken(BusinessSchemaName));

    const integrationModel: Model<IntegrationModel> = application.get(
      getModelToken(IntegrationSchemaName),
    );
    const subscriptionModel: Model<CheckoutIntegrationSubModel> = application.get(
      getModelToken(CheckoutIntegrationSubSchemaName),
    );

    const checkouts: CheckoutModel[] = await FixtureCreatorHelper.createCheckout({
      businessId,
      businessModel: businessModel,
      chanelSetModel: channelModel,
      checkoutId: checkoutId,
      checkoutModel: checkoutModel,
      count: 1,
      integrationModel: integrationModel,
      nameTemplate: 'communications',
      sectionModel: sectionModel,
      subscriptionModel: subscriptionModel,
    } as any);

    const checkoutUId: any = checkouts[0]._id;

    await flowModel.create({ flowId: flowId, checkoutUuid: checkoutUId } as FlowModel);

    if (channelId) {
      await channelModel.create({ _id: channelId, checkout: checkoutUId } as ChannelSetModel);
    }
  }
}

export = FixtureCreatorHelper;
