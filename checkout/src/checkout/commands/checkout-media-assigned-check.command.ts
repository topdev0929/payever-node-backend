import { Injectable, Logger } from '@nestjs/common';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum as MediaEvent } from '@pe/media-sdk';
import { Command, EventDispatcher } from '@pe/nest-kit';
import { CheckoutModel } from '../models';
import { CheckoutService } from '../services';

@Injectable()
export class CheckoutMediaAssignedCheckCommand {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly dispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'checkout:media-assigned:check', describe: 'Sends media is assigned message' })
  public async check(): Promise<void> {
    const limit: number = 1000;
    let processedCount: number = 0;

    let skip: number = 0;
    while (true) {
      const checkouts: CheckoutModel[] = await this.checkoutService.getList({ }, limit, skip);
      if (!checkouts.length) {
        break;
      }

      processedCount += checkouts.length;

      for (const checkout of checkouts) {
        if (checkout.logo) {
          const mediaChangedDto: MediaChangedDto = {
            container: MediaContainersEnum.Images,
            originalMediaCollection: [],
            relatedEntity: {
              id: checkout.id,
              type: 'CheckoutModel',
            },
            updatedMediaCollection: [checkout.logo],
          };

          await this.dispatcher.dispatch(MediaEvent.MediaChanged, mediaChangedDto);
        }
      }

      skip += limit;
    }

    this.logger.log(processedCount + ' checkouts were processed');
  }
}
