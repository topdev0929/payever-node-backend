import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { RetreivePlansForProductsDto, PlanHttpResponseDto } from '../dto';
import { ConnectionPlanModel, SubscriptionPlanModel } from '../models';
import { ConnectionPlans, SubscriptionPlanService } from '../services';
import { PlanResponseConverter } from '../converters';

@Controller('business/:businessId/plan')
@ApiTags('plan')
export class PlansController {
  constructor(
    private readonly connectionPlansService: ConnectionPlans,
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) { }

  @Post('/retrieve-for-products')
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
