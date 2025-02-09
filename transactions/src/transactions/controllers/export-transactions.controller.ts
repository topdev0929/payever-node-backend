import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ExportedFileResultDto, ExportQueryDto } from '../dto';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
} from '@pe/nest-kit/modules/auth';
import { Acl, AclActionsEnum, AccessTokenPayload, User } from '@pe/nest-kit';
import { QueryDto } from '@pe/nest-kit/modules/nest-decorator';
import { FastifyReply } from 'fastify';
import { ExporterService } from '../services';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExportFormatEnum } from '../enum';
import { environment } from '../../environments';
import { ExportSettlementQueryDto } from '../dto/export/export settlement-query.dto';
import { TransactionSettlementReportInterface } from '../interfaces';

@Controller()
@UseGuards(JwtAuthGuard)
@ApiResponse({
  description: 'Invalid authorization token.',
  status: HttpStatus.BAD_REQUEST,
})
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ExportTransactionsController {
  constructor(private readonly exporterService: ExporterService) { }

  @Get('settlements/reports')
  @ApiTags('business')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async exportPaymentSettlementReport(
    @User() user: AccessTokenPayload,
    @QueryDto() exportDto: ExportSettlementQueryDto,
  ): Promise<any> {
    exportDto.business_id = this.getUserBusinessId(user);

    return this.exporterService.exportSettlementPaymentsToJson(exportDto);
  }

  @Get('settlements/:payment_id')
  @ApiTags('business')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async exportSinglePaymentSettlementReport(
    @User() user: AccessTokenPayload,
    @Param('payment_id') paymentId: string,
  ): Promise<TransactionSettlementReportInterface> {
    const businessId: string = this.getUserBusinessId(user);

    return this.exporterService.exportSingleSettlementPayments(
      paymentId,
      businessId,
    );
  }

  @Get('business/:businessId/export')
  @ApiTags('business')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async exportBusinessTransactions(
    @User() user: AccessTokenPayload,
    @Param('businessId') businessId: string,
    @QueryDto() exportDto: ExportQueryDto,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    exportDto.page = 1;
    const transactionsCount: number =
      await this.exporterService.getTransactionsCount(exportDto, businessId);

    this.checkPdfLimit(
      transactionsCount,
      exportDto,
      environment.exportTransactionsCountDirectLimitMerchant,
    );

    if (
      transactionsCount > environment.exportTransactionsCountDirectLimitMerchant
    ) {
      exportDto.limit = 1000;
      await this.exporterService.sendRabbitEvent(
        exportDto,
        transactionsCount,
        user.email,
        '',
        businessId,
      );
      this.returnExportingStarted(res);
    } else {
      exportDto.limit = transactionsCount;
      const document: ExportedFileResultDto =
        await this.exporterService.exportBusinessTransactions(
          exportDto,
          businessId,
          transactionsCount,
        );
      await this.returnDocument(exportDto.format, document, res);
    }
  }

  @Get('admin/export')
  @ApiTags('admin')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.admin)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  public async exportAdminTransactions(
    @User() user: AccessTokenPayload,
    @QueryDto() exportDto: ExportQueryDto,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    exportDto.page = 1;
    const transactionsCount: number =
      await this.exporterService.getTransactionsCount(exportDto);

    this.checkPdfLimit(
      transactionsCount,
      exportDto,
      environment.exportTransactionsCountDirectLimitAdmin,
    );

    if (
      transactionsCount > environment.exportTransactionsCountDirectLimitAdmin
    ) {
      exportDto.limit = 1000;
      await this.exporterService.sendRabbitEvent(
        exportDto,
        transactionsCount,
        user.email,
      );
      this.returnExportingStarted(res);
    } else {
      exportDto.limit = transactionsCount;
      const document: ExportedFileResultDto =
        await this.exporterService.exportAdminTransactions(
          exportDto,
          transactionsCount,
        );
      await this.returnDocument(exportDto.format, document, res);
    }
  }

  @Get('user/:userId/export')
  @ApiTags('user')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.user)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async exportUserTransactions(
    @User() user: AccessTokenPayload,
    @Param('userId') userId: string,
    @QueryDto() exportDto: ExportQueryDto,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {

    exportDto.page = 1;
    const transactionsCount: number =
      await this.exporterService.getTransactionsCount(exportDto, null, userId);

    this.checkPdfLimit(
      transactionsCount,
      exportDto,
      environment.exportTransactionsCountDirectLimitMerchant,
    );
    if (
      transactionsCount > environment.exportTransactionsCountDirectLimitMerchant
    ) {
      exportDto.limit = 1000;
      await this.exporterService.sendRabbitEvent(
        exportDto,
        transactionsCount,
        user.email,
        '',
        null,
        userId,
      );
      this.returnExportingStarted(res);
    } else {
      exportDto.limit = transactionsCount;
      const document: ExportedFileResultDto =
        await this.exporterService.exportUserTransactions(
          exportDto,
          userId,
          transactionsCount,
        );
      await this.returnDocument(exportDto.format, document, res);
    }
  }

  private async returnDocument(
    exportFormat: ExportFormatEnum,
    document: ExportedFileResultDto,
    res: FastifyReply<any>,
  ): Promise<void> {
    if (exportFormat === ExportFormatEnum.pdf) {
      await this.returnDocumentByChunks(document, res);
    } else {
      await this.returnDocumentInOnePart(document, res);
    }
  }

  private getUserBusinessId(user: AccessTokenPayload): string {
    const merchantBusinessId: string = (user.getRole(RolesEnum.merchant)?.permissions ?? [])[0]?.businessId;
    const oauthBusinessId: string = (user.getRole(RolesEnum.oauth)?.permissions ?? [])[0]?.businessId;
    const businessId: string = merchantBusinessId || oauthBusinessId;

    if (!businessId) {
      throw new ForbiddenException(`You're not allowed to get the report`);
    }

    return businessId;
  }

  private returnExportingStarted(res: FastifyReply<any>): void {
    res.code(HttpStatus.ACCEPTED);
    res.send();
  }

  private async returnDocumentInOnePart(
    document: ExportedFileResultDto,
    res: FastifyReply<any>,
  ): Promise<void> {
    res.header('Content-Transfer-Encoding', `binary`);
    res.header(
      'Access-Control-Expose-Headers',
      `Content-Disposition,X-Suggested-Filename`,
    );
    res.header(
      'Content-disposition',
      `attachment;filename=${document.fileName}`,
    );
    res.send(document.data);
  }

  private async returnDocumentByChunks(
    document: ExportedFileResultDto,
    res: FastifyReply<any>,
  ): Promise<void> {
    const chunks: any[] = [];
    document.data.on('data', (chunk: any) => {
      chunks.push(chunk);
    });

    document.data.on('end', () => {
      res.header('Content-Transfer-Encoding', `binary`);
      res.header(
        'Access-Control-Expose-Headers',
        `Content-Disposition,X-Suggested-Filename`,
      );
      res.header(
        'Content-disposition',
        `attachment;filename=${document.fileName}`,
      );
      res.send(Buffer.concat(chunks));
    });
    document.data.end();
  }

  private checkPdfLimit(
    transactionsCount: number,
    exportQuery: ExportQueryDto,
    generalLimit: number,
  ): void {
    const exportCountLimit: number = Math.min(
      generalLimit,
      environment.exportTransactionsCountPdfLimit,
    );
    if (
      exportQuery.format === ExportFormatEnum.pdf &&
      transactionsCount > exportCountLimit
    ) {
      throw new BadRequestException(
        `transactions.export.error.limit_more_than_10000_not_allowed_for_pdf`,
      );
    }
  }
}
