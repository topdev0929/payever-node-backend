import { Controller, Get, Param, Post, UseGuards, UseFilters } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { ProductSettingsService } from '../services';
import { ServiceExceptionFilters } from './service.exceptions.filter';

@Controller('admin/product-app-settings')
@ApiTags('admin product-app-settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@UseFilters(ServiceExceptionFilters)
export class AdminProductsSettingsController {
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
