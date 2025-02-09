import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, ParamModel, Roles, RolesEnum, User } from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { ApiCallResultDto } from '../../dto';
import { PaymentActionService } from '../../services';
import { PaymentSchemaName } from '../../../mongoose-schema';
import { PaymentModel } from '../../models';
import { UrlActionsEnum, UrlActionsToPaymentActions } from '../../enum';
import { OauthService } from '../../../common';

@Controller('v3/payment')
@ApiTags('legacy-api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class V3ActionsController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly paymentActionService: PaymentActionService,
    private readonly logger: Logger,
  ) { }

  @Post('/:action/:id')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  public async paymentAction(
    @Req() req: FastifyRequest<any>,
    @Param('action') action: string,
    @ParamModel(
      {
        original_id: ':id',
      },
      PaymentSchemaName,
    ) payment: PaymentModel,
    @User() user: AccessTokenPayload,
    @Body() dto?: any,
  ): Promise<ApiCallResultDto> {
    let businessId: string;

    try {
      businessId = this.oauthService.getOauthUserBusiness(user, payment.business_uuid);
    } catch (e) {
      this.logger.warn({
        action: action,
        businessToFind: payment.business_uuid,
        clientId: user.clientId,
        error: e.message,
        message: `Failed to get business id from token for action`,
        paymentId: payment.original_id,
        roles: user.roles,
        tokenId: user.tokenId,
      });

      throw new ForbiddenException(`You're not allowed to get payment with id ${payment.original_id}`);
    }

    if (!UrlActionsToPaymentActions.has(action.toLowerCase())) {
      throw new NotFoundException(`Action ${action} is not supported`);
    }

    return this.paymentActionService.doAction(payment, action, dto, businessId, req);
  }

  @Delete('/claim/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.oauth)
  public async cancelClaimAction(
    @Req() req: FastifyRequest<any>,
    @ParamModel(
      {
        original_id: ':id',
      },
      PaymentSchemaName,
    ) payment: PaymentModel,
    @User() user: AccessTokenPayload,
    @Body() dto?: any,
  ): Promise<ApiCallResultDto> {
    return this.paymentAction(req, UrlActionsEnum.CLAIM_CANCEL, payment, user, dto);
  }
}
