import { HttpModule, Module } from '@nestjs/common';
import { PaymentLinkService } from './services/payment-link.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentLinkSchemaName } from '../mongoose-schema';
import { PaymentLinksSchema } from '../mongoose-schema/schemas/payment-links.schema';
import { PaymentLinksController } from './controllers/payment-links.controller';
import { BusinessModule } from '../business/business.module';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { PaymentLinksFoldersConfig } from './configs/payment-links-folders.config';
import { FolderDocumentListener } from './event-listeners';
import { CheckoutPaymentLinksEsSetupCommand } from './commands';
import { SendToDeviceService } from './services/send-to-device.service';

@Module({
  controllers: [
    PaymentLinksController,
  ],
  exports: [
    PaymentLinkService,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    MongooseModule.forFeature([
      {
        name: PaymentLinkSchemaName,
        schema: PaymentLinksSchema,
      },
    ]),
    FoldersPluginModule.forFeature(PaymentLinksFoldersConfig),
  ],
  providers: [
    PaymentLinkService,
    SendToDeviceService,
    FolderDocumentListener,
    CheckoutPaymentLinksEsSetupCommand,
  ],
})

export class PaymentLinksModule { }
