import { Controller, ForbiddenException, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenPayload,
  Acl, AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
} from '@pe/nest-kit';
import { SettingsFormReponseDto } from '../dtos';
import { ConnectionService, SettingsFormBuilder } from '../services';
import { ConnectionModel } from '../models';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { ConnectionSchemaName } from '../schemas';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('settings/:businessId')
@ApiTags('settings')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class SettingsController {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly settingsFormBuilder: SettingsFormBuilder,
  ) { }

  @Post('form')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.create },
    { microservice: 'connect', action: AclActionsEnum.create },
  )
  public async form(
    @User() user: AccessTokenPayload,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SettingsFormReponseDto> {
    return {
      form: await this.settingsFormBuilder.buildSettingsForm(business),
    };
  }

  @Post('/enable/:connectionId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.update },
    { microservice: 'connect', action: AclActionsEnum.update },
  )
  public async enableConnection(
    @User() user: AccessTokenPayload,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':connectionId', ConnectionSchemaName, true) connection: ConnectionModel,
  ): Promise<void> {
    if (connection.businessId !== business.id) {
      throw new ForbiddenException();
    }

    await this.connectionService.enableConnection(connection);
  }

  @Post('/disable/:connectionId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.update },
    { microservice: 'connect', action: AclActionsEnum.update },
  )
  public async disableConnection(
    @User() user: AccessTokenPayload,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':connectionId', ConnectionSchemaName, true) connection: ConnectionModel,
  ): Promise<SettingsFormReponseDto> {
    if (connection.businessId !== business.id) {
      throw new ForbiddenException();
    }

    await this.connectionService.disableConnection(connection);

    return {
      form: await this.settingsFormBuilder.buildSettingsForm(business),
    };
  }

  @Post('/disable/confirmation/:connectionId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.update },
    { microservice: 'connect', action: AclActionsEnum.update },
  )
  public async confirmDisableConnection(
    @User() user: AccessTokenPayload,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':connectionId', ConnectionSchemaName, true) connection: ConnectionModel,
  ): Promise<any> {
    if (connection.businessId !== business.id) {
      throw new ForbiddenException();
    }

    return {
      form: await this.settingsFormBuilder.buildDisableConfirmationForm(business, connection),
    };
  }
}
