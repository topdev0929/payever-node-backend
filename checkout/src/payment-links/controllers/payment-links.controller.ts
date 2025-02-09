import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  BadRequestException,
  ForbiddenException,
  Query,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { 
  JwtAuthGuard,
  Roles,
  RolesEnum,
  ParamModel,
  Acl,
  AclActionsEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { PaymentLinkService } from '../services/payment-link.service';
import { PaymentLinkModel } from '../models';
import { PaymentLinkRequestDto, PaymentLinkResultDto, PaymentLinksQueryDto } from '../dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BusinessModel } from '@pe/business-kit';
import { BusinessSchemaName, PaymentLinkSchemaName } from '../../mongoose-schema';
import { ValidationError } from 'class-validator/types/validation/ValidationError';
import { SendToDeviceRequestDto } from '../dto/request/send-to-device-request.dto';
import { SendToDeviceService } from '../services/send-to-device.service';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';

@Controller('business/:businessId/payment-link')
@ApiTags('payment-link')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class PaymentLinksController {
  constructor(
    private readonly paymentLinkService: PaymentLinkService,
    private readonly sendToDeviceService: SendToDeviceService,
    private readonly logger: Logger,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: PaymentLinkRequestDto})
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PaymentLinkResultDto,
  })
  @Acl({ microservice: 'checkout', action: AclActionsEnum.create })
  public async createPaymentLink(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @User() user: UserTokenInterface,
    @Body() data: any,
  ): Promise<PaymentLinkResultDto> {
    const paymentLinkRequest: PaymentLinkRequestDto = plainToClass(PaymentLinkRequestDto, {
      ...data,
      creator: user.email,
    });

    const errors: ValidationError[] = await validate(paymentLinkRequest);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    const paymentLinkModel: PaymentLinkModel =
      await this.paymentLinkService.createPaymentLink(paymentLinkRequest, business._id);

    return this.paymentLinkService.preparePaymentLinkResult(paymentLinkModel);
  }

  @Post('/:paymentLinkId/clone')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PaymentLinkResultDto,
  })
  public async clonePaymentLink(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('paymentLinkId', PaymentLinkSchemaName) paymentLinkModel: PaymentLinkModel,
  ): Promise<PaymentLinkResultDto> {
    if (business._id !== paymentLinkModel.business_id) {
      throw new ForbiddenException(
        `Payment link with id ${paymentLinkModel._id} doesn't belong to business ${business._id}`,
      );
    }

    const paymentLinkResult: PaymentLinkModel = await this.paymentLinkService.clonePaymentLink(
      paymentLinkModel,
    );

    return this.paymentLinkService.preparePaymentLinkResult(paymentLinkResult);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getPaymentLinks(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Query() dto: PaymentLinksQueryDto,
  ): Promise<any> {

    return this.paymentLinkService.getPaymentLinksPaginated(business, dto);
  }

  @Get(':paymentLinkId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaymentLinkResultDto,
  })
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getPaymentLink(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('paymentLinkId', PaymentLinkSchemaName) paymentLinkModel: PaymentLinkModel,
  ): Promise<PaymentLinkResultDto> {
    if (business._id !== paymentLinkModel.business_id) {
      throw new NotFoundException(
        `Payment link with id ${paymentLinkModel._id} doesn't belong to business ${business._id}`,
      );
    }

    return this.paymentLinkService.preparePaymentLinkResult(paymentLinkModel);
  }

  @Patch(':paymentLinkId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: PaymentLinkResultDto,
  })
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async updatePaymentLink(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('paymentLinkId', PaymentLinkSchemaName) paymentLinkModel: PaymentLinkModel,
    @Body() data: any,
  ): Promise<PaymentLinkResultDto> {
    if (business._id !== paymentLinkModel.business_id) {
      throw new NotFoundException(
        `Payment link with id ${paymentLinkModel._id} doesn't belong to business ${business._id}`,
      );
    }

    const paymentLinkRequest: PaymentLinkRequestDto = plainToClass<PaymentLinkRequestDto, any>(
      PaymentLinkRequestDto,
      data,
      { excludeExtraneousValues: true},
    );

    const errors: ValidationError[] = await validate(paymentLinkRequest);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    if (paymentLinkRequest.is_active && !paymentLinkModel.reusable && paymentLinkModel.payment_id) {
      throw new BadRequestException('Payment already sumbited');
    }

    const paymentLinkResult: PaymentLinkModel = await this.paymentLinkService.updatePaymentLink(
      paymentLinkModel._id,
      paymentLinkRequest,
      business._id,
    );

    return this.paymentLinkService.preparePaymentLinkResult(paymentLinkResult);
  }

  @Delete(':paymentLinkId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
  })
  @Acl({ microservice: 'checkout', action: AclActionsEnum.delete })
  public async deletePaymentLink(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('paymentLinkId', PaymentLinkSchemaName) paymentLinkModel: PaymentLinkModel,
  ): Promise<void> {
    if (business._id !== paymentLinkModel.business_id) {
      throw new NotFoundException(
        `Payment link with id ${paymentLinkModel._id} doesn't belong to business ${business._id}`,
      );
    }

    await this.paymentLinkService.markPaymentLinkDeleted(paymentLinkModel._id);
  }

  @Post('/:paymentLinkId/send-to-device')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async sendAction(
    @ParamModel('paymentLinkId', PaymentLinkSchemaName) paymentLinkModel: PaymentLinkModel,
    @Body() dto: SendToDeviceRequestDto,
  ): Promise<void> {
    const sendToDeviceRequest: SendToDeviceRequestDto = plainToClass(SendToDeviceRequestDto, dto);

    const errors: ValidationError[] = await validate(sendToDeviceRequest);
    if (errors.length) {
      throw new BadRequestException(errors);
    }
    await this.sendToDeviceService.sendToDevice(paymentLinkModel, dto);
  }
}
