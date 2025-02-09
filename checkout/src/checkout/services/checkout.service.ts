import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CountryService, LanguageModel, LanguageService } from '@pe/common-sdk';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { v5, v4 as uuid4 } from 'uuid';
import { BusinessModel } from '../../business';
import { environment } from '../../environments';
import { SectionDto } from '../../integration/dto';
import { BusinessSchemaName, CheckoutSchemaName, PendingInstallationName } from '../../mongoose-schema';
import { CreateCheckoutDto, UpdateCheckoutDto, AdminCheckoutListDto } from '../dto';
import { CheckoutEvent } from '../enums';
import {
  ChannelSettingsInterface,
  CheckoutLanguageInterface,
  CheckoutSectionInterface,
  CheckoutSettingsInterface,
  PendingInstallationInterface,
  SetupCheckoutInterface,
} from '../interfaces';
import { CheckoutIntegrationSubModel, CheckoutModel, PendingInstallationModel } from '../models';
import { SectionsService } from './sections.service';
import { UpdateSectionsDto } from '../dto/update-sections.dto';
import { CheckoutIntegrationSubscriptionService, ValidationService } from '../../common/services';
import { RabbitEventsProducer } from '../../common/producer';
import { IntegrationModel, IntegrationService } from '../../integration';
import { Mutex } from '@pe/nest-kit/modules/mutex';

