import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { FileImportModel } from '@pe/synchronizer-kit';
import { SynchronizationTaskModel } from '../../../src/synchronizer/models';
import { FileImportSchemaName, SynchronizationTaskSchemaName } from '../../../src/synchronizer/schemas';
import { businessFactory, fileImportFactory, synchronizationTaskFactory } from '../factories';
import { getModelToken } from '@nestjs/mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';

const SYNCHRONIZATION_TASK_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const FILE_IMPORT_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class SynchronizationTaskNoOverwriteFixture extends BaseFixture {

  private readonly synchronizationTaskModel: Model<SynchronizationTaskModel> = this.application.get(
    getModelToken(SynchronizationTaskSchemaName),
  );

  private readonly businessModel: Model<BusinessModel> = this.application.get(
    getModelToken(BusinessSchemaName),
  );

  private readonly fileImportModel: Model<FileImportModel> = this.application.get(
    getModelToken(FileImportSchemaName),
  );

  public async apply(): Promise<void> {

    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID,
    }));

    await this.synchronizationTaskModel.create(synchronizationTaskFactory({
      _id: SYNCHRONIZATION_TASK_ID,
      businessId: BUSINESS_ID,
      fileImportId: FILE_IMPORT_ID,
    }));

    await this.fileImportModel.create(fileImportFactory({
      _id: FILE_IMPORT_ID,
      overwriteExisting: false,
    }));
  }
}

export = SynchronizationTaskNoOverwriteFixture;
