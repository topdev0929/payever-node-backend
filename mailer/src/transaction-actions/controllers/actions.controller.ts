import { ActionDto, GetTransactionActionDto } from '../dto';
import { ActionsRetrieverService } from '../services';
import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Business Shipping Orders')
@ApiBearerAuth()
@Roles(RolesEnum.merchant, RolesEnum.admin)
@Acl({ microservice: 'transactions', action: AclActionsEnum.read })
@Controller('/transaction-actions')
export class ActionsController {
  constructor(private readonly actionsRetriever: ActionsRetrieverService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async getActions(@Body() transactionDto: GetTransactionActionDto): Promise<ActionDto[]> {
    return this.actionsRetriever.retrieveActions(transactionDto);
  }
}
