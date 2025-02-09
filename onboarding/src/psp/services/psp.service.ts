// tslint:disable: no-identical-functions
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { OrganizationTokenInterface } from '@pe/nest-kit';
import { OrganizationService } from './organization.service';
import {
  AuthService,
  ConnectService,
  ConnectSettingsService,
  ClientService,
  CommerceOSService,
  OauthResponsePayload,
  PaymentMethodResponse,
  UsersService,
  IntegrationService,
} from './micros';
import { ClientResultDto, OnboardingRequestDto, UninstallPaymentMethodDto } from '../dto';
import { OrganizationBusinessModel } from '../models';
import { PaymentMethodDto } from '../dto/onboarding/payment-method.dto';
import { OnboardingRequestTypeEnum } from '../enums';

@Injectable()
export class PSPService {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly integrationService: IntegrationService,
    private readonly connectService: ConnectService,
    private readonly connectSettingsService: ConnectSettingsService,
    private readonly usersService: UsersService,
    private readonly commerceOSService: CommerceOSService,
    private readonly logger: Logger,
  ) { }

  public async getBusinesses(org: OrganizationTokenInterface): Promise<OrganizationBusinessModel[]> {
    return this.organizationService.getBusinessesByOrganizationId(org.id);
  }

  public async getBusinessById(businessId: string)
    : Promise<OrganizationBusinessModel[]> {
    return this.organizationService.getBusinessByBusinessId(businessId);
  }

  public async createBusiness(
    org: OrganizationTokenInterface,
    onboardingDto: OnboardingRequestDto,
  ): Promise<ClientResultDto> {
    const data: any = {
      auth: {
        email: onboardingDto.auth.email,
        first_name: onboardingDto.auth.first_name,
        last_name: onboardingDto.auth.last_name,
      },
      business: {
        ...onboardingDto.business,

        active: true,
        companyAddress: {
          city: onboardingDto.business.company_address.city,
          country: onboardingDto.business.company_address.country,
          street: onboardingDto.business.company_address.street,
          zipCode: onboardingDto.business.company_address.zip,
        },
        companyDetails: {
          product: 'psp',
        },
        contactDetails: {
          firstName: onboardingDto.auth.first_name,
          lastName: onboardingDto.auth.last_name,
        },
        hidden: false,
        id: uuid(),

        trafficSource: {
          campaign: 'PSP',
          medium: 'RPC call',
          source: 'onboarding',
        },
      },
      platformLogin: onboardingDto.platformLogin,
    };

    try {
      let user: any = await this.authService.registerUserRPC(data.auth);
      user = user[0];

      await this.authService.addBusinessPermissionsRPC(data.business.id, user._id);

      let business: any = await this.usersService.registerBusinessRPC(data, user._id);
      business = business[0];

      await this.organizationService.addBusinessToOrganization(org.id, business._id);
      await this.commerceOSService.installDefaultAppsRPC(business._id, user._id);

      this.installPaymentMethods(business._id, onboardingDto.payment_methods, data)
        .catch((error: any) => {
          this.logger.warn({
            error: error.message,
            message: 'Failed to install payment methods',
          });
        });


      const integrationsToInstall: string[] = ['api'];

      if (onboardingDto.type === OnboardingRequestTypeEnum.pos) {
        integrationsToInstall.push('device-payments');
      }

      if (onboardingDto?.integrations) {
        integrationsToInstall.push(...onboardingDto.integrations);
      }

      const integrationResponse: { [key: string]: any } = await this.setupIntegrations(
        business._id, 
        integrationsToInstall, 
        onboardingDto,
      );

      const client: OauthResponsePayload = await this.clientService.getClient(business._id, user._id);

      if (data.platformLogin) {
        await this.authService.resetUserPasswordRPC(data.auth.email);
      }

      return {
        business_id: business._id,
        client_id: client._id,
        client_secret: client.secret,
        integrations: integrationResponse,
      };

    } catch (error) {
      this.logger.log({
        error: error.message,
        message: 'Creating business failed',
      });

      throw new ConflictException(JSON.stringify(error.response.data, null, 2));
    }
  }

  public async removeBusiness(org: OrganizationTokenInterface, businessId: string): Promise<void> {
    await this.usersService.removeBusinessRPC(businessId);

    await this.organizationService.removeBusinessFromOrganization(org.id, businessId);
  }

  public async setupIntegrations(
    businessId: string,
    integrationsToInstall: string[],
    data: any,
  ): Promise<{ [key: string]: any }> {
    const integrationResponse: any = { };

    for (const integration of integrationsToInstall) {
      await this.connectService.installAppRPC(
        businessId,
        integration,
      ).catch((error: any) => {
        this.logger.warn({
          error: error.message,
          message: `Failed to install ${integration} integration`,
        });
      });

      const response: any = await this.integrationService.configureIntegration(integration, data, businessId);
      if (response && Object.keys(response).length) {
        integrationResponse[integration] = response;
      }
    }

    return integrationResponse;
  }

  public async installPaymentMethod(
    businessId: string,
    paymentMethod: PaymentMethodDto,
  ): Promise<ClientResultDto> {
    await this.connectService.installAppRPC(
      businessId,
      paymentMethod.type,
    );
    await this.connectSettingsService.configPaymentMethod(
      businessId,
      paymentMethod,
      { },
    );

    const client: OauthResponsePayload = await this.clientService.getClient(businessId);

    return {
      business_id: businessId,
      client_id: client._id,
      client_secret: client.secret,
    };
  }

  public async uninstallPaymentMethod(
    businessId: string,
    paymentMethod: UninstallPaymentMethodDto,
  ): Promise<ClientResultDto> {
    await this.connectService.uninstallAppRPC(
      businessId,
      paymentMethod.type,
    );

    const client: OauthResponsePayload = await this.clientService.getClient(businessId);

    return {
      business_id: businessId,
      client_id: client._id,
      client_secret: client.secret,
    };
  }

  private async installPaymentMethods(
    businessId: string,
    paymentMethods: PaymentMethodDto[],
    data: any = { },
  ): Promise<any> {
    const result: any[] = [];

    for (const paymentMethod of paymentMethods) {
      let paymentMethodInstallResponse: PaymentMethodResponse = await this.connectService.installAppRPC(
        businessId,
        paymentMethod.type,
      );
      paymentMethodInstallResponse = paymentMethodInstallResponse[0];

      const paymentMethodConfigResponse: any = await this.connectSettingsService.configPaymentMethod(
        businessId,
        paymentMethod,
        data,
      );

      result.push({
        ...paymentMethodInstallResponse,
        config: paymentMethodConfigResponse,
      });
    }

    return result;
  }
}
