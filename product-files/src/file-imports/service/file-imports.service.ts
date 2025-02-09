import { Injectable, Logger } from '@nestjs/common';
import { FileProcessorService } from '../../file-processor/services';
import { FileImportTriggeredEventDto, ImportContentDto } from '../dto';
import { ImportEventsService } from './import-events.service';
import { ImportedSummaryConverter } from '../converter';

@Injectable()
export class FileImportsService {
  constructor(
    private readonly fileProcessor: FileProcessorService,
    private readonly importEventsService: ImportEventsService,
    private readonly logger: Logger,
  ) { }

  public async handleTriggerEvent(dto: FileImportTriggeredEventDto): Promise<any> {
    try {
      const content: ImportContentDto = await this.fileProcessor.processFile(dto.fileImport);

      for (const product of content.products) {
        await this.importEventsService.sendProductImportedEvent({
          business: dto.business,
          data: product,
          synchronization: dto.synchronization,
        });
      }

      await this.importEventsService.sendImportSuccessEvent(
        dto,
        ImportedSummaryConverter.getImportedSummary(content.products),
        content.errors,
      );
    } catch (e) {
      const error: any = {
        business: dto.business,
        data: {
          error: e,
          errorMessage: e.message,
          message: `Import with task id ${dto.synchronization.taskId} failed`,
        },
        synchronization: dto.synchronization,
      };
      this.logger.error(error);
      await this.importEventsService.sendImportFailedEvent(error);
    }
  }
}
