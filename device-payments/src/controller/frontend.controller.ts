import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { Model } from 'mongoose';
import {
  BusinessSetingResponseDto,
  PaymentCodeCreateDto,
  PaymentCodeResponseDto,
  PaymentFlowDto,
  SettingsDto,
} from '../dto';
import { PaymentSource } from '../enum';
import { ApplicationModel, BusinessModel, PaymentCode } from '../interfaces';
import { ApplicationSchemaName, BusinessSchemaName, PaymentCodeSchemaName } from '../schemas';
import { PaymentService, RabbitProducer } from '../services';
import { ApplicationService } from '../services/application.service';

@Controller('/api/v1')
export class FrontendController {
  constructor(
    private readonly rabbitService: RabbitProducer,
    private readonly paymentService: PaymentService,
    private readonly applicationService: ApplicationService,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(PaymentCodeSchemaName) private readonly paymentCodeModel: Model<PaymentCode>,
  ) { }

  @Post('/code/:channelSetId')
  public async createPaymentCode(
    @ParamModel({ channelSetId: ':channelSetId' }, ApplicationSchemaName, true) application: ApplicationModel,
    @Body() dto: PaymentCodeCreateDto,
  ): Promise<any> {
    return this.paymentService.createPaymentCodeByTerminal(
      application,
      PaymentSource.frontend,
      dto,
    );
  }

  @Post('/code/assign-payment-flow/:id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment flow assigned.' })
  public async assignPaymentFlow(
    @Body() dto: PaymentFlowDto,
    @ParamModel('id', PaymentCodeSchemaName, true) code: PaymentCode,
  ): Promise<void> {
    code.flow.id = dto.paymentFlowId;
    code.log.paymentFlows.push({ id: dto.paymentFlowId, assignedAt: new Date() });
    await code.save();
  }

  @Get('/code')
  @ApiResponse({ status: HttpStatus.OK, type: PaymentCodeResponseDto, description: 'return a payment code' })
  public async getPaymentCode(@Query() query: any): Promise<PaymentCode> {
    delete query.rand;
    const code: PaymentCode = await this.paymentCodeModel.findOne(query).exec();
    if (!code) {
      throw new NotFoundException('Code with provided search parameters is not found');
    }

    return code;
  }

  @Put('/:businessId/settings')
  @ApiResponse({ status: HttpStatus.OK, type: BusinessSetingResponseDto, description: 'Access granted.' })
  public async postSettings(
    @ParamModel(':businessId', 'Business', true) business: BusinessModel,
    @Body() settingsDto: SettingsDto,
  ): Promise<{ }> {
    if (!(business && business.settings && business.settings.enabled)) {
      throw new ForbiddenException('Device payments is disabled on this account');
    }

    business.settings = {
      enabled: business.settings.enabled,
      ...settingsDto,
    };
    await business.save();
    await this.rabbitService.settingsUpdated(business);

    return business.settings;
  }

  @Get('/:businessId/settings')
  public async getSettings(
    @ParamModel(':businessId', 'Business', true) business: BusinessModel,
  ): Promise<{ }>  {
    return business.settings;
  }

  @Get('/:channelSetId/channelset-settings')
  public async getSettingsByChannelSet(
    @Param('channelSetId') channelSetId: string,
  ): Promise<{ }>  {
    const application: ApplicationModel = await this.applicationService.getByChannelSet(channelSetId);
    if (!application || application === null) {
      throw new NotFoundException('Business for channelSet not found');
    }
    const business: BusinessModel = await this.businessModel.findOne({ _id: application?.businessId }).exec();

    return business?.settings;
  }
}
