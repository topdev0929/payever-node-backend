/* tslint:disable:no-duplicate-string*/
import { Controller, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { DimensionDto } from '../dto';
import { DimensionModel } from '../models';
import { DimensionService } from '../services';
import { Acl, AclActionsEnum } from '@pe/nest-kit';

@Controller('dimension')
@ApiTags('dimension')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class DimensionController {
  constructor(
    private readonly dimensionService: DimensionService,
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
  public async findAll(): Promise<DimensionModel[]> {
    return this.dimensionService.findAll();
  }
}
