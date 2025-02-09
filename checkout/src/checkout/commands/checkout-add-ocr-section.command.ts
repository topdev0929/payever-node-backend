import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model, QueryCursor } from 'mongoose';
import { BusinessSchemaName, CheckoutSchemaName, SectionSchemaName } from '../../mongoose-schema';
import { CheckoutModel, CheckoutSectionModel, SectionModel } from '../models';
import { BusinessIntegrationSubscriptionService, CheckoutSection } from '../../integration';
import { BusinessModel } from '../../business';

@Injectable()
export class CheckoutAddOcrSectionCommand {
  constructor(
    @InjectModel(CheckoutSchemaName)
    private readonly checkoutModel: Model<CheckoutModel>,
    @InjectModel(SectionSchemaName)
    private readonly sectionModel: Model<SectionModel>,
    @InjectModel(BusinessSchemaName)
    private businessModel: Model<BusinessModel>,
    private readonly businessIntegrationSubscriptionService: BusinessIntegrationSubscriptionService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'checkout:add:ocr:section [--checkoutId]',
    describe: 'Add checkout ocr section to all checkouts',
  })
  public async addOcrSection(
    @Option({
      name: 'checkoutId',
    }) checkoutId?: string,
  ): Promise<void> {
    const code: CheckoutSection = CheckoutSection.Ocr;
    const query: any = { 'sections.code': { $ne: code } };
    if (checkoutId) {
      query._id = checkoutId;
    }

    const checkouts: QueryCursor<CheckoutModel> =
      this.checkoutModel.find(query).sort({ createdAt: -1 }).batchSize(50).cursor();

    const sectionModel: SectionModel = await this.sectionModel.findOne({ code });

    for await (const checkout of checkouts) {
      const choosePaymentOrder: number =
        checkout.sections.find(section => section.code === CheckoutSection.ChoosePayment)?.order;
      const business: BusinessModel = await this.businessModel.findById(checkout.businessId);
      if (!business) {
        continue;
      }
      const hasPosInstalled: boolean = await this.businessIntegrationSubscriptionService.hasPosInstalled(business);

      if (hasPosInstalled) {
        // ocr should be right after choosePayment section
        const order: number = (choosePaymentOrder ? choosePaymentOrder + 1 : null) ?? sectionModel.order;
        // if any thing existing on after the choose payment , should move below ocr
        checkout.sections?.forEach((section: CheckoutSectionModel) => {
          if (section.order === order) {
            section.order = order + 1;
          }
        });
        checkout.sections.push({
          code: sectionModel.code,
          enabled: true,
          order,
        } as any);

        await checkout.save();

        this.logger.log({
          businessId: checkout.businessId,
          checkoutId: checkout.id,
          order,
        });
      }
    }
  }

}
