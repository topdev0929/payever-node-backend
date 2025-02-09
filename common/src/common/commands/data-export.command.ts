import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { Document } from 'mongoose';
import { AbstractDataAccessorService, DataAccessorContainer, ExportEventNamesEnum } from '@pe/common-sdk';
import { CommonDataEventProducer } from '../producer';


@Injectable()
export class DataExportCommand {

  constructor(
    private readonly logger: Logger,
    private readonly dataAccessorContainer: DataAccessorContainer,
    private readonly commonDataEventProducer: CommonDataEventProducer,
  ) { }

  @Command({ command: 'common:export <modelName>', describe: 'Export data through the bus' })
  public async exportDataCommand(
    @Positional({ name: 'modelName' }) modelName: string, // Like: ContinentModel or CommonStorageModel
  ): Promise<void> {
    const accessor: AbstractDataAccessorService<Document, any> = this.dataAccessorContainer.getAccessor(modelName);
    await this.update(modelName, accessor);
    await this.removeOutdated(modelName, accessor);
  }

  @Command({
    command: 'common:remove-outdated <modelName>',
    describe: 'Send actual identities through the bus, so outdated may be removed',
  })
  public async removeOutdatedCommand(
    @Positional({ name: 'modelName' }) modelName: string, // Like: ContinentModel or CommonStorageModel
  ): Promise<void> {
    const accessor: AbstractDataAccessorService<Document, any> = this.dataAccessorContainer.getAccessor(modelName);
    await this.removeOutdated(modelName, accessor);
  }

  private async update(modelName: string, accessor: AbstractDataAccessorService<Document, any>): Promise<void> {

    const limit: number = 100;
    let skip: number = 0;
    let documentsProcessed: number = 0;

    while (true) {
      const dataList: Document[] = await accessor.getList({ }, limit, skip);

      if (dataList.length === 0) {
        break;
      }

      await this.sendUpdateMessage(dataList, modelName);
      documentsProcessed += dataList.length;
      skip += limit;
    }

    this.logger.log(`"${documentsProcessed}" "${modelName}" documents have been exported.`);
  }

  private async removeOutdated(modelName: string, accessor: AbstractDataAccessorService<Document, any>): Promise<void> {
    const identities: any[] = await accessor.getIdentities();
    await this.commonDataEventProducer.produceRemoveOutdatedEvent(modelName, identities);
    this.logger.log(`"${modelName}" collection must have exactly "${identities.length}" documents.`);
  }

  private async sendUpdateMessage(dataList: Document[], modelName: string): Promise<void> {
    for (const document of dataList) {
      await this.commonDataEventProducer.produceUpdateEvent(modelName, document);
    }
  }
}
