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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  AbstractController,
  Acl, AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
} from '@pe/nest-kit';
import {
  AdminSubscriptionPlanCreateDto,
  SubscriptionPlanHttpRequestDto,
  SubscriptionPlanHttpResponseDto,
  SubscriptionPlanQueryDto,
} from '../../dto';
import { BusinessModel, BusinessSchemaName } from '../../../business';
import { ProductModel, SubscriptionPlanModel } from '../../models';
import { ProductSchemaName, SubscriptionPlanSchemaName } from '../../schemas';
import { ConnectionPlans, SubscriptionPlanService } from '../../services';
import { SubscriptionPlanInterface } from '../../interfaces/entities';
import { BusinessService } from '@pe/business-kit';


const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const MICROSERVICE: string = 'subscriptions';
const SUBSCRIPTION_PLAN_ID: string = ':subscriptionPlanId';

@Controller('admin/subscription-plans')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin subscription-plans')
export class AdminSubscriptionPlansController extends AbstractController {
  constructor(
    private readonly connectionPlansService: ConnectionPlans,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly businessService: BusinessService,
  ) {
    super();
  }

  @Get()
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  public async subscriptionPlanList(
    @Query() query: SubscriptionPlanQueryDto,
  ): Promise<any> {
    return this.subscriptionPlanService.getForAdmin(query);
  }

  @Get(SUBSCRIPTION_PLAN_ID)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  public async subscriptionPlanById(
    @ParamModel(SUBSCRIPTION_PLAN_ID, SubscriptionPlanSchemaName) subscriptionPlan: SubscriptionPlanModel,
  ): Promise<SubscriptionPlanModel> {
    await subscriptionPlan.populate('business').execPopulate();

    return subscriptionPlan;
  }

  @Post()
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async create(
    @Body() createSubscriptionDto: AdminSubscriptionPlanCreateDto,
  ): Promise<SubscriptionPlanInterface & { applicationScopeElasticId: string; businessScopeElasticId: string }> {
    if (
      !createSubscriptionDto.products
      && !createSubscriptionDto.billingPeriod
      && !createSubscriptionDto.interval
    ) {
      createSubscriptionDto.isDefault = true;
      createSubscriptionDto.products = [];
    }

    const businessId: string = createSubscriptionDto.businessId;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return this.subscriptionPlanService.create(createSubscriptionDto, business);
  }

  @Put(SUBSCRIPTION_PLAN_ID)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async update(
    @ParamModel(SUBSCRIPTION_PLAN_ID, SubscriptionPlanSchemaName) subscriptionPlan: SubscriptionPlanModel,
    @Body() updateSubscriptionPlanDto: SubscriptionPlanHttpRequestDto,
  ): Promise<SubscriptionPlanModel> {
    const businessId: string = subscriptionPlan.businessId;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return this.subscriptionPlanService.update(subscriptionPlan, updateSubscriptionPlanDto, business);
  }

  @Delete(SUBSCRIPTION_PLAN_ID)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.delete })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async delete(
    @ParamModel(SUBSCRIPTION_PLAN_ID, SubscriptionPlanSchemaName) subscriptionPlan: SubscriptionPlanModel,
  ): Promise<SubscriptionPlanModel> {
    await this.connectionPlansService.removePlansBySubscriptionPlan(subscriptionPlan);

    return this.subscriptionPlanService.delete(subscriptionPlan);
  }

  @Get('business/:businessId/product/:productId')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  public async retrieveForProducts(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':productId', ProductSchemaName, true) product: ProductModel,
  ): Promise<SubscriptionPlanHttpResponseDto> {
    const [subscriptionPlan]: SubscriptionPlanModel[]
      = await this.subscriptionPlanService.getSubscriptionPlansForProductsList({ ids: [product.id] }, business);
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
    @ParamModel(SUBSCRIPTION_PLAN_ID, SubscriptionPlanSchemaName) subscriptionPlan: SubscriptionPlanModel,
  ): Promise<SubscriptionPlanModel> {
    const businessId: string = subscriptionPlan.businessId;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return this.subscriptionPlanService.setDefault(subscriptionPlan._id, business._id);
  }
}
