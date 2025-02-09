/* eslint-disable sonarjs/no-duplicate-string */
import { Controller, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, User, UserTokenInterface } from '@pe/nest-kit/modules/auth';
import { DimensionDto } from '../dto';
import { BusinessModel } from '../models';
import { BusinessService } from '@pe/business-kit';
import { Acl, AclActionsEnum } from '@pe/nest-kit';

@Controller('business')
@ApiTags('business')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService<BusinessModel>,
  ) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: DimensionDto,
  })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async findAll(
    @User() user: UserTokenInterface,
  ): Promise<BusinessModel[]> {
    return this.businessService.findAll({
        'owner': user.id,
    });
  }
}
