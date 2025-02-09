import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user';
import { BusinessLegalDocumentsController } from './controllers';
import { BusinessInformationRequestedListener, BusinessLegalDocumentListener } from './event-listeners';
import { BusinessLegalDocumentsNotifier } from './notifiers';
import { BusinessLegalDocumentSchema, BusinessLegalDocumentSchemaName } from './schema';
import { BusinessLegalDocumentService } from './services';

@Module({
  controllers: [
    BusinessLegalDocumentsController,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: BusinessLegalDocumentSchemaName,
        schema: BusinessLegalDocumentSchema,
      },
    ]),
    UserModule,
  ],
  providers: [
    BusinessLegalDocumentService,
    BusinessLegalDocumentsNotifier,
    BusinessInformationRequestedListener,
    BusinessLegalDocumentListener,
  ],
})
export class LegalDocumentModule { }
