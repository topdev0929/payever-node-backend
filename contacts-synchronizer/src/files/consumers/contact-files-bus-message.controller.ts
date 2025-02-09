import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ImportFailedDto, ImportSuccessDto, ContactParsedRowDto } from '../dto/incoming';
import { ContactFilesRabbitMessagesEnum } from '../enums';
import { ConsumerHandlerService } from '../services';

@Controller()
export class ContactFilesBusMessageController {
  constructor(
    private readonly consumerHandlerService: ConsumerHandlerService,
  ) { }

  @MessagePattern({
    name: ContactFilesRabbitMessagesEnum.ContactRowParsed,
  })
  public async handleFileRowParsed(dto: ContactParsedRowDto): Promise<void> {
    await this.consumerHandlerService.handleFileRowParsedEvent(dto);
  }

  @MessagePattern({
    name: ContactFilesRabbitMessagesEnum.ParseSuccess,
  })
  public async handleParseSuccessEvent(dto: ImportSuccessDto): Promise<void> {
    await this.consumerHandlerService.handleParseSuccessEvent(dto);
  }

  @MessagePattern({
    name: ContactFilesRabbitMessagesEnum.ParseFailed,
  })
  public async handleParseFailedEvent(dto: ImportFailedDto): Promise<void> {
    await this.consumerHandlerService.handleParseFailedEvent(dto);
  }
}
