import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SynchronizationModel } from '@pe/synchronizer-kit';
import { Model } from 'mongoose';
import { SynchronizationDirectionEnum } from '../enums';
import { SynchronizationSchemaName } from '../schemas';
import { SynchronizationTriggerService } from './synchronization-trigger.service';
import { SynchronizationService } from './synchronization.service';

const SUBSCRIPTIONS_CHUNK_SIZE: number = 500;

@Injectable()
export class SchedulerService {
  constructor(
    private readonly synchronizationService: SynchronizationService,
    private readonly synchronizationTriggerService: SynchronizationTriggerService,
    private readonly logger: Logger,
    @InjectModel(SynchronizationSchemaName)
    private readonly synchronizationModel: Model<SynchronizationModel>,
  ) { }

  public async triggerSynchronizations(): Promise<number> {

    let thereAreMore: boolean = true;
    let processed: number = 0;
    let triggered: number = 0;

    while (thereAreMore) {
      const synchronizations: SynchronizationModel[] = await this.synchronizationService
        .findAllAwaitingSynchronization(SUBSCRIPTIONS_CHUNK_SIZE, processed);

      for (const synchronization of synchronizations) {
        triggered += await this.processSynchronization(await this.synchronizationModel.findById(synchronization._id));
      }

      thereAreMore = synchronizations.length === SUBSCRIPTIONS_CHUNK_SIZE;
      processed += synchronizations.length;
    }

    this.logger.log({
      context: 'SchedulerService',
      message: `Processed ${processed} synchronization records, triggered ${triggered} events`,
    });

    return processed;
  }

  public async processSynchronization(synchronization: SynchronizationModel): Promise<number> {
    let triggered: number = 0;

    if (synchronization.isOutwardEnabled) {
      await this.synchronizationTriggerService.triggerProductsSynchronization(
        synchronization,
        SynchronizationDirectionEnum.OUTWARD,
      );
      triggered++;
    }

    if (synchronization.isInwardEnabled) {
      await this.synchronizationTriggerService.triggerProductsSynchronization(
        synchronization,
        SynchronizationDirectionEnum.INWARD,
      );
      triggered++;
    }

    if (synchronization.isInventorySyncEnabled) {
      await this.synchronizationTriggerService
        .triggerInventorySynchronization(synchronization);
      triggered++;
    }

    if (triggered > 0) {
      await this.synchronizationService.setLastSyncDate(synchronization, new Date());
    }

    return triggered;
  }
}
