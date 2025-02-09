import { Get, UseGuards, Controller, Put, Query } from '@nestjs/common';
import { SchedulerService, SynchronizationService } from '../services';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, QueryDto, Roles, RolesEnum } from '@pe/nest-kit';
import { SynchronizationSchemaName } from '../schemas';
import { SynchronizationModel } from '@pe/synchronizer-kit';
import { AdminScheduleQueryDto } from '../dto';

const SYNCHRONIZATION_ID: string = ':synchronizationId';

@Controller('admin/scheduler')
@ApiTags('Admin Scheduler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminSchedulerController {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly synchronizationService: SynchronizationService,
  ) { }

  @Get('awaiting-synchronization')
  public async findAllAwaitingSynchronization(
    @QueryDto() query: AdminScheduleQueryDto,
  ): Promise<any> {
    const skip: number = (query.page - 1) * query.limit;

    return this.synchronizationService.findAllAwaitingSynchronization(query.limit, skip);
  }

  @Put('trigger-synchronizations')
  public async triggerSynchronizations(): Promise<number> {
    return this.schedulerService.triggerSynchronizations();
  }

  @Put(`process-synchronization/${SYNCHRONIZATION_ID}`)
  public async processSynchronization(
    @ParamModel(SYNCHRONIZATION_ID, SynchronizationSchemaName, true) synchronization: SynchronizationModel,
  ): Promise<any> {
    return this.schedulerService.processSynchronization(synchronization);
  }
}
