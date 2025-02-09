import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { environment } from '../../environments';
import { AppWithAccessConfigDto } from '../dto';
import { CommonService } from '../services';

@Controller('affiliates-branding')
@ApiTags('common')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class CommonController extends AbstractController {
  constructor(
    private readonly commonService: CommonService,
  ) {
    super();
  }

  @Get('by-domain')
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  @ApiOperation({
    description: 'Checking if affiliate branding access domain exist (Used by infra)',
  })
  public async getAffiliateBrandingByDomain(
    @Query('domain') domain: string,
  ): Promise<AppWithAccessConfigDto> {
    if (!domain) {
      throw new BadRequestException('Query param domain is required');
    }

    return this.commonService.getAccessConfigByDomain(domain);
  }
}
