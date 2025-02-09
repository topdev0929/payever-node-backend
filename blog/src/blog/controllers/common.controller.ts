import { Controller, Get, BadRequestException, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum, ParamModel } from '@pe/nest-kit';
import { BlogAccessConfigService, CommonService } from '../services';
import { BlogAccessConfigModel, BlogModel } from '../models';

@Controller('blog')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class CommonController extends AbstractController {
  constructor(
    private readonly blogAccessConfigService: BlogAccessConfigService,
    private readonly commonService: CommonService,
  ) {
    super();
  }

  @Get('by-domain')
  @Acl({ microservice: 'blog', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getBlogByDomain(
    @Query('domain') domain: string,
  ): Promise<BlogModel> {
    const accessConfig: BlogAccessConfigModel = await this.blogAccessConfigService.getByDomain(domain);
    if (!accessConfig) {
      throw new NotFoundException('Blog for domain is not found');
    }

    if (!accessConfig.isLive) {
      throw new NotFoundException('Blog is not live yet');
    }

    return accessConfig.blog;
  }

  @Get('theme/by-domain')
  @Acl({ microservice: 'shop', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getShopRouteByDomain(
    @Query('domain') domain: string,
  ): Promise<any> {
    if (!domain) {
      throw new BadRequestException('Query param domain is required');
    }

    return this.commonService.getBlogThemeByDomain(domain);
  }
}
