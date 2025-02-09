import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { EventEnum } from '../enums';
import { DropboxService } from '../services';

@Injectable()
export class DorpboxMiningTriggerListener {
  constructor(
    private readonly dropboxService: DropboxService,
  ) { }

  @EventListener(EventEnum.DROPBOX_MINING_TRIGGER)
  public async onDropboxMiningTrigger(path: string): Promise<void> {
    await this.dropboxService.miningTrigger(path);
  }
}
