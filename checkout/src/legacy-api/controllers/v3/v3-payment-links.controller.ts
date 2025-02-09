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
  Query,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User, ParamModel } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { OauthService } from '../../../common/services';
import { PaymentCreateResultDto } from '../../dto';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { CreatePaymentWrapperDto } from '../../dto/request/v3';
import { BusinessService, BusinessModel } from '@pe/business-kit';
import { PaymentLinkSchemaName } from '../../../mongoose-schema';
import { PaymentLinkModel } from '../../../payment-links/models/payment-link.model';
import { CreatePaymentDto } from '../../dto/request/common';
import { CreatePaymentDtoTransformer } from '../../transformer/create-payment-dto.transformer';
import { ApiVersionEnum } from '../../enum';
import { PaymentLinkService } from '../../../payment-links/services/payment-link.service';
import { PaymentLinksQueryDto } from '../../../payment-links/dto';
import { LegacyPaymentLinksService } from '../../services/legacy-payment-links.service';

@Controller('v3/payment/link')
@ApiTags('legacy-api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class V3PaymentLinksController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly businessService: BusinessService,
    private readonly paymentLinkService: PaymentLinkService,
    private readonly createPaymentDtoTransformer: CreatePaymentDtoTransformer,
    private readonly legacyPaymentLinkService: LegacyPaymentLinksService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  public async createPaymentLink(
    @User() user: AccessTokenPayload,
    @Body() dto: any,
  ): Promise<PaymentCreateResultDto> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);
    const business: BusinessModel = await this.businessService.findOneById(businessId);

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    let paymentWrapperDto: CreatePaymentWrapperDto = plainToClass(CreatePaymentWrapperDto, dto);
    if (!paymentWrapperDto) {
      paymentWrapperDto = new CreatePaymentWrapperDto();
    }

    const createPayment: CreatePaymentDto =
      await this.createPaymentDtoTransformer.v3CreatePaymentWrapperDtoToCommonCreatePayment(paymentWrapperDto, true);

    return this.legacyPaymentLinkService.createPaymentLinkFromCreatePaymentRequestDto(
      paymentWrapperDto,
      createPayment,
      businessId,
      user.clientId,
      ApiVersionEnum.v3,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.oauth)
  public async getPaymentLinks(
    @User() user: AccessTokenPayload,
    @Query() dto: PaymentLinksQueryDto,
  ): Promise<CreatePaymentWrapperDto[]> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);
    const business: BusinessModel = await this.businessService.findOneById(businessId);

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.legacyPaymentLinkService.getPaymentLinkList(businessId, dto, ApiVersionEnum.v3);
  }

  @Get(':paymentLinkId')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.oauth)
  public async getPaymentLink(
    @User() user: AccessTokenPayload,
    @ParamModel( 'paymentLinkId', PaymentLinkSchemaName) paymentLink: PaymentLinkModel,
  ): Promise<CreatePaymentWrapperDto> {
    try {
      this.oauthService.getOauthUserBusiness(user, paymentLink.business_id);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get payment link with id ${paymentLink.id}`);
    }

    if (paymentLink.is_deleted) {
      throw new NotFoundException(`Payment link with id ${paymentLink.id} not found.`);
    }

    return CreatePaymentDtoTransformer.paymentLinkToV3CreatePaymentWrapperDtoTo(paymentLink);
  }

  @Patch(':paymentLinkId')
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles(RolesEnum.oauth)
  @ApiBody({ type: CreatePaymentWrapperDto})
  public async updatePaymentLink(
    @User() user: AccessTokenPayload,
    @Body() dto: any,
    @ParamModel( 'paymentLinkId', PaymentLinkSchemaName) paymentLink: PaymentLinkModel,
  ): Promise<CreatePaymentWrapperDto> {
    try {
      this.oauthService.getOauthUserBusiness(user, paymentLink.business_id);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to update payment link with id ${paymentLink.id}`);
    }

    let paymentWrapperDto: CreatePaymentWrapperDto = plainToClass(CreatePaymentWrapperDto, dto);
    if (!paymentWrapperDto) {
      paymentWrapperDto = new CreatePaymentWrapperDto();
    }

    const createPayment: CreatePaymentDto =
      await this.createPaymentDtoTransformer.v3CreatePaymentWrapperDtoToCommonCreatePayment(paymentWrapperDto, true);

    for (const key of Object.keys(createPayment)) {
      if ((createPayment[key] === undefined) || (createPayment[key] === null)) {
        delete createPayment[key];
      }
    }

    return CreatePaymentDtoTransformer.paymentLinkToV3CreatePaymentWrapperDtoTo(
      await this.paymentLinkService.updatePaymentLinkLegacy(paymentLink._id, createPayment));
  }

  @Delete(':paymentLinkId')
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles(RolesEnum.oauth)
  public async deletePaymentLink(
    @User() user: AccessTokenPayload,
    @ParamModel( 'paymentLinkId', PaymentLinkSchemaName) paymentLink: PaymentLinkModel,
  ): Promise<void> {
    try {
      this.oauthService.getOauthUserBusiness(user, paymentLink.business_id);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to delete payment link with id ${paymentLink.id}`);
    }

    await this.paymentLinkService.markPaymentLinkDeleted(paymentLink.id);
  }

}
