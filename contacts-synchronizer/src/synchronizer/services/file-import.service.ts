import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentDefinition } from 'mongoose';
import {
  FileImportModel,
} from '@pe/synchronizer-kit';

import { FileImportSchemaName } from '../schemas';

@Injectable()
export class FileImportService {
  constructor(
    @InjectModel(FileImportSchemaName)
      private readonly fileImportModel: Model<FileImportModel>,
  ) { }

  public async create(data: DocumentDefinition<FileImportModel>): Promise<FileImportModel> {
    return this.fileImportModel.create(data);
  }
}
