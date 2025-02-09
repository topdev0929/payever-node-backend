import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FileImportTriggeredEventDto } from '../dto';
import { FileImportsService } from '../service';

@Controller()
export class SynchronizerMessageBusController {
  constructor(
    private fileImportsService: FileImportsService,
  ) { }

  @MessagePattern({
    name: 'synchronizer.event.file-import.triggered',
  })
  public async fileImportsTriggered(dto: FileImportTriggeredEventDto): Promise<void> {
    await this.fileImportsService.handleTriggerEvent(dto);
  }
}
