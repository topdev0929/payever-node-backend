import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import * as fastify from 'fastify';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit/modules/auth';
import { ParamModel } from '@pe/nest-kit';
import { ReportRequestDto } from '../dto/reports';
import { ReportDetailService, ReportService } from '../services';
import { Report, ReportDocument } from '../schemas';

@Controller('report')
@ApiTags('report')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly reportDetailService: ReportDetailService,
  ) { }

  @Post()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  public async initReport(
    @Body() reportRequestDto: ReportRequestDto,
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    const [, token]: RegExpMatchArray = req.headers.authorization.match(/Bearer (.+)/);
    const response: any = await this.reportService.initReport(reportRequestDto.bulkImportId, token, req.headers['user-agent']);
    res.status(HttpStatus.CREATED).send(response);
  }

  @Delete(':reportId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.delete })
  public async deleteReport(
    @ParamModel('reportId', Report.name) report: ReportDocument,
  ): Promise<void> {
    await this.reportService.delete(report._id);
  }

  @Get('result/:reportId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getReport(
    @ParamModel('reportId', Report.name) report: ReportDocument,
  ): Promise<any> {
    return this.reportDetailService.aggregateReportResult(report._id);
  }
}
