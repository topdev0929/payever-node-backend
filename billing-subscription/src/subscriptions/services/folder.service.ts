import { Injectable } from '@nestjs/common';
import { FolderDocumentsService, FolderModelService, ListQueryDto } from '@pe/folders-plugin';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderDocumentsService: FolderDocumentsService,
  ) { }

  public async getFolder(
    businessId: string,
    listDto: ListQueryDto,
  ): Promise<any> {
    return this.folderDocumentsService.getPaginationDocuments(
      listDto,
      null,
      businessId,
    );
  }
}
