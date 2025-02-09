import { Injectable, OnModuleInit } from '@nestjs/common';
import { environment } from '../../environments';
import { MediaItemService } from '../services';
import * as cron from 'node-cron';

@Injectable()
export class UnassignedMediaRemoverCron implements OnModuleInit{
  constructor(
    private readonly mediaItemsService: MediaItemService,
  ) { }

  public async onModuleInit(): Promise<void> {
    await cron.schedule('0 0 * * *', () => this.removeOldUnassignedMedia());
  }

  public async removeOldUnassignedMedia(): Promise<void> {
    if (!environment.unusedMediaStoragePeriodDays) {
      throw new Error('UNUSED_MEDIA_STORAGE_PERIOD_DAYS is required');
    }
    const tillDate: Date = new Date();
    tillDate.setDate(tillDate.getDate() - environment.unusedMediaStoragePeriodDays);
    await this.mediaItemsService.removeUnassignedOlderThan(tillDate);
  }
}
