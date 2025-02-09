import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, JwtAuthGuard, QueryDto, Roles, RolesEnum } from '@pe/nest-kit';
import { SubscriptionPlanBuilderDto, SubscriptionPlanBuilderResponseDto } from '../dto';
import { ProductModel, SubscriptionPlanModel } from '../models';
import { ConnectionPlans, FolderService, SubscriptionPlanService } from '../services';
import { ListQueryDto } from '@pe/folders-plugin';
import { BusinessService } from '@pe/business-kit/modules';

@Controller('builder')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.anonymous)
@ApiTags('plan')
export class SubscriptionPlansForBuilderController extends AbstractController {
  constructor(
    private readonly connectionPlansService: ConnectionPlans,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly businessService: BusinessService,
    private readonly folderService: FolderService,
  ) {
    super();
  }

  @Post('subscription-plans')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async subscriptionPlanListForBuilder(
    @Body() dto: SubscriptionPlanBuilderDto,
  ): Promise<SubscriptionPlanBuilderResponseDto[]> {
    const data: SubscriptionPlanModel[] = await this.subscriptionPlanService.getPlanForBuilder(dto);
    const business: any = await this.businessService.findOneById(dto.business);

    return data.map((sub: SubscriptionPlanModel) => {
      let totalPrice: number = 0;
      for (const product of (sub.products as ProductModel[])) {
        totalPrice += product.price;
      }

      return {
        billingPeriod: sub.billingPeriod,
        business: sub.business,
        currency: business.currency,
        id: sub._id,
        interval: sub.interval,
        name: sub.name,
        planType: sub.planType,
        products: sub.products,
        totalPrice,
      };
    });
  }

  @Post('folder')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async FolderForBuilder(
    @Body() dto: SubscriptionPlanBuilderDto,
    @QueryDto() listDto: ListQueryDto,
  ): Promise<any[]> {
    return this.folderService.getFolder(dto.business, listDto);
  }
}
