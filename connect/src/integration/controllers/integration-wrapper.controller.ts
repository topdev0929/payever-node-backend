import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import {
  IntegrationWrapperSubscriptionService,
} from '../services';
import { IntegrationWrapperConfigInterface } from '../interfaces';

@Controller('integration-wrapper')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiTags('integration-wrapper')
export class IntegrationWrapperController {
  constructor(
    private readonly integrationWrapperService: IntegrationWrapperSubscriptionService,
  ) { }

  @Get(':wrapperType')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findOne(
    @Param('wrapperType') wrapperType: string,
  ): Promise<IntegrationWrapperConfigInterface> {
    return this.integrationWrapperService.getWrapperConfigByType(wrapperType);
  }
}
