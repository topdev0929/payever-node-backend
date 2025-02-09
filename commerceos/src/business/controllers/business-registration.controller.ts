import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessProductsService } from '../services';
import { BusinessStatusesEnum, StatusesEnum } from '../enums';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.anonymous)
@Controller('business-registration')
@ApiTags('business-registration')
export class BusinessRegistrationController {
  constructor(
    readonly productService: BusinessProductsService,
  ) { }


  @Get('/form-data')
  public async getProductsGroupedByIndustries(): Promise<any> {
    return {
      businessStatuses: Object.values(BusinessStatusesEnum),
      products: await this.productService.getAllProductsGroupedByIndustry(),
      statuses: Object.values(StatusesEnum),
    };
  }

}
