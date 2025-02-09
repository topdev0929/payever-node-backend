import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  UserTokenInterface,
  User,
  AclActionsEnum,
  Acl,
} from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';

import { SearchDto } from '../dto';
import { SpotlightService } from '../services';


@Controller(`business/:businessId/spotlight`)
@ApiTags('spotlight')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SpotlightController {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @Get()
  @Roles(RolesEnum.admin, RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async legacySearch(
    @User() user: UserTokenInterface,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Param('businessId') swagger__businessId: string,
    @Query() dto: SearchDto,
  ): Promise<any> {
    return this.spotlightService.legacySearch(dto, business, user);
  }

  @Get('/search')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async search(
    @User() user: UserTokenInterface,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Query() dto: SearchDto,
  ): Promise<any> {
    return this.spotlightService.search(dto, business, user);
  }
}