@Injectable()
export class CheckoutService {
  private readonly supportedLanguages: string[];

  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
    @InjectModel(PendingInstallationName) private readonly pendingInstallationModel: Model<PendingInstallationModel>,
    private readonly checkoutIntegrationSubscriptionService: CheckoutIntegrationSubscriptionService,
    private readonly countryService: CountryService,
    private readonly languageService: LanguageService,
    private readonly sectionsService: SectionsService,
    private readonly rabbitProducer: RabbitEventsProducer,
    private readonly dispatcher: EventDispatcher,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
    private readonly integrationService: IntegrationService,
    private readonly validationService: ValidationService,
    private readonly mutex: Mutex,
  ) {
    this.supportedLanguages = environment.supportedLanguages;
  }

  public async retrieveListForAdmin(query: AdminCheckoutListDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const checkouts: CheckoutModel[] = await this.checkoutModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.checkoutModel.count({ });

    return {
      checkouts,
      page,
      total,
    };
  }

  public async createDefaultIfNotExist(business: BusinessModel): Promise<void> {
    const defaultCheckout: CheckoutModel = await this.findDefaultForBusiness(business);
    if (!defaultCheckout) {
      const checkoutId: string = v5(business.id, business.id);

      const createdCheckout: CheckoutModel = await this.createDefault(business, checkoutId);
      await this.processPendingInstallment(business, createdCheckout);
      await this.rabbitProducer.businessCheckoutCreated(createdCheckout);
    }
  }

  public async createDefault(
    business: BusinessModel,
    checkoutId?: string,
  ): Promise<CheckoutModel> {
    const sections: CheckoutSectionInterface[] = await this.sectionsService.getDefaultSections();
    const languages: CheckoutLanguageInterface[] = await this.getDefaultLanguages(
      await this.getLanguageByBusiness(business),
    );
    const checkoutDto: CreateCheckoutDto = {
      default: true,
      name: `${business.name || 'Default'}`, // TODO add translation here
      sections,
      settings: {
        cspAllowedHosts: [],
        enableCustomerAccount: true,
        enableDisclaimerPolicy: false,
        enableLegalPolicy: false,
        enablePayeverTerms: true,
        enablePrivacyPolicy: false,
        enableRefundPolicy: false,
        enableShippingPolicy: false,
        languages: languages,
        testingMode: false,
      },
    };

    const checkout: CheckoutModel = await this.createCheckout(checkoutDto, business._id, checkoutId);

    await this.dispatcher.dispatch(CheckoutEvent.CheckoutCreated, checkout);

    return checkout;
  }

  public async addPendingInstallation(data: PendingInstallationInterface): Promise<void> {
    await this.pendingInstallationModel.create(data);
  }

  public async processPendingInstallment(business: BusinessModel, checkout: CheckoutModel): Promise<void> {
    const pendingInstallation: PendingInstallationModel =
      await this.pendingInstallationModel.findOne({ businessId: business._id });

    if (!pendingInstallation) {
      return;
    }
    await this.setupCheckout(pendingInstallation.payload, business, checkout);
    await this.pendingInstallationModel.deleteOne({ businessId: business._id });
  }

  public async setupCheckout(
    data: SetupCheckoutInterface,
    business: BusinessModel,
    checkout: CheckoutModel,
  ): Promise<void> {
    const { updateData, integrationsToInstall }: SetupCheckoutInterface = data;

    if (updateData.settings && updateData.settings.phoneNumber) {
      await this.validationService.validateSettingsPhone(updateData.settings.phoneNumber, checkout.id);
    }
    if (updateData.default) {
      await this.setDefault(checkout, business);
    }
    const updated: CheckoutModel = await this.update(
      checkout,
      {
        ...updateData,
        settings: { ...checkout.settings, ...updateData.settings },
      },
    );

    await this.rabbitEventsProducer.businessCheckoutUpdated(updated);

    for (const integrationName of integrationsToInstall) {
      const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);
      await this.checkoutIntegrationSubscriptionService.install(integration, checkout);
    }
  }

  public async createBasedOnDefault(
    business: BusinessModel,
    createCheckoutDto: CreateCheckoutDto,
  ): Promise<CheckoutModel> {

    await ValidationService.validateDto(createCheckoutDto, ['create']);
    const defaultCheckout: CheckoutModel = await this.findDefaultForBusiness(business);
    if (defaultCheckout) {
      createCheckoutDto.channelSettings = defaultCheckout.channelSettings;
      createCheckoutDto.settings = defaultCheckout.settings;
      createCheckoutDto.sections = defaultCheckout.sections;
    } else {
      // first created checkout we make as default
      createCheckoutDto = await this.setDefaultProperties(
        business,
        createCheckoutDto,
      );
    }

    const checkoutDto: CreateCheckoutDto & { businessId: string } = {
      ...createCheckoutDto,
      businessId: business.id,
    };

    if (checkoutDto.settings && checkoutDto.settings.phoneNumber) {
      delete checkoutDto.settings.phoneNumber;
    }

    const checkout: CheckoutModel = await this.createCheckout(checkoutDto, business._id);

    if (defaultCheckout) {
      const subscriptions: CheckoutIntegrationSubModel[] =
        await this.checkoutIntegrationSubscriptionService.getSubscriptionsWithIntegrations(defaultCheckout);

      for (const subscription of subscriptions) {
        if (subscription.installed) {
          await this.checkoutIntegrationSubscriptionService.install(subscription.integration, checkout);
        }
      }
    }

    await this.dispatcher.dispatch(CheckoutEvent.CheckoutCreated, checkout);

    return this.findOneById(checkout.id);
  }

  public async findOneById(checkoutId: string): Promise<CheckoutModel> {
    return this.checkoutModel.findById(checkoutId);
  }

  public async update(checkout: CheckoutModel, data: UpdateCheckoutDto): Promise<CheckoutModel> {
    const validationGroups: string[] = ['update'];
    if (data.settings && !!data.settings?.enableCustomerAccount) {
      validationGroups.push('customerAccountEnabled');
    }

    await ValidationService.validateDto(data, validationGroups);

    const updatedCheckout: CheckoutModel = await this.checkoutModel.findOneAndUpdate(
      { _id: checkout.id },
      { $set: data },
      { new: true },
    );

    await this.dispatcher.dispatch(CheckoutEvent.CheckoutUpdated, checkout, updatedCheckout);

    return updatedCheckout;
  }

  public async updateChannelSettings(checkout: CheckoutModel, settings: ChannelSettingsInterface): Promise<void> {
    const updatedValue: { channelSettings: ChannelSettingsInterface } = { channelSettings: { ...settings }};
    await this.checkoutModel.updateOne(
      { _id: checkout.id },
      { $set: updatedValue as CheckoutModel },
    );
  }

  public async updateSettings(checkout: CheckoutModel, settings: CheckoutSettingsInterface): Promise<void> {
    const updatedValue: { settings: CheckoutSettingsInterface } = { settings: { ...settings }};
    await this.checkoutModel.updateOne(
      { _id: checkout.id },
      { $set: updatedValue as CheckoutModel },
    );
  }

  public async updateLogo(checkout: CheckoutModel, logo: string): Promise<void> {
    await this.checkoutModel.updateOne(
      { _id: checkout.id },
      { $set: { logo } },
    );
  }

  public async updateSections(checkout: CheckoutModel, updateSectionDto: UpdateSectionsDto): Promise<void> {
    for (const section of checkout.sections) {
      const updatedSectionFields: SectionDto =
        updateSectionDto.sections.find( (item: SectionDto) => item.code === section.code);
      if (updatedSectionFields) {
        const updatedSection: SectionDto = {
          code: section.code,
          enabled: updatedSectionFields.enabled,
          order: updatedSectionFields.order ? updatedSectionFields.order : section.order,
        };

        await this.checkoutModel.updateOne(
          { _id: checkout.id, 'sections._id': section._id },
          {
            $set:
              { 'sections.$': updatedSection},
          },
        );

      }
    }

  }

  public async findAllByBusiness(business: BusinessModel): Promise<CheckoutModel[]> {
    return this.checkoutModel.find({ businessId: business.id });
  }

  public async findMany(offset: number, limit: number, order: object): Promise<CheckoutModel[]> {
    return this.checkoutModel.find().sort(order).skip(offset).limit(limit);
  }

  public async countCheckouts(): Promise<number> {
    return this.checkoutModel.count({ });
  }

  public async findDefaultForBusiness(business: BusinessModel): Promise<CheckoutModel> {
    return this.checkoutModel.findOne({ businessId: business.id, default: true });
  }

  public async remove(checkout: CheckoutModel, business: BusinessModel): Promise<void> {
    if (business.checkouts.length <= 1) {
      throw new ForbiddenException(`It is not allowed to delete last checkout`);
    }
    await this.businessModel.findOneAndUpdate(
      { _id: business.id },
      { $pull: { checkouts: checkout.id }},
    );
    await this.checkoutModel.deleteOne({ _id: checkout.id });

    if (checkout.default) {
      const businessCheckouts: CheckoutModel[] = await this.checkoutModel.find({ businessId: business.id });
      const lastAvailableCheckout: CheckoutModel = businessCheckouts.pop();
      await this.setDefault(lastAvailableCheckout, business);
    }

    await this.dispatcher.dispatch(CheckoutEvent.CheckoutRemoved, checkout);
  }

  public async setDefault(businessCheckout: CheckoutModel, business: BusinessModel): Promise<void> {
    const businessCheckouts: CheckoutModel[] = await this.checkoutModel.find({ businessId: business.id });

    for (const checkout of businessCheckouts) {
      if (checkout.id === businessCheckout.id) {
        checkout.default = true;
        await checkout.save();
      } else {
        checkout.default = false;
        await checkout.save();
      }
    }

    businessCheckout.default = true;
  }

  public async getList(query: any, limit: number, skip: number): Promise<CheckoutModel[]> {
    return this.checkoutModel.find(query).limit(limit).skip(skip);
  }

  public async deleteOneById(checkout: CheckoutModel): Promise<void> {
    await this.checkoutModel.deleteOne({ _id: checkout.id });
    await this.checkoutIntegrationSubscriptionService.deleteByCheckout(checkout);

    await this.dispatcher.dispatch(CheckoutEvent.CheckoutRemoved, checkout);
  }

  private async getDefaultLanguages(defaultLanguage?: string): Promise<CheckoutLanguageInterface[]> {
    const tasks: Array<Promise<LanguageModel>> = [];
    for (const languageCode of this.supportedLanguages) {
      tasks.push(this.languageService.getLanguage(languageCode));
    }
    const languages: LanguageModel[] = await Promise.all(tasks);
    const lang: string = defaultLanguage ? defaultLanguage : 'en';

    const result: CheckoutLanguageInterface[] = languages
      .filter((x: LanguageModel) => !!x)
      .map((x: LanguageModel) => ({
        active: x.id === lang,
        code: x.id,
        isDefault: x.id === lang,
        name: x.name,
      }));

    if (!result.length) {
      result.push({
        active: true,
        code: 'en',
        isDefault: true,
        name: 'English',
      });
    }

    return result;
  }

  private async getLanguageByBusiness(business: BusinessModel): Promise<string> {
    let language: string = business.defaultLanguage ? business.defaultLanguage : null;
    if (!language) {
      const country: string = business.businessDetail?.companyAddress?.country
        ? business.businessDetail?.companyAddress?.country
        : business.country
          ? business.country
          : null;
      if (country) {
        language = await this.countryService.getCountryLanguageCode(country);
        language = language || 'en';
      }
    }

    return language;
  }

  private async setDefaultProperties(
    business: BusinessModel,
    createCheckoutDto: CreateCheckoutDto,
  ): Promise<CreateCheckoutDto> {
    createCheckoutDto.default = true;
    if (!createCheckoutDto.sections) {
      createCheckoutDto.sections = await this.sectionsService.getDefaultSections();
    }
    if (!createCheckoutDto.settings || !createCheckoutDto.settings.languages) {
      const languages: CheckoutLanguageInterface[] = await this.getDefaultLanguages(
        await this.getLanguageByBusiness(business),
      );
      createCheckoutDto.settings = {
        ...createCheckoutDto.settings,
        languages: languages,
      };
    }

    return createCheckoutDto;
  }

  private async createCheckout(
    checkoutDto: CreateCheckoutDto,
    businessId: string,
    checkoutId?: string,
  ): Promise<CheckoutModel> {
    const updatedCheckoutId: string = checkoutId ? checkoutId : uuid4();

    return this.mutex.lock(
      'checkout',
      updatedCheckoutId,
      async () => {
        const checkout: CheckoutModel = await this.checkoutModel.findOneAndUpdate(
          {
            _id: updatedCheckoutId,
          },
          {
            $set: {
              ...checkoutDto,
              businessId: businessId,
            },
            $setOnInsert: {
              _id: updatedCheckoutId,
            },
          },
          {
            new: true,
            upsert: true,
          },
        );

        await this.businessModel.findOneAndUpdate(
          { _id: businessId },
          { $push: { checkouts: checkout.id }},
        );

        return checkout;
      }
    );

  }
}
