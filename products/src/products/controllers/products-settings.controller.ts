import { Controller, Get, Param, Post, UseGuards, UseFilters } from '@nestjs/common';

import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { ProductSettingsService } from '../services';
import { ServiceExceptionFilters } from './service.exceptions.filter';

@Controller('product-app-settings')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@UseFilters(ServiceExceptionFilters)
export class ProductsSettingsController {
  constructor(private productSettingsService: ProductSettingsService) { }

  @Post(':businessId')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async updateSettings(
    @Param('businessId') businessId: string,
  ): Promise<any> {
    return this.productSettingsService.setWelcomeShown(businessId);
  }

  @Get(':businessId')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async getSettings(
    @Param('businessId') businessId: string,
  ): Promise<any> {
    return this.productSettingsService.getProductSettings(businessId);
  }
}
