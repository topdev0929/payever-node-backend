import { Controller, Patch, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { SynchronizationModel } from '@pe/synchronizer-kit';
import { SynchronizationSchemaName } from '../schemas';
import { SynchronizationService, SynchronizationTriggerService } from '../services';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('synchronization')
@Controller('synchronization/business/:businessId/integration/:integrationId')
export class SynchronizationInventoryController {
  constructor(
    private readonly synchronizationService: SynchronizationService,
    private readonly triggerService: SynchronizationTriggerService,
  ) { }

  @Patch('/inventory/enable')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async enableInventory(
    @ParamModel(
      {
        businessId: ':businessId',
        integration: ':integrationId',
      },
      SynchronizationSchemaName,
    ) synchronization: SynchronizationModel,
  ): Promise<void> {
    return this.synchronizationService.toggleInventory(synchronization, true);
  }

  @Patch('/inventory/disable')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async disableInventory(
    @ParamModel(
      {
        businessId: ':businessId',
        integration: ':integrationId',
      },
      SynchronizationSchemaName,
    ) synchronization: SynchronizationModel,
  ): Promise<void> {
    return this.synchronizationService.toggleInventory(synchronization, false);
  }

  @Patch('/inventory/toggle')
  @Roles(RolesEnum.merchant, RolesEnum.admin)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async toggleInventory(
    @ParamModel(
      {
        businessId: ':businessId',
        integration: ':integrationId',
      },
      SynchronizationSchemaName,
    ) synchronization: SynchronizationModel,
    @Body('value') value: boolean,
  ): Promise<void> {
    return this.synchronizationService.toggleInventory(synchronization, value);
  }

  @Post('/inventory/trigger')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async triggerSynchronization(
    @ParamModel(
      {
        businessId: ':businessId',
        integration: ':integrationId',
      },
      SynchronizationSchemaName,
    ) synchronization: SynchronizationModel,
  ): Promise<void> {
    return this.triggerService.triggerInventorySynchronization(synchronization);
  }
}
