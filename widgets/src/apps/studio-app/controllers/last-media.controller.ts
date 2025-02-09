import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../../business/models';
import { MongooseModel as CommonMongooseModel } from '../../../common/enums';
import { BusinessMediaModel } from '../models';
import { BusinessMediaService } from '../services';

@Controller('studio-app/business/:businessId')
@ApiTags('widget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class LastMediaController {

  public constructor(
    private readonly businessMediaService: BusinessMediaService,
  ) { }

  @Get('last')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async retrieveLast(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<BusinessMediaModel[]> {
    return this.businessMediaService.getMediaList(business);
  }
}
