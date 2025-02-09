import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, RolesEnum, ParamModel, UserRoleOauth } from '@pe/nest-kit';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LegacyApiProcessor } from '../services';
import { PaymentLinkSchemaName } from '../../mongoose-schema';
import { PaymentLinkModel } from '../../payment-links/models';
import { PaymentCreateResultDto } from '../dto';
import { PaymentLinkPrivacyDto } from '../../payment-links/dto';
import { PaymentLinkService } from '../../payment-links/services/payment-link.service';

@Controller('/payment/link')
@ApiTags('legacy-api')
export class PaymentLinksCheckoutController {
  constructor(
    private readonly legacyApiProcessor: LegacyApiProcessor,
    private readonly paymentLinkService: PaymentLinkService,
  ) { }

  @Get(':paymentLinkId')
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  public async createApiCall(
    @Query() privacyData: PaymentLinkPrivacyDto,
    @Req() request: FastifyRequest<any>,
    @ParamModel( 'paymentLinkId', PaymentLinkSchemaName) paymentLink: PaymentLinkModel,
    @Res() res: FastifyReply<any>,
  ): Promise<any> {
    let redirectUrl: string;
    if (paymentLink.is_active) {
      try {
        this.paymentLinkService.checkPaymentLinkExpired(paymentLink);
      } catch (err) {
        await this.paymentLinkService.updatePaymentLinkIsActive(paymentLink._id, false);
        redirectUrl = this.paymentLinkService.prepareErrorRedirectLink(err.message);
      }
    } else {
      redirectUrl = this.paymentLinkService.prepareErrorRedirectLink('This link is not available');
    }

    if (redirectUrl) {
      res.status(HttpStatus.MOVED_PERMANENTLY).redirect(redirectUrl);
    }

    const user: AccessTokenPayload = new AccessTokenPayload();
    user.clientId = paymentLink.client_id;
    user.roles = [];
    user.roles.push({
      name: RolesEnum.oauth,
      permissions: [
        {
          acls: [],
          businessId: paymentLink.business_id,
        },
      ],
    } as UserRoleOauth);

    const apiCallResultDto: PaymentCreateResultDto =
      await this.legacyApiProcessor.processCreatePaymentLink({ request, user }, paymentLink, privacyData);

    if (apiCallResultDto.redirect_url) {
      await this.paymentLinkService.assignApiCall(paymentLink, apiCallResultDto.call.id);

      await this.paymentLinkService.increaseViewsCountById(paymentLink._id);

      res
        .status(HttpStatus.MOVED_PERMANENTLY)
        .redirect(`${apiCallResultDto.redirect_url}&forceHidePreviousSteps=true`);
    } else {
      res
        .status(HttpStatus.OK)
        .send(apiCallResultDto);
    }
  }

}
