import {
  Controller,
  UseGuards,
  HttpStatus,
  HttpCode,
  Get,
  Post,
  Res,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { ArchivedTransactionService } from '../services';
import { TransactionSchemaName } from '../../transactions/schemas';
import { TransactionModel } from '../../transactions/models';
import { FastifyReply } from 'fastify';

const BusinessPlaceholder: string = ':businessId';
const UuidPlaceholder: string = ':uuid';

@Controller('business/:businessId')
@ApiTags('Archive business transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ArchivedTransactionsController {
  constructor(
    private readonly archivedTransactionService: ArchivedTransactionService,
  ) { }

  @Post('transaction/:uuid/archive')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.update})
  @ApiParam({ name: 'businessId'})
  public async archiveTransaction(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<void> {
    return this.archivedTransactionService.moveTransactionToArchive(transaction);
  }

  @Post('transaction/:uuid/archive/restore')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.update})
  @ApiParam({ name: 'businessId'})
  @ApiParam({ name: 'paymentId'})
  public async restoreArchiveTransaction(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<void> {
    return this.archivedTransactionService.restoreTransactionFromArchive(transaction);
  }

  @Get('download-archived-transactions')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.update})
  @ApiParam({ name: 'businessId'})
  public async downloadArchivedTransactions(
    @Param('businessId') businessId: string,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    await this.archivedTransactionService.downloadArchivedTransactions(businessId, res);
  }

}
