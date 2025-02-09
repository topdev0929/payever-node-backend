import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import {
  FileImportEventInterface,
  ImportFailedEventName,
  ImportRequestedEventName,
  ImportSuccessEventName,
  ProductImportedEventName,
} from '../interfaces';
import { FileImportDto, FileImportRequestedDto, FileImportTriggeredEventDto } from '../dto';
import { ProductImportedDto } from '../dto/rabbit';
import { ImportedSummaryItemDto } from '../dto/imported-summary-item.dto';
import { PostParseErrorDto } from '../../file-processor/dto';

@Injectable()
export class ImportEventsService {
  constructor(private readonly rabbit: RabbitMqClient) { }

  public async sendProductImportedEvent(
    event: ProductImportedDto,
  ): Promise<any> {
    await this.rabbit.send(
      {
        channel: ProductImportedEventName,
        exchange: 'async_events',
      },
      {
        name: ProductImportedEventName,
        payload: event,
      },
    );
  }

  public async sendImportFailedEvent(event: FileImportEventInterface<{ }>): Promise<any> {
    await this.rabbit.send(
      {
        channel: ImportFailedEventName,
        exchange: 'async_events',
      },
      {
        name: ImportFailedEventName,
        payload: {
          ...event,
        },
      },
    );
  }

  public async sendImportSuccessEvent(
    event: FileImportTriggeredEventDto,
    importedItems: ImportedSummaryItemDto[],
    errors: PostParseErrorDto[],
  ): Promise<void> {
    await this.rabbit.send(
      {
        channel: ImportSuccessEventName,
        exchange: 'async_events',
      },
      {
        name: ImportSuccessEventName,
        payload: {
          ...event,
          errors: errors,
          items: importedItems,
        },
      },
    );
  }

  public async sendImportRequestedEvent(
    businessId: string,
    dto: FileImportDto,
  ): Promise<FileImportRequestedDto> {
    const payload: FileImportRequestedDto = {
      businessId: businessId,
      fileImport: dto,
    };
    await this.rabbit.send(
      {
        channel: ImportRequestedEventName,
        exchange: 'async_events',
      },
      {
        name: ImportRequestedEventName,
        payload: payload,
      },
    );

    return payload;
  }
}
