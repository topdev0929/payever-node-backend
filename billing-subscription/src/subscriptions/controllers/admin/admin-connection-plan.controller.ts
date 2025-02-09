import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '../../../business';
import { RetreivePlansForProductsDto, PlanHttpResponseDto } from '../../dto';
import { ConnectionPlanModel, SubscriptionPlanModel } from '../../models';
import { ConnectionPlans, SubscriptionPlanService } from '../../services';
import { PlanResponseConverter } from '../../converters';
import { BusinessService } from '@pe/business-kit';

@Controller('admin/plans')
@ApiTags('admin plan')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminConnectionPlanController {
  constructor(
    private readonly connectionPlansService: ConnectionPlans,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly businessService: BusinessService,
  ) { }

  @Post('business/:businessId/retrieve-for-products')
  @HttpCode(HttpStatus.OK)
  public async retrieveForProducts(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Body() dto: RetreivePlansForProductsDto, 
  ): Promise<PlanHttpResponseDto[]> {
    const subscriptionPlans: SubscriptionPlanModel[]
      = await this.subscriptionPlanService.getSubscriptionPlansForProductsList(dto, business);
    const plan: ConnectionPlanModel[] 
      = await this.connectionPlansService.getPlansForSubscriptionPlanList(subscriptionPlans, business);

    return PlanResponseConverter.listFromPlans(plan);
  }
}
