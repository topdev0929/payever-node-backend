/* tslint:disable:object-literal-sort-keys */
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { PaymentCodeCreateDto, PaymentDto, PaymentQrDto } from '../dto';
import { PaymentSource, VerificationStep } from '../enum';
import { ApplicationModel, BusinessInterface, BusinessModel, CheckoutInterface, PaymentCode } from '../interfaces';
import { ApplicationSchemaName, BusinessSchemaName, PaymentCodeSchemaName } from '../schemas';
import { CodeGeneratorService } from './code-generator.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly codeGenerator: CodeGeneratorService,
    @InjectModel(PaymentCodeSchemaName) private readonly paymentCodeModel: Model<PaymentCode>,
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
  ) { }

  public async createPaymentCodeByBusiness(
    business: BusinessInterface,
    source: PaymentSource,
    dto: PaymentDto | PaymentQrDto,
  ): Promise<PaymentCode> {
    PaymentService.checkDevicePaymentsEnabled(business);
    let applicationId: string = dto.terminal_id || dto.application_id;
    if (!applicationId) {
      applicationId = this.getDefaultAppId(business, dto.application_type);
    }

    const application: ApplicationModel = await this.applicationModel
      .findOne({ applicationId })
      .populate('checkout').exec();

    if (!application) {
      throw new NotFoundException(`A terminal with the specified id ${applicationId} is not found`);
    }

    const plain: any = await this.getCodeData(business, application, source, dto);

    return this.paymentCodeModel.create(plain);
  }

  private getDefaultAppId(business: BusinessInterface, type: string): string {
    if (type) {
      const apps: any[] = business.defaultApplications.filter((defaultApplication) => defaultApplication.type === type);
      if (apps.length) {
        return apps[0]._id;
      }
    }

    if (business.defaultTerminalId) {
      return business.defaultTerminalId;
    }

    return business.defaultApplications[0]._id || null;
  }

  public async createPaymentCodeByTerminal(
    application: ApplicationModel,
    source: PaymentSource,
    dto?: PaymentCodeCreateDto,
  ): Promise<any> {
    const business: BusinessModel = await this.businessModel.findOne({ _id: application.businessId }).exec();
    PaymentService.checkDevicePaymentsEnabled(business);
    await application.populate('checkout').execPopulate();

    const plain: any = await this.getCodeData(business, application, source, dto);

    const paymentCode: PaymentCode = await this.paymentCodeModel.create(plain);

    return {
      ...paymentCode.toObject(),
      flow: {
        ...paymentCode.toObject().flow,
        business_id: paymentCode.flow.businessId,
        channel_set_id: paymentCode.flow.channelSetId,
      },

      // backward compatibility
      terminalId: paymentCode.applicationId,
    };
  }

  private async getCodeData(
    business: BusinessInterface,
    application: ApplicationModel,
    source: PaymentSource,
    dto?: PaymentDto | PaymentCodeCreateDto | PaymentQrDto,
  ): Promise<any> {
    let result: any = {
      flow: {
        businessId: application.businessId,
        channelSetId: application.channelSetId,
      },
      code: await this.codeGenerator.generate(business),

      applicationId: application.applicationId,
      type: application.type,

      log: {
        source: source,
        secondFactor: business.settings.secondFactor,
        verificationType: business.settings.verificationType,
        verificationStep: VerificationStep.initialization,
        paymentFlows: [],
      },
    };

    if (application.checkout) {
      result.checkoutId = (application.checkout as CheckoutInterface)._id;
    }

    if (dto) {
      result = _.merge(result, dto.asData());
      if (result.flow.id) {
        result.log.paymentFlows.push({ id: result.flow.id, assignedAt: new Date() });
      }
    }

    return result;
  }

  private static checkDevicePaymentsEnabled(business?: BusinessInterface): void {
    if (!(business && business.settings && business.settings.enabled)) {
      throw new ForbiddenException('Device payments is disabled on this account');
    }
  }
}
