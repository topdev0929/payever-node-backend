import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum } from '@pe/nest-kit';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit/modules/auth';
import { TransactionPaymentDetailsConverter } from '../converter';
import { TransactionUnpackedDetailsInterface } from '../interfaces/transaction';
import { TransactionModel } from '../models';
import { ContractService, TransactionsService } from '../services';
import { FastifyReply } from 'fastify';
import { Readable } from 'stream';
import { DownloadResourceDto } from '../dto';
import { PaymentTypesEnum } from '../enum';
import { OauthService } from '../../common/services';

@Controller('proxy')
@ApiTags('proxy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProxyController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly contractService: ContractService,
    private readonly oauthService: OauthService,
  ) { }

  @Get('download-contract/:original_id')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async downloadContract(
    @Param('original_id') transactionId: string,
    @User() user: AccessTokenPayload,
    @Res() response: FastifyReply<any>,
  ): Promise<void> {
    const transaction: TransactionModel = await this.transactionsService.findModelByParams({
      original_id: transactionId,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction by id ${transactionId} not found`);
    }

    // for legal reasons POS DE contract should NOT be downloaded via external proxy call
    if (transaction.type === PaymentTypesEnum.santanderPosDeInstallment) {
      throw new ForbiddenException('Contract download is forbidden');
    }

    const businessId: string = this.oauthService.getOauthUserBusiness(user, transaction.business_uuid);

    if (transaction.business_uuid !== businessId) {
      throw new ForbiddenException(`You're not allowed to get transaction with id ${transactionId}`);
    }

    const unpackedTransaction: TransactionUnpackedDetailsInterface = TransactionPaymentDetailsConverter.convert(
      transaction.toObject({ virtuals: true }),
    );

    const result: DownloadResourceDto =
      await this.contractService.downloadContractWithHistory(unpackedTransaction, user);

    const buffer: Buffer = Buffer.from(result.base64Content, 'base64');

    const stream: Readable = new Readable();
    stream.push(buffer);
    stream.push(null);

    response.header('Content-Type', result.contentType);
    response.header('Content-Disposition', `attachment; filename=${result.filenameWithExtension}`);
    response.header('Content-Length', buffer.length);

    response.send(stream);
  }
}
