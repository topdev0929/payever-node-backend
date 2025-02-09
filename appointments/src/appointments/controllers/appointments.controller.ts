import { LeanDocument } from 'mongoose';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  QueryDto,
} from '@pe/nest-kit';

import { ListQueryDto, PagingResultDto } from '../dto';
import { ElasticSearchService } from '../services';
import { AppointmentDocument } from '../schemas';
import { getUserBusinessFilterProto } from '../../common/base.resolver';

@Controller('es')
@ApiTags('es')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AppointmentsController {
  constructor(private readonly elasticSearchService: ElasticSearchService) { }

  @Get('list/:businessId')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  public async getList(
    @QueryDto() listDto: ListQueryDto = new ListQueryDto(),
    @Param('businessId') businessId: string,
  ): Promise<PagingResultDto<unknown>> {
    const filter: any = this.elasticSearchService.getFilter([businessId], listDto.filters);
    const result: {
      collection: unknown[];
      total: number;
    } = await this.elasticSearchService.search(filter, listDto.sorting, listDto.paging);

    return {
      collection: result.collection,
      filters: listDto.filters,
    };
  }
}
