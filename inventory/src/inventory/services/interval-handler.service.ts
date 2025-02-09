import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { environment } from '../../environments';
import { OrderService } from './order.service';

@Injectable()
export class IntervalHandlerService implements OnModuleInit, OnModuleDestroy {
  private cleanupReservationInterval: NodeJS.Timer | number;

  constructor(
    private readonly logger: Logger,
    private readonly orderService: OrderService,
  ) { }

  public async onModuleInit(): Promise<void> {
    await this.createInterval();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.clearInterval();
  }

  private async createInterval(): Promise<void>  {
    this.cleanupReservationInterval = setInterval(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      () => this.makeReservationCleanup(), environment.cleanupReservationInterval * 60 * 1000);
  }

  private async clearInterval(): Promise<void>  {
    clearInterval(this.cleanupReservationInterval as number);
  }

  private async makeReservationCleanup(): Promise<void> {
    await this.clearInterval();
    const now: number = Date.now();
    const released: number = await this.orderService.processOutdatedTemporary();

    this.logger.log(`Auto release of ${released} orders completed in ${Date.now() - now}ms`);

    await this.createInterval();
  }
}
