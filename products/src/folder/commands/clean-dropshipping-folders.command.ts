import { Injectable, Logger } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import {
  FolderDocument,
  FolderItemLocation,
  FolderItemLocationDocument,
  FolderModelService,
  FolderSchemaName,
  FoldersService,
} from '@pe/folders-plugin';
import { Command } from '@pe/nest-kit';
import { FilterQuery, Model } from 'mongoose';
import {
  IMPORT_LIST_FOLDER_ID,
  PAYEVER_MARKET_FOLDER_ID,
} from '../../../fixtures/folders';

@Injectable()
export class CleanDropshippingFoldersCommand {
  constructor(
    @InjectModel(FolderSchemaName)
    private readonly folderModel: Model<FolderDocument>,
    @InjectModel(FolderItemLocation.name)
    private readonly folderItemLocationModel: Model<FolderItemLocationDocument>,
    private readonly folderService: FoldersService,
    private readonly folderModelService: FolderModelService,
    private readonly logger: Logger,
  ) {}

  @Command({
    command: 'clean:drop-shipping-folders',
    describe: 'Clean duplicated dropshipping folders',
  })
  public async export(): Promise<void> {
    this.logger.log('Clean dropshipping folders started');

    const defaultRootFolder: FolderDocument = await this.folderService.getDefaultScopeRootFolder();

    const OLD_IMPORT_LIST_FOLDER_NAME = 'Import List';
    const OLD_PAYEVER_MARKET_FOLDER_NAME = 'payever Market';

    const filters = [
      {
        _id: { $ne: IMPORT_LIST_FOLDER_ID },
        name: OLD_IMPORT_LIST_FOLDER_NAME,
        isProtected: true,
        isHeadline: false,
        businessId: null,
        parentFolderId: defaultRootFolder.id,
      },
      {
        _id: { $ne: PAYEVER_MARKET_FOLDER_ID },
        name: OLD_PAYEVER_MARKET_FOLDER_NAME,
        isProtected: true,
        isHeadline: false,
        businessId: null,
        parentFolderId: defaultRootFolder.id,
      },
    ];

    for (const filter of filters) {
      await this.chunkedProcess(
        filter,
        10,
        async (documents: FolderDocument[]) => {
          const ids = documents.map((document) => document._id);

          await this.folderItemLocationModel.updateMany(
            {
              folderId: {
                $in: ids,
              },
            },
            {
              folderId: filter._id.$ne,
            },
          );

          await this.folderModel.updateMany(
            {
              parentFolderId: {
                $in: ids,
              },
            },
            {
              parentFolderId: filter._id.$ne,
            },
          );
        },
      );

      await this.folderModel.deleteMany(filter);
    }

    this.logger.log('Clean dropshipping folders finished');
  }

  async chunkedProcess(
    filter: FilterQuery<FolderDocument>,
    chunkLen: number,
    process: (docs: FolderDocument[]) => Promise<void>,
  ): Promise<void> {
    const count = await this.folderModelService.find(filter).count();
    for (let i = 0; i < count; i += chunkLen) {
      const start = i;
      const end = Math.min(i + chunkLen, count);
      await this.folderModelService
        .find(filter)
        .limit(end - start)
        .skip(start)
        .then((list) => process(list));
    }
  }
}
