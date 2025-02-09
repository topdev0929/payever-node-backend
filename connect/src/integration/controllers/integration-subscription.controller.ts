import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { BusinessModelLocal } from '../../business/models';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import {
  IntegrationService,
  IntegrationSubscriptionService,
} from '../services';
import { IntegrationSubscriptionListDto } from '../dto';
import { IntegrationPaginationInterface } from '../interfaces';
import { Randomizer } from '../tools/randomizer';

const BUSINESS_ID: string = ':businessId';
@Controller('business/:businessId/integration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiTags('integration-subscriptions')
export class IntegrationSubscriptionController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly subscriptionService: IntegrationSubscriptionService,
  ) { }

  @Get()
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findAllByBusiness(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
    @Query() query: IntegrationSubscriptionListDto,
  ): Promise<IntegrationPaginationInterface> {
    const businessObject: any = business.toObject();
    const result: any = await this.subscriptionService.findByBusinessList(business, query);

    return {
      ...result,
      business: query.businessData ? {
        ...businessObject,
      } : undefined,
    };
  }

  @Get('active')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findAllActiveByBusiness(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
    @Query() params: IntegrationSubscriptionListDto,
  ): Promise<IntegrationPaginationInterface> {

    params.active = true;

    return this.subscriptionService.findByBusinessList(business, params);
  }

  @Get('category/:category')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findByCategory(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
    @Param('category') category: string,
  ): Promise<IntegrationSubscriptionModel[]> {
    return this.subscriptionService.findByCategory(business, category);
  }

  @Get('not-installed/random')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findNotInstalled(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
    @Param('category') category: string,
  ): Promise<IntegrationSubscriptionModel[]> {

    return Randomizer.shuffleArray(
      await this.subscriptionService.findNotInstalled(business),
    );
  }

  @Get('not-installed/random/filtered-by-country')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findNotInstalledFilteredByCountry(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
  ): Promise<IntegrationSubscriptionModel[]> {

    return Randomizer.shuffleArray(
      await this.subscriptionService.filterNotInstalledByCountry(business),
    );
  }

  @Get(':integrationName')
  @Acl(
    { microservice: 'products', action: AclActionsEnum.read },
    { microservice: 'products', action: AclActionsEnum.create },
    { microservice: 'products', action: AclActionsEnum.update },
    { microservice: 'connect', action: AclActionsEnum.read }
  )
  public async findOne(
    @Param('integrationName') integrationName: string,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
  ): Promise<{ }> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(
      integrationName,
    );
    if (!integration) {
      throw new NotFoundException(
        `Third party integration of name '${integrationName}' not found'`,
      );
    }

    const subscription: IntegrationSubscriptionModel = await this.subscriptionService.findOneByIntegrationAndBusiness(
      integration,
      business,
    );

    return {
      installed: subscription.installed,
      name: subscription.integration.name,
    };
  }

  @Patch(':integrationName/install')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async install(
    @Param('integrationName') integrationName: string,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
  ): Promise<{ }> {
    return this.installIntegration(integrationName, business, true);
  }

  @Patch(':integrationName/registration/install')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async registrationInstall(
    @Param('integrationName') integrationName: string,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
  ): Promise<{ }> {
    return this.installIntegration(integrationName, business, true);
  }

  @Patch(':integrationName/uninstall')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async uninstall(
    @Param('integrationName') integrationName: string,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
  ): Promise<{ }> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(
      integrationName,
    );
    if (!integration) {
      throw new NotFoundException(
        `Third party integration of name '${integrationName}' not found'`,
      );
    }

    const subscription: IntegrationSubscriptionModel = await this.subscriptionService.uninstall(
      integration,
      business,
    );

    return {
      installed: subscription.installed,
      name: subscription.integration.name,
    };
  }

  private async installIntegration(
    integrationName: string, 
    business: BusinessModelLocal, 
    registration: boolean = false,
  ): Promise<{ }> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(
      integrationName,
    );
    if (!integration) {
      if (registration) {
        return; 
      }
      throw new NotFoundException(
        `Third party integration of name '${integrationName}' not found'`,
      );
    }

    // is allowed
    if (integration.allowedBusinesses && integration.allowedBusinesses.length &&
      integration.allowedBusinesses.indexOf(business._id) === -1) {
        if (registration) {
          return; 
        }
        throw new BadRequestException(
          `Third party integration is not allowed for current business`,
        );
    }

    // isn't excluded
    if (business && business.excludedIntegrations.length > 0
      && business.excludedIntegrations.indexOf(integration._id) > -1) {
        if (registration) {
          return; 
        }
        throw new BadRequestException(
          `Third party integration is not allowed for current business`,
        );
    }

    const subscription: IntegrationSubscriptionModel = await this.subscriptionService.install(
      integration,
      business,
    );

    await this.integrationService.incrementInstallCounter(integration);

    return {
      installed: subscription.installed,
      name: subscription.integration.name,
      scopes: subscription.scopes,
    };
  }
}
