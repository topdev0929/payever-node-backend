import { Controller, Get, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { TerminalAccessConfigService } from '../services';
import { TerminalAccessConfigModel, TerminalModel } from '../models';

@Controller('terminal')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class DomainController extends AbstractController {
  constructor(
    private readonly terminalAccessConfigService: TerminalAccessConfigService,
  ) {
    super();
  }

  @Get('by-domain')
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getPosByDomain(
    @Query('domain') domain: string,
  ): Promise<TerminalModel & { businessId : string }> {
    const accessConfig: TerminalAccessConfigModel = await this.terminalAccessConfigService.getByDomain(domain);
    if (!accessConfig) {
      throw new NotFoundException('Terminal for domain is not found');
    }

    if (!accessConfig.isLive) {
      throw new NotFoundException('Terminal is not live yet');
    }

    await accessConfig.terminal.populate('business').execPopulate();

    return {
      ...accessConfig.terminal.toObject(),
      business: {
        ...accessConfig.terminal.business.toObject(),
        id: accessConfig.terminal.business.id,
      },
      businessId: accessConfig.terminal.business.id,
      defaultLocale: accessConfig.terminal.business.defaultLanguage,
      id: accessConfig.terminal.id,
    } as TerminalModel & { businessId : string };
  }
}
