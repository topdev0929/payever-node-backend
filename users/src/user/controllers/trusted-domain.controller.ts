import { Roles, RolesEnum, JwtAuthGuard, AclActionsEnum, Acl } from '@pe/nest-kit';
import { Controller, Injectable, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TrustedDomainService } from '../services';
import { TrustedDomainInterface } from '../interfaces';

@ApiTags('Trusted domains')
@Controller('trusted-domain')
@Roles(RolesEnum.merchant)
@UseGuards(JwtAuthGuard)
@Injectable()
export class TrustedDomainController {
  constructor(
    private readonly domainService: TrustedDomainService,
  ) { }

  @Get(':businessId')
  @Roles(RolesEnum.merchant)
  @ApiBearerAuth()
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getAll(
    @Param('businessId') businessId: string,
  ): Promise<TrustedDomainInterface[]> {
    return this.domainService.getByBusiness(businessId);
  }

  @Post(':businessId')
  @Roles(RolesEnum.merchant)
  @ApiBearerAuth()
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  public async add(
    @Param('businessId') businessId: string,
    @Body('domain') domain: string,
  ): Promise<void> {
    return this.domainService.add({ businessId, domain });
  }

  @Delete(':businessId')
  @Roles(RolesEnum.merchant)
  @ApiBearerAuth()
  @Acl({ microservice: 'settings', action: AclActionsEnum.delete })
  public async delete(
    @Param('businessId') businessId: string,
    @Body('domain') domain: string,
  ): Promise<void> {
    return this.domainService.delete({ businessId, domain });
  }
}
