import { Controller, Param, Patch, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { ParamModel } from '@pe/nest-kit';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { IntegrationModel, IntegrationSchemaName, SynchronizationModel } from '@pe/synchronizer-kit';
import { SynchronizationDirectionEnum } from '../enums';
import { SynchronizationSchemaName } from '../schemas';
import { SynchronizationService, SynchronizationTriggerService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const INTEGRATION_ID_PLACEHOLDER: string = ':integrationId';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('synchronization')
@Controller('synchronization/business/:businessId/integration/:integrationId')
export class SynchronizationProductsController {
  constructor(
    private readonly synchronizationService: SynchronizationService,
    private readonly triggerService: SynchronizationTriggerService,
  ) { }

  @Patch('/sync/enable')
  @Roles(RolesEnum.merchant, RolesEnum.admin)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async enableSync(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(INTEGRATION_ID_PLACEHOLDER, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<void> {
    const synchronization: SynchronizationModel = await this.synchronizationService.connect(
      business,
      integration,
    );

    await this.synchronizationService.toggleAllDirections(
      synchronization,
      true,
    );
  }

  @Patch('/sync/disable')
  @Roles(RolesEnum.merchant, RolesEnum.admin)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async disableSync(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(INTEGRATION_ID_PLACEHOLDER, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<void> {
    const synchronization: SynchronizationModel = await this.synchronizationService.connect(
      business,
      integration,
    );

    await this.synchronizationService.toggleAllDirections(
      synchronization,
      false,
    );
  }

  @Patch('/direction/:direction/enable')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async enableDirection(
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        integration: INTEGRATION_ID_PLACEHOLDER,
      },
      SynchronizationSchemaName,
    )
    synchronization: SynchronizationModel,
    @Param('direction') direction: SynchronizationDirectionEnum,
  ): Promise<void> {
    return this.synchronizationService.toggleDirection(
      synchronization,
      direction,
      true,
    );
  }

  @Patch('/direction/:direction/disable')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async disableDirection(
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        integration: INTEGRATION_ID_PLACEHOLDER,
      },
      SynchronizationSchemaName,
    )
    synchronization: SynchronizationModel,
    @Param('direction') direction: SynchronizationDirectionEnum,
  ): Promise<void> {
    return this.synchronizationService.toggleDirection(
      synchronization,
      direction,
      false,
    );
  }

  @Patch('/direction/:direction/toggle')
  @Roles(RolesEnum.merchant, RolesEnum.admin)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async toggleDirection(
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        integration: INTEGRATION_ID_PLACEHOLDER,
      },
      SynchronizationSchemaName,
    )
    synchronization: SynchronizationModel,
    @Param('direction') direction: SynchronizationDirectionEnum,
    @Body('value') value: boolean,
  ): Promise<void> {

    return this.synchronizationService.toggleDirection(
      synchronization,
      direction,
      value,
    );
  }

  @Post('/direction/:direction/trigger')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async triggerSynchronization(
    @ParamModel(
      {
        businessId: BUSINESS_ID_PLACEHOLDER,
        integration: INTEGRATION_ID_PLACEHOLDER,
      },
      SynchronizationSchemaName,
    )
    synchronization: SynchronizationModel,
    @Param('direction') direction: SynchronizationDirectionEnum,
  ): Promise<void> {
    await this.triggerService.triggerProductsSynchronization(
      synchronization,
      direction,
    );
  }
}
