import { Injectable, Logger } from '@nestjs/common';

import { Command } from '@pe/nest-kit';
import { FolderDocument, FolderModelService, FoldersService, ScopeEnum } from '@pe/folders-plugin';
import { FOLDERS } from '../folders.constants';

@Injectable()
export class TransactionsSetupDefaultFoldersCommand {
  constructor(
    private readonly folderService: FoldersService,
    private readonly folderModelService: FolderModelService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'transactions:setup-default-folders',
    describe: 'Setup Default Folders',
  })
  public async export(): Promise<void> {
    this.logger.log('Setup Default Folders started');

    const defaultRootFolder: FolderDocument = await this.folderService.getDefaultScopeRootFolder();

    for (const folder of FOLDERS) {
      const foundFolder: FolderDocument = await this.folderModelService.getFolder(folder._id);

      if (!foundFolder) {
        await this.folderModelService.create({
          ...folder,
          isProtected: true,
          scope: ScopeEnum.Default,

          parentFolderId: defaultRootFolder._id,
        });
      } else {
        await this.folderModelService.findOneAndUpdate(
          { _id: folder._id },
          {
            ...folder,
            parentFolderId: defaultRootFolder._id,
            scope: ScopeEnum.Default,
          },
        );
      }
    }

    this.logger.log('Setup Default Folders finished');
  }
}
