import {
  Controller, Delete, HttpCode, HttpStatus, UseGuards, Get,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenPayload, Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum, TokensResultModel, User,
} from '@pe/nest-kit';
import { Subscriptions } from '../services';
import { SubscriptionSchemaName } from '../schemas';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { SubscriptionModel } from '../models';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('subscriptions')
@ApiTags('subscriptions')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: Subscriptions,
  ) { }

  @Get(':businessId')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'subscriptions', action: AclActionsEnum.read })
  public async subscriptionList(
    @ParamModel('businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionModel[]> {

    return this.subscriptionsService.getListByBusiness(business);
  }

  @Delete(':subscriptionId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: 'subscriptions', action: AclActionsEnum.delete })
  public async unsubscribe(
    @User() user: AccessTokenPayload,
    @ParamModel('subscriptionId', SubscriptionSchemaName) subscription: SubscriptionModel,
  ): Promise<SubscriptionModel> {
    return this.subscriptionsService.unsubscribe(subscription);
  }
}
