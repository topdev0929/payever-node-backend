import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { EventDispatcher } from '@pe/nest-kit';

import { EtlService } from '../services/etl.service';

@Injectable()
export class CronService {
  private logger: Logger = new Logger(CronService.name, true);

  constructor(
    private readonly etlService: EtlService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @Cron('*/30 * * * * *')
  public async transactions(): Promise<void> {
    this.logger.log('etl:transactions');

    if (this.etlService.currentState === 'running') {
      return this.logger.log('etl process in progress');
    }

    try {
      this.etlService.currentState = 'running';
      await Promise.all([
        this.etlService.importTransactions(),
        this.etlService.importShops(),
        this.etlService.importSites(),
        this.etlService.importPos(),
        this.etlService.importSubscriptions(),
        this.etlService.importMessages(),
        this.etlService.importBlog(),
      ]);
      await Promise.all([
        this.etlService.updateTransactions(),
        this.etlService.updateShops(),
        this.etlService.updateSites(),
        this.etlService.updatePos(),
        this.etlService.updateSubscriptions(),
        this.etlService.updateMessages(),
        this.etlService.updateBlog(),
      ]);
      await this.eventDispatcher.dispatch('Cube.data.updated');
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.etlService.currentState = null;
    }
  }

}

