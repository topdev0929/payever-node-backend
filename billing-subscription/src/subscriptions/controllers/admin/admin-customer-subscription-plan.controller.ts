import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusinessService } from '@pe/business-kit';
import {
  AbstractController,
  AccessTokenPayload, Acl, AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
} from '@pe/nest-kit';
import { v4 as uuid } from 'uuid';

import {
  CustomerSubscriptionPlanHttpRequestDto,
  SubscribersGroupUpdateDto,
  CustomerSubscriptionPlanHttpResponsePopulatedDto,
  PlansGroupHttpRequestDto,
  PlansGroupHttpResponseDto,
  SubscribersGroupCreateDto,
  SubscribersGroupHttpResponseDto,
  CustomerSubscriptionPlanHttpResponseDto,
} from '../../dto';
import {
  ConnectionPlanModel,
  CustomerSubscriptionPlanModel, SubscribersGroupModel, SubscriptionPlansGroupModel,
} from '../../models';
import { PlanCustomerSubscriptionSchemaName } from '../../schemas';
import { CustomerSubscriptionPlanService, SubscriptionPlanGroupService, CustomerGroupsService } from '../../services';
import { PlanCustomerSubscriptionDelete, PlanCustomerSubscriptionUpdate } from '../../voters';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const MICROSERVICE: string = 'subscriptions';
const SUBSCRIPTION_PLAN_ID: string = ':subscriptionPlanId';

