import { Injectable, Logger } from '@nestjs/common';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum as MediaEvent } from '@pe/media-sdk';
import { Command, EventDispatcher } from '@pe/nest-kit';
import { TerminalModel } from '../terminal/models';
import { TerminalService } from '../terminal/services';

@Injectable()
export class CheckAssignedImagesCommand {
  constructor(
    private readonly terminalService: TerminalService,
    private readonly dispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'media:check-assigned',
    describe: 'Sends media is assigned message',
  })
  public async checkAssignedMedia(): Promise<void> {
    const limit: number = 100;

    let processedCount: number = 0;
    let skip: number = 0;
    while (true) {
      const terminals: TerminalModel[] = await this.terminalService.getList({ }, limit, skip);

      if (!terminals.length) {
        break;
      }

      processedCount += terminals.length;

      for (const terminal of terminals) {
        await this.sendMediaAssignedMessage(terminal);
      }

      skip += limit;
    }

    this.logger.log(processedCount + ' terminals were processed');
  }

  private async sendMediaAssignedMessage(terminal: TerminalModel): Promise<void> {
    if (terminal.logo && terminal.business) {
      const list: string[] = [terminal.logo];

      const mediaChangedDto: MediaChangedDto = {
        container: MediaContainersEnum.Images,
        relatedEntity: {
          id: terminal.id,
          type: 'TerminalModel',
        },

        originalMediaCollection: [],
        updatedMediaCollection: list,
      };

      await this.dispatcher.dispatch(MediaEvent.MediaChanged, mediaChangedDto);
    }
  }
}
