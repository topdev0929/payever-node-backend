import {
  Controller,
  Get,
  Delete,
  Post,
  Patch,
  Query,
  Body,
  HttpStatus,
  UseGuards,  
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel, JwtAuthGuard, RolesEnum, Roles } from '@pe/nest-kit';
import { IntegrationSubscriptionModel } from '../models';
import { IntegrationService, IntegrationSubscriptionService } from '../services';
import { IntegrationSubscriptionQueryDto } from '../dto';
import { IntegrationSubscriptionSchemaName } from '../schemas';
import { AdminIntegrationSubscriptionDto } from '../dto/admin-integration-subscription.dto';

const INTEGRATION_SUBSCRIPTION_ID: string = ':integrationSubscriptionId';

@Controller('admin/integration-subscriptions')
@ApiTags('admin integration-subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AdminIntegrationSubscriptionsController {
  constructor(    
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
  ) { }

  @Get()  
  @HttpCode(HttpStatus.OK)
  public async getIntegrationSubscriptions(    
    @Query() query: IntegrationSubscriptionQueryDto,
  ): Promise<any> {
    return this.integrationSubscriptionService.getForAdmin(query);
  }

  @Get(INTEGRATION_SUBSCRIPTION_ID)  
  @HttpCode(HttpStatus.OK)
  public async getIntegrationSubscriptionsById(    
    @ParamModel(':integrationSubscriptionId', IntegrationSubscriptionSchemaName, true) 
    integrationSubscription: IntegrationSubscriptionModel,
  ): Promise<any> {
    return integrationSubscription;
  }


  @Post()
  @HttpCode(HttpStatus.OK)
  public async createIntegrationSubscription(
    @Body() integrationSubscriptionDto: AdminIntegrationSubscriptionDto,    
  ): Promise<IntegrationSubscriptionModel> {
    return this.integrationSubscriptionService.createForAdmin(integrationSubscriptionDto);
  }

  @Patch(INTEGRATION_SUBSCRIPTION_ID)  
  @HttpCode(HttpStatus.OK)
  public async updateIntegrationSubscription(
    @Body() integrationSubscriptionDto: AdminIntegrationSubscriptionDto,
    @ParamModel(INTEGRATION_SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName, true) 
    integrationSubscription: IntegrationSubscriptionModel,
  ): Promise<IntegrationSubscriptionModel> {    
    return this.integrationSubscriptionService.updateForAdmin(integrationSubscription._id, integrationSubscriptionDto);
  }


  @Delete(INTEGRATION_SUBSCRIPTION_ID)
  @HttpCode(HttpStatus.OK)
  public async deleteIntegrationSubscription(    
    @ParamModel(INTEGRATION_SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName, true) 
    integrationSubscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    await this.integrationSubscriptionService.deleteForAdmin(integrationSubscription._id);
  }  
}

