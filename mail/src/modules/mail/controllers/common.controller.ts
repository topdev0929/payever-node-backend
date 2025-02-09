import { Controller, Get, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';

import { MailAccessConfigModel, MailModel } from '../models';
import { MailService } from '../services';


@Controller('mail')
@ApiTags('mail-by-domain')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class MailByDomainController extends AbstractController {
  constructor(
    private readonly mailService: MailService,
  ) {
    super();
  }

  @Get('by-domain')
  @Acl({ microservice: 'mail', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getMailByDomain(
    @Query('domain') domain: string,
  ): Promise<any> {
    const accessConfig: MailAccessConfigModel = await this.mailService.getByDomain(domain);
    if (!accessConfig) {
      throw new NotFoundException('Mail for domain is not found');
    }

    if (!accessConfig.isLive) {
      throw new NotFoundException('Mail is not live yet');
    }

    if (!accessConfig.mail) {
      throw new NotFoundException(`Access config of domain "${domain}" has no mail property`);
    }

    const mail: MailModel = await this.mailService.findOneById(accessConfig.mail as any);

    await mail.populate('business').execPopulate();

    const business: any = {
      ...mail.business.toObject(),
    };
    business.id = business._id;

    return {
      ...mail.toObject(),
      accessConfig: {
        ...accessConfig.toObject(),
        id: accessConfig.id,
      },
      business,
      id: mail.id,
    };
  }
}
