import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { EventEnum } from '../enums';
import { DropboxService } from '../services';

@Injectable()
export class DorpboxDownloadTriggerListener {
  constructor(
    private readonly dropboxService: DropboxService,
  ) { }

  @EventListener(EventEnum.DROPBOX_DOWNLOAD_TRIGGER)
  public async onDownloadTrigger(): Promise<void> {
    await this.dropboxService.downloadTrigger();
  }
}
