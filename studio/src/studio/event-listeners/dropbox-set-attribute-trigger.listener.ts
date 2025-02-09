import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { EventEnum } from '../enums';
import { DropboxService } from '../services';

@Injectable()
export class DropboxSetAttributeTriggerListener {
  constructor(
    private readonly dropboxService: DropboxService,
  ) { }

  @EventListener(EventEnum.DROPBOX_SET_ATTRIBUTE_TRIGGER)
  public async onDropboxMiningTrigger(): Promise<void> {
    await this.dropboxService.setAttributeTrigger();
  }
}
