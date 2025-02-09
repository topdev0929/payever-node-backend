import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload, Acl, AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
} from '@pe/nest-kit';
import { SubscriptionPlanHttpRequestDto, SubscriptionPlanHttpResponseDto } from '../dto';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { ProductModel, SubscriptionPlanModel } from '../models';
import { ProductSchemaName, SubscriptionPlanSchemaName } from '../schemas';
import { ConnectionPlans, SubscriptionPlanService } from '../services';
import { SubscriptionPlanInterface } from '../interfaces/entities';

const BusinessId: string = ':businessId';
const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const MICROSERVICE: string = 'subscriptions';

@Controller('business/:businessId/subscription-plans')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('plan')
export class SubscriptionPlansController extends AbstractController {
  constructor(
    private readonly connectionPlansService: ConnectionPlans,
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {
    super();
  }

  @Get('')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  public async subscriptionPlanList(
    @ParamModel(BusinessId, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionPlanModel[]> {

    return this.subscriptionPlanService.getByBusiness(business);
  }

  @Get('/:subscriptionPlanId')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  public async subscriptionPlanById(
    @ParamModel(':subscriptionPlanId', SubscriptionPlanSchemaName) subscriptionPlan: SubscriptionPlanModel,
  ): Promise<SubscriptionPlanModel> {

    await subscriptionPlan.populate('business').execPopulate();

    return subscriptionPlan;
  }

  @Post('')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async create(
    @User() user: AccessTokenPayload,
    @Body() createSubscriptionDto: SubscriptionPlanHttpRequestDto,
    @ParamModel(BusinessId, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionPlanInterface & { applicationScopeElasticId: string; businessScopeElasticId: string }> {
    if (
      !createSubscriptionDto.products
      && !createSubscriptionDto.billingPeriod
      && !createSubscriptionDto.interval
    ) {
      createSubscriptionDto.isDefault = true;
      createSubscriptionDto.products = [];
    }

    return this.subscriptionPlanService.create(createSubscriptionDto, business);
  }

  @Put('/:subscriptionPlanId')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async update(
    @User() user: AccessTokenPayload,
    @ParamModel(':subscriptionPlanId', SubscriptionPlanSchemaName) subscriptionPlan: SubscriptionPlanModel,
    @Body() updateSubscriptionPlanDto: SubscriptionPlanHttpRequestDto,
    @ParamModel(BusinessId, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionPlanModel> {

    return this.subscriptionPlanService.update(subscriptionPlan, updateSubscriptionPlanDto, business);
  }

  @Delete('/:subscriptionPlanId')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.delete })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async delete(
    @User() user: AccessTokenPayload,
    @ParamModel(':subscriptionPlanId', SubscriptionPlanSchemaName) subscriptionPlan: SubscriptionPlanModel,
  ): Promise<SubscriptionPlanModel> {
    await this.connectionPlansService.removePlansBySubscriptionPlan(subscriptionPlan);

    return this.subscriptionPlanService.delete(subscriptionPlan);
  }

  @Get('product/:productId')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  public async retrieveForProducts(
    @ParamModel(BusinessId, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':productId', ProductSchemaName, true) product: ProductModel,
  ): Promise<SubscriptionPlanHttpResponseDto> {
    const [subscriptionPlan]: SubscriptionPlanModel[]
      = await this.subscriptionPlanService.getSubscriptionPlansForProductsList({ ids: [product.id]}, business);
    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    return {
      appliesTo: subscriptionPlan.appliesTo,
      billingPeriod: subscriptionPlan.billingPeriod,
      business: business._id,
      categories: subscriptionPlan.categories as any,
      channelSet: subscriptionPlan.channelSet as any as string,
      interval: subscriptionPlan.interval,
      isDefault: subscriptionPlan.isDefault,
      name: subscriptionPlan.name,
      planType: subscriptionPlan.planType,
      products: subscriptionPlan.products as any,
      shortName: subscriptionPlan.shortName,
      subscribedChannelSets: subscriptionPlan.subscribedChannelSets as any as string[],
      subscribers: subscriptionPlan.subscribers as any,
      subscribersEligibility: subscriptionPlan.subscribersEligibility,
      subscribersGroups: subscriptionPlan.subscribersGroups as any,
      subscribersTotals: subscriptionPlan.subscribersTotals,
      subscriptionNetwork: subscriptionPlan.subscriptionNetwork as any,
      theme: subscriptionPlan.theme,
      totalPrice: subscriptionPlan.totalPrice,
    };
  }


  @Patch(':subscriptionPlanId/set-default')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  public async setDefault(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(':subscriptionPlanId', SubscriptionPlanSchemaName) subscriptionPlan: SubscriptionPlanModel,
  ): Promise<SubscriptionPlanModel> {
    return this.subscriptionPlanService.setDefault(subscriptionPlan._id, business._id);
  }
}
