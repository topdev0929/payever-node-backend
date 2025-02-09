import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import {
  BusinessIntegrationSubscriptionService,
  CheckoutSection,
  IntegrationCategory,
} from '../../integration';
import { SectionSchemaName } from '../../mongoose-schema';
import { CheckoutSectionInterface, SectionInterface } from '../interfaces';
import { CheckoutIntegrationSubModel, CheckoutModel, SectionModel } from '../models';
import { CheckoutIntegrationSubscriptionService } from '../../common/services';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(SectionSchemaName) private readonly sectionModel: Model<SectionModel>,
    private readonly checkoutIntegrationService: CheckoutIntegrationSubscriptionService,
    private readonly businessIntegrationSubscriptionService: BusinessIntegrationSubscriptionService,
  ) { }

  public async createSection(section: SectionInterface): Promise<void> {
    await this.sectionModel.create(section);
  }

  public async findAll(): Promise<SectionModel[]> {
    return this.sectionModel.find().sort({ order: 1 });
  }

  public async getAvailableSections(checkout: CheckoutModel, business: BusinessModel): Promise<SectionModel[]> {
    let sections: SectionModel[] = await this.findAll();
    const checkoutSubscriptions: CheckoutIntegrationSubModel[] =
      await this.checkoutIntegrationService.getEnabledSubscriptions(checkout, business);
    const hasPosInstalled: boolean = await this.businessIntegrationSubscriptionService.hasPosInstalled(business);

    if (!checkoutSubscriptions.find(
      (x: CheckoutIntegrationSubModel) => x.integration.category === IntegrationCategory.Communications)
    ) {
      sections = sections.filter((x: SectionModel) => x.code !== CheckoutSection.SendToDevice);
    }

    if (!checkoutSubscriptions.find(
      (x: CheckoutIntegrationSubModel) => x.integration.category === IntegrationCategory.Shippings)
    ) {
      sections = sections.filter((x: SectionModel) => x.code !== CheckoutSection.Shipping);
    }

    if (!hasPosInstalled) {
      sections = sections.filter((x: SectionModel) => x.code !== CheckoutSection.Ocr);
    }


    return sections;
  }

  public async getDefaultSections(): Promise<CheckoutSectionInterface[]> {
    const defaultSections: SectionModel[] = await this.findAll();

    return defaultSections.map(
      (x: SectionModel) => ({
        code: x.code,
        enabled: x.defaultEnabled,
        order: x.order,
      } as CheckoutSectionInterface),
    );
  }
}
