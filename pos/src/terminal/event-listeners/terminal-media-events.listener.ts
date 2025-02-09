import { Injectable } from '@nestjs/common';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum as MediaEvent } from '@pe/media-sdk';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { TerminalModel } from '../models';
import { TerminalEvent } from './terminal-events.enum';

@Injectable()
export class TerminalMediaEventsListener {
  constructor(
    private readonly dispatcher: EventDispatcher,
  ) { }

  @EventListener(TerminalEvent.TerminalCreated)
  public async onTerminalCreated(terminal: TerminalModel): Promise<void> {
    if (terminal.logo) {
      await terminal.populate('business').execPopulate();
      await this.triggerMediaChangedEvent([], [terminal.logo], terminal.id);
    }
  }

  @EventListener(TerminalEvent.TerminalUpdated)
  public async onTerminalUpdated(originalTerminal: TerminalModel, updatedTerminal: TerminalModel): Promise<void> {
    const originalMedia: string[] = originalTerminal.logo ? [originalTerminal.logo] : [];
    const updatedMedia: string[] = updatedTerminal.logo ? [updatedTerminal.logo] : [];
    await updatedTerminal.populate('business').execPopulate();

    await this.triggerMediaChangedEvent(originalMedia, updatedMedia, updatedTerminal.id);
  }

  @EventListener(TerminalEvent.TerminalRemoved)
  public async onTerminalRemoved(terminal: TerminalModel): Promise<void> {
    if (terminal.logo) {
      await terminal.populate('business').execPopulate();
      await this.triggerMediaChangedEvent([terminal.logo], [], terminal.id);
    }
  }

  private async triggerMediaChangedEvent(
    originalMedia: string[],
    updatedMedia: string[],
    terminalId: string,
  ): Promise<void> {
    const mediaChangedDto: MediaChangedDto = {
      container: MediaContainersEnum.Images,
      relatedEntity: {
        id: terminalId,
        type: 'TerminalModel',
      },

      originalMediaCollection: originalMedia,
      updatedMediaCollection: updatedMedia,
    };

    await this.dispatcher.dispatch(MediaEvent.MediaChanged, mediaChangedDto);
  }
}
