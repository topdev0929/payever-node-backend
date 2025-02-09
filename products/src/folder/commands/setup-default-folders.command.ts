import { Injectable, Logger } from '@nestjs/common';

import { Command } from '@pe/nest-kit';
import { FolderDocument, FolderModelService, FoldersService, ScopeEnum } from '@pe/folders-plugin';
import { FOLDERS } from '../../../fixtures/folders';

@Injectable()
export class SetupDefaultFoldersCommand {
  constructor(
    private readonly folderService: FoldersService,
    private readonly folderModelService: FolderModelService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'setup:default-folders',
    describe: 'Setup Default Folderes',
  })
  public async export(): Promise<void> {
    this.logger.log('Setup Default Folders started');
    
    const defaultRootFolder: FolderDocument = await this.folderService.getDefaultScopeRootFolder();

    for (const folder of FOLDERS) {
      const document = {
        ...folder,
        businessId: null,
        parentFolderId: defaultRootFolder._id,
        scope: ScopeEnum.Default,
      };
      await this.folderModelService.updateOrUpsertById(folder._id, document, document);
    }

    this.logger.log('Setup Default Folders finished');
  }
}
