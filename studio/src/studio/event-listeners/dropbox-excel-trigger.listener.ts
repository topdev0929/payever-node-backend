import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { EventEnum } from '../enums';
import { DropboxService } from '../services';

@Injectable()
export class DropboxExcelTriggerListener {
  constructor(
    private readonly dropboxService: DropboxService,
  ) { }

  @EventListener(EventEnum.DROPBOX_EXCEL_TRIGGER)
  public async onDropboxMiningTrigger(): Promise<void> {
    await this.dropboxService.excelTrigger();
  }
}
