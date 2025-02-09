import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { FileImportDto, FileImportRequestedDto } from '../dto';
import { ImportEventsService } from '../service';

@Controller('synchronization-tasks/business/:businessId')
@UseGuards(JwtAuthGuard)
export class SynchronizationTasksController {
  constructor(
    private importEventService: ImportEventsService,
  ) { }

  @Put('/file-import')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async createAndTrigger(
    @Param('businessId') businessId: string,
    @Body() dto: FileImportDto,
  ): Promise<FileImportRequestedDto> {
    return this.importEventService.sendImportRequestedEvent(businessId, dto);
  }
}
