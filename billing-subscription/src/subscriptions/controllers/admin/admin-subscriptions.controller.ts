import {
  Controller, Delete, HttpCode, HttpStatus, UseGuards, Get, Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenPayload, Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum, TokensResultModel, User,
} from '@pe/nest-kit';
import { Subscriptions } from '../../services';
import { SubscriptionSchemaName } from '../../schemas';
import { BusinessModel, BusinessSchemaName } from '../../../business';
import { SubscriptionModel } from '../../models';
import { BusinessService } from '@pe/business-kit';
import { SubscriptionQueryDto } from '../../dto';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('admin/subscriptions')
@ApiTags('admin subscriptions')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminSubscriptionsController {
  constructor(
    private readonly subscriptionsService: Subscriptions,
    private readonly businessService: BusinessService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'subscriptions', action: AclActionsEnum.read })
  public async subscriptionList(    
    @Query() query: SubscriptionQueryDto,
  ): Promise<any> {
    return this.subscriptionsService.getForAdmin(query);
  }

  @Get(':subscriptionId')
  @HttpCode(HttpStatus.OK)  
  public async getSubscriptionById(    
    @ParamModel('subscriptionId', SubscriptionSchemaName) subscription: SubscriptionModel,
  ): Promise<any> {
    return subscription;
  }


  @Delete(':subscriptionId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: 'subscriptions', action: AclActionsEnum.delete })
  public async unsubscribe(    
    @ParamModel('subscriptionId', SubscriptionSchemaName) subscription: SubscriptionModel,
  ): Promise<SubscriptionModel> {    
    return this.subscriptionsService.unsubscribe(subscription);
  }
}
