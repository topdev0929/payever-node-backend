import { ActionDto, GetTransactionActionsDto } from '../dto';
import { ActionsRetrieverService } from '../services';
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@UseGuards(JwtAuthGuard)
@ApiTags('Business Shipping Orders')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@Controller('/transaction-actions')
@UsePipes(new ValidationPipe({
  transform: true,
}))
export class ActionsController {

  constructor(
    private readonly actionsRetriever: ActionsRetrieverService,
  ) { }

  @Post()
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getActions(
    @Body() getActionsDto: GetTransactionActionsDto,
  ): Promise<ActionDto[]> {
    getActionsDto = plainToClass<GetTransactionActionsDto, any>(GetTransactionActionsDto, getActionsDto);

    return this.actionsRetriever.retrieveActions(getActionsDto);
  }
}
