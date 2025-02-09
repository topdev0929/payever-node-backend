import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModelLocal } from '../../business/models';
import { IntegrationWrapperSubscriptionModel } from '../models';
import {
  IntegrationWrapperSubscriptionService,
} from '../services';

const BUSINESS_ID: string = ':businessId';
@Controller('business/:businessId/integration-wrapper')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiTags('integration-wrapper')
export class IntegrationWrapperSubscriptionController {
  constructor(
    private readonly integrationWrapperService: IntegrationWrapperSubscriptionService,
  ) { }

  @Get(':wrapperType')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findOne(
    @Param('wrapperType') wrapperType: string,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
  ): Promise<{ }> {
    return this.integrationWrapperService.getWrapperByTypeAndBusiness(
      wrapperType,
      business._id,
    );
  }

  @Patch(':wrapperType/install')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async install(
    @Param('wrapperType') wrapperType: string,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
  ): Promise<{ }> {
    const installedWrapper: IntegrationWrapperSubscriptionModel =
      await this.integrationWrapperService.install(wrapperType, business);

    return {
      businessId: business._id,
      installed: installedWrapper.installed,
      type: installedWrapper.wrapperType,
    };
  }


  @Patch(':wrapperType/uninstall')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async uninstall(
    @Param('wrapperType') wrapperType: string,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModelLocal,
  ): Promise<{ }> {
    const wrapper: IntegrationWrapperSubscriptionModel =
      await this.integrationWrapperService.getWrapperByTypeAndBusiness(
        wrapperType,
        business._id,
      );
    if (!wrapper) {
      throw new NotFoundException(
        `Integration wrapper not found'`,
      );
    }

    const uninstalledWrapper: IntegrationWrapperSubscriptionModel = await this.integrationWrapperService.uninstall(
      wrapper,
      business,
    );

    return {
      businessId: business._id,
      installed: uninstalledWrapper.installed,
      type: uninstalledWrapper.wrapperType,
    };
  }
}
