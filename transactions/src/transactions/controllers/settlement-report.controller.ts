import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post, Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenPayload,
  Acl,
  AclActionsEnum,
  Business,
  JwtAuthGuard,
  ParamModel, PermissionInterface,
  Roles,
  RolesEnum,
  User,
} from '@pe/nest-kit';
import { SettlementReportService } from '../services';
import { SettlementReportContentTypeMapping, SettlementReportRequestDto } from '../dto/settlement';
import { SettlementReportFileSchemaName } from '../schemas';
import { SettlementReportFileModel } from '../models';
import { Readable } from 'stream';
import { FastifyReply } from 'fastify';

@Controller(`settlement`)
@ApiTags('settlement')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class SettlementReportController {
  constructor(
    private readonly settlementReportService: SettlementReportService,
  ) {
  }

  @Post(`/report`)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.user, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async requestSettlementReport(
    @Body() settlementReportRequestDto: SettlementReportRequestDto,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    const businessId: string = this.getUserBusinessId(user, targetBusinessId);

    return this.settlementReportService.retrieveSettlementReport(settlementReportRequestDto, businessId);
  }

  @Get(`/report/:id`)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.user, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getStoredSettlementReport(
    @ParamModel(':id', SettlementReportFileSchemaName) settlementReportFile: SettlementReportFileModel,
    @Res() response: FastifyReply<any>,
    @Business() targetBusinessId: string,
  ): Promise<void> {
    const content: Buffer = await this.settlementReportService.getSettlementReportFileContent(settlementReportFile);

    const stream: Readable = new Readable();
    stream.push(content);
    stream.push(null);

    response.header('Content-Type', SettlementReportContentTypeMapping.get(settlementReportFile.format));
    response.header(
      'Content-Disposition',
      `attachment; filename=${settlementReportFile.id}.${settlementReportFile.format}`,
    );
    response.header('Content-Length', content.length);

    response.send(stream);
  }

  private getUserBusinessId(user: AccessTokenPayload, businessIdToFind?: string): string {
    const permissions: PermissionInterface[] =
      user.getRole(RolesEnum.merchant)?.permissions || user.getRole(RolesEnum.oauth)?.permissions || [];

    if (businessIdToFind) {
      for (const permission of permissions) {
        if (permission.businessId === businessIdToFind) {
          return businessIdToFind;
        }
      }

      throw new ForbiddenException(`You're not allowed to get the report`);
    }

    const businessId: string = permissions?.[0]?.businessId;

    if (!businessId) {
      throw new ForbiddenException(`You're not allowed to get the report`);
    }

    return businessId;
  }
}
