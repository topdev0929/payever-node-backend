import { Controller, Get, UseGuards, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, QueryDto, Roles, RolesEnum, User } from '@pe/nest-kit';
import { ApiLogFilterRequestDto, ApiLogFilterResultDto } from '../dto';
import { ApiLogService } from '../services';

@Controller('api-logs')
@ApiTags('Api logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant, RolesEnum.oauth)
export class ApiLogController {
  constructor(
    private readonly apiLogService: ApiLogService,
  ) { }

  @Get('')
  public async getLogs(
    @QueryDto() filter: ApiLogFilterRequestDto,
    @User() user: AccessTokenPayload,
  ): Promise<ApiLogFilterResultDto> {
    return this.apiLogService.getLogs(user, filter);
  }
}