@Controller('admin/customer-plan-subscriptions')
@ApiTags('admin customer-plan-subscription')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminCustomerSubscriptionPlanController extends AbstractController {
  constructor(
    private readonly customerSubscriptionPlanService: CustomerSubscriptionPlanService,
    private readonly subscriptionPlanGroupService: SubscriptionPlanGroupService,
    private readonly customerGroupsService: CustomerGroupsService,
    private readonly businessService: BusinessService,
  ) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.OK, type: CustomerSubscriptionPlanHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })  
  public async createCustomerPlanSubscription(    
    @Body() createCustomerSubscriptionPlanDto: CustomerSubscriptionPlanHttpRequestDto,
  ): Promise<CustomerSubscriptionPlanHttpResponseDto> {
    return this.customerSubscriptionPlanService
      .create({
        ...createCustomerSubscriptionPlanDto,
        _id: uuid(),
      } as any);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: CustomerSubscriptionPlanHttpResponsePopulatedDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async getAllCustomerSubscriptionPlan(
  ): Promise<CustomerSubscriptionPlanHttpResponsePopulatedDto[]> {
    return this.customerSubscriptionPlanService.findPopulated({ }) as any;
  }


  @Get(SUBSCRIPTION_PLAN_ID)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: CustomerSubscriptionPlanHttpResponsePopulatedDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async getOneCustomerSubscriptionPlan(
    @ParamModel(SUBSCRIPTION_PLAN_ID, PlanCustomerSubscriptionSchemaName)
      subscriptionPlan: CustomerSubscriptionPlanModel,
  ): Promise<CustomerSubscriptionPlanHttpResponsePopulatedDto> {
    const found: any =
      await this.customerSubscriptionPlanService.findPopulated({ _id: subscriptionPlan._id });
    if (!found.length) {
      throw new NotFoundException();
    }

    return found[0];
  }

  @Put(SUBSCRIPTION_PLAN_ID)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: CustomerSubscriptionPlanHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })  
  public async update(    
    @ParamModel(SUBSCRIPTION_PLAN_ID, PlanCustomerSubscriptionSchemaName)
      subscriptionPlan: CustomerSubscriptionPlanModel,
    @Body() updateCustomerSubscriptionPlanDto: CustomerSubscriptionPlanHttpRequestDto,
  ): Promise<CustomerSubscriptionPlanHttpResponseDto> {    
    return this.customerSubscriptionPlanService.update({
      ...updateCustomerSubscriptionPlanDto,
      _id: subscriptionPlan._id,
    } as any);
  }

  @Delete(SUBSCRIPTION_PLAN_ID)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: CustomerSubscriptionPlanHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })  
  public async delete(    
    @ParamModel(SUBSCRIPTION_PLAN_ID, PlanCustomerSubscriptionSchemaName)
      subscriptionPlan: CustomerSubscriptionPlanModel,
    @Param('subscriptionPlanId') planId: string,
  ): Promise<void> {        
    await this.customerSubscriptionPlanService.delete(planId);
  }

  @Post(':subscriptionPlanId/subscribers-group')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.OK, type: SubscribersGroupHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  public async createSubscribersGroup(
    @User() user: AccessTokenPayload,
    @Body() dto: SubscribersGroupCreateDto,
  ): Promise<SubscribersGroupHttpResponseDto> {
    return this.customerGroupsService.create({
      ...dto,
      _id: uuid(),
    } as SubscribersGroupModel);
  }

  // subscribers-group

  @Get(':subscriptionPlanId/subscribers-group')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: SubscribersGroupHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  public async subscribersGroupList(
  ): Promise<SubscribersGroupHttpResponseDto[]> {
    return this.customerGroupsService.find({ });
  }

  @Get(':subscriptionPlanId/subscribers-group/:groupId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: SubscribersGroupHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })  
  public async subscribersGroup(    
    @Param('groupId') groupId: string,
  ): Promise<SubscribersGroupHttpResponseDto> {
    const found: SubscribersGroupHttpResponseDto[] = await this.customerGroupsService.find({
      _id: groupId,
    });

    if (!found.length) {
      throw new NotFoundException(`Subscribers group with id "${groupId}" not found`);
    }

    return found[0];
  }

  @Put(':subscriptionPlanId/subscribers-group/:groupId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: SubscribersGroupHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })  
  public async updateSubscribersGroup(    
    @Body() dto: SubscribersGroupUpdateDto,
    @Param('groupId') groupId: string,
  ): Promise<SubscribersGroupHttpResponseDto> {
    return this.customerGroupsService.update({
      ...dto,
      _id: groupId,
    } as SubscribersGroupModel);
  }

  @Delete(':subscriptionPlanId/subscribers-group/:groupId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: SubscribersGroupHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })  
  public async deleteSubscribersGroup(    
    @Param('groupId') groupId: string,
  ): Promise<SubscribersGroupHttpResponseDto> {
    return this.customerGroupsService.delete(groupId);
  }

  @Post(':subscriptionPlanId/plans-group')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.OK, type: SubscribersGroupHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })  
  public async createPlansGroup(    
    @Body() dto: PlansGroupHttpRequestDto,
  ): Promise<PlansGroupHttpResponseDto> {
    return this.subscriptionPlanGroupService.create({
      ...dto,
      _id: uuid(),
    } as SubscriptionPlansGroupModel);
  }

  @Get(':subscriptionPlanId/plans-group')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })  
  public async plansGroupList(
    @ParamModel(SUBSCRIPTION_PLAN_ID, PlanCustomerSubscriptionSchemaName)
      subscriptionPlan: CustomerSubscriptionPlanModel,
  ): Promise<PlansGroupHttpResponseDto[]> {
    return this.subscriptionPlanGroupService.find({ });
  }

  @Get(':subscriptionPlanId/plans-group/:groupId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async plansGroup(
    @Param('groupId') groupId: string,
  ): Promise<PlansGroupHttpResponseDto> {
    const found: PlansGroupHttpResponseDto[] = await this.subscriptionPlanGroupService.find({
      _id: groupId,
    });
    if (!found.length) {
      throw new NotFoundException();
    }

    return found[0];
  }

  @Put(':subscriptionPlanId/plans-group/:groupId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  public async updatePlansGroup(
    @User() user: AccessTokenPayload,
    @Body() dto: PlansGroupHttpRequestDto,
    @Param('groupId') groupId: string,
  ): Promise<PlansGroupHttpResponseDto> {
    return this.subscriptionPlanGroupService.update({
      ...dto,
      _id: groupId,
    } as SubscriptionPlansGroupModel);
  }

  @Delete(':subscriptionPlanId/plans-group/:groupId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.delete })
  public async deletePlansGroup(
    @User() user: AccessTokenPayload,
    @Param('groupId') groupId: string,
  ): Promise<PlansGroupHttpResponseDto> {
    return this.subscriptionPlanGroupService.delete(groupId);
  }
}
