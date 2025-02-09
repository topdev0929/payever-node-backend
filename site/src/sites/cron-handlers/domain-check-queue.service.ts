import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { DomainCheckInterface } from '../interfaces';
import { DomainService } from '../services';
import { DomainModel } from '../models/domain.model';

const DOMAIN_CHECK_QUEUE_SCHEDULE: string = '*/5 * * * *'; // every 5 minutes

@Injectable()
export class DomainCheckQueueService {
  constructor(
    private readonly domainService: DomainService,
    private readonly logger: Logger,
  ) { }

  @Cron(DOMAIN_CHECK_QUEUE_SCHEDULE, { name: 'domainCheckQueue' })
  public async domainCheckQueue(): Promise<void> {
    try {
      this.logger.log('domain checking...');
      
      const promises: Array<Promise<DomainCheckInterface>> = [];
      while (true) {
        const domains: DomainModel[] = await this.domainService.getDomainForLastHour();
        if (domains.length === 0) {
          break;
        }
        for (const domain of domains) {
          this.logger.log(`domain to check: ${domain.id}`);
          promises.push(this.domainService.checkStatus(domain));
        }
  
        await Promise.all(promises);
      }
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
