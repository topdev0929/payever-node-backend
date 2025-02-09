import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import {
  CheckoutFlowBaseInterface,
  CheckoutFlowSectionInterface,
  CheckoutFlowUiInterface,
  FullSettingResponseInterface,
} from '../interfaces';
import { ConnectionModel } from '../../connection/models';
import { CheckoutConnectionService } from '../../connection/services';
import { IntegrationCategory, IntegrationModel } from '../../integration';
import { SectionsService } from '../services';
import { CheckoutIntegrationSubModel, CheckoutModel, CheckoutSectionModel, SectionModel } from '../models';
import { ChannelSetModel } from '../../channel-set';

@Injectable()
export class FlowCheckoutConverter {
  constructor(
    private readonly businessService: BusinessService,
    private readonly checkoutConnectionService: CheckoutConnectionService,
    private readonly sectionsService: SectionsService,
  ) { }

  public async fromChannelSetToCheckoutResponse(channelSet: ChannelSetModel): Promise<FullSettingResponseInterface> {
    await channelSet.populate('checkout').execPopulate();
    if (!channelSet.checkout) {
      throw new NotFoundException(`ChannelSet "${channelSet.id}" has no checkout.`);
    }

    const business = await this.businessService
      .businessModel.findOne({ _id: channelSet.checkout.businessId }).populate('businessDetail');


    return {
      ...(await this.fromCheckoutToCheckoutFlowBaseResponse(channelSet.checkout)),
      ...(await this.fromCheckoutToCheckoutFlowUIResponse(channelSet.checkout)),
      businessName: business.name,
      channelType: channelSet.type,
      companyAddress: {
        city: business?.businessDetail?.companyAddress?.city,
        country: business?.businessDetail?.companyAddress?.country,
        street: business?.businessDetail?.companyAddress?.street,
        zipCode: business?.businessDetail?.companyAddress?.zipCode,
      },
      customPolicy: channelSet.customPolicy ? channelSet.customPolicy : false,
      policyEnabled: typeof channelSet.policyEnabled === 'boolean' ? channelSet.policyEnabled : true,
    };
  }

  public async fromCheckoutToCheckoutFlowBaseResponse(checkout: CheckoutModel): Promise<CheckoutFlowBaseInterface> {
    const business: BusinessModel = await this.businessService.findOneById(checkout.businessId) as BusinessModel;
    const checkoutConnections: ConnectionModel[] = await this.checkoutConnectionService.getConnections(checkout);

    return {
      businessUuid: checkout.businessId,
      currency: business.currency,
      customerAccount: checkout.settings.customerAccount,
      enableCustomerAccount: checkout.settings.enableCustomerAccount,
      enableDisclaimerPolicy: checkout.settings.enableDisclaimerPolicy,
      enableLegalPolicy: checkout.settings.enableLegalPolicy,
      enablePayeverTerms: checkout.settings.enablePayeverTerms,
      enablePrivacyPolicy: checkout.settings.enablePrivacyPolicy,
      enableRefundPolicy: checkout.settings.enableRefundPolicy,
      enableShippingPolicy: checkout.settings.enableShippingPolicy,
      languages: checkout.settings.languages,
      limits: { },
      message: checkout.settings.message,
      name: checkout.name,
      paymentMethods: this.collectPaymentMethods(checkoutConnections),
      phoneNumber: checkout.settings.phoneNumber,
      policies: checkout.settings.policies,
      testingMode: checkout.settings.testingMode,
      uuid: checkout.id,
    };
  }

  public async fromCheckoutToCheckoutFlowUIResponse(checkout: CheckoutModel): Promise<CheckoutFlowUiInterface> {
    return {
      logo: checkout.logo,
      sections: await this.collectSections(checkout.sections),
      styles: checkout.settings.styles,
      uuid: checkout.id,
      version: checkout?.settings?.version || 'default',
    };
  }

  private collectPaymentMethods(connections: ConnectionModel[]): string[] {
    return connections
      .map((elem: CheckoutIntegrationSubModel) => elem.integration)
      .filter((integration: IntegrationModel) => {
        return integration.category === IntegrationCategory.Payments
          && integration.isVisible;
      })
      .map((integration: IntegrationModel) => integration.name);
  }

  private async collectSections(
    checkoutSections: CheckoutSectionModel[],
  ): Promise<CheckoutFlowSectionInterface[]> {
    const sections: SectionModel[] = await this.sectionsService.findAll();

    return checkoutSections
      .filter((checkoutSection: CheckoutSectionModel) =>
        sections.find((x: SectionModel) => x.code === checkoutSection.code),
      )
      .map((checkoutSection: CheckoutSectionModel) => {
        const section: SectionModel = sections.find((x: SectionModel) => x.code === checkoutSection.code);

        return {
          allowed_only_channels: section.allowed_only_channels,
          allowed_only_integrations: section.allowed_only_integrations,
          code: checkoutSection.code,
          enabled: checkoutSection.enabled,
          excluded_channels: section.excluded_channels,
          excluded_integrations: section.excluded_integrations,
          fixed: section.fixed,
          options: checkoutSection.options,
          order: checkoutSection.order,
          subsections: section.subsections,
        };
      })
      ;
  }
}
