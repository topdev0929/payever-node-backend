import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit/modules/auth';

import { CreateClientDto } from '../dto';
import { OAuthRabbitEventsProducer } from '../producers';
import { OAuthService } from '../services';
import { FastifyRequestWithIpInterface } from '../../auth/interfaces';
import { OAuthClient } from '../interfaces';
import { AbstractController, ParamModel } from '@pe/nest-kit';
import { OAuthClientSchemaName } from '../schemas';
import { ResponseInterceptor } from '../services/response.interceptor';
import { OrganizationModel, OrganizationService } from '../../organization';

const INVALID_CREDENTIALS: string = 'Invalid credentials.';

@Controller('oauth/:businessId/clients')
@ApiTags('oauth')
@Roles(RolesEnum.merchant)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class ClientsController extends AbstractController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly organizationService: OrganizationService,
    private readonly eventProducer: OAuthRabbitEventsProducer,
  ) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS })
  @ApiResponse({ status: HttpStatus.OK, description: 'OAuth client created.' })
  public async createClient(
    @User() user: UserTokenInterface,
    @Param('businessId') businessId: string,
    @Body() dto: CreateClientDto,
  ): Promise<OAuthClient> {
    return this.oauthService.createClient(user.id, businessId, dto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS })
  @ApiResponse({ status: HttpStatus.OK, description: 'Access granted.' })
  public async getClients(
    @Param('businessId') businessId: string,
    @Query('clients') clientsFilterIds: string[],
  ): Promise<OAuthClient[]> {
    return this.oauthService.listClients(businessId, clientsFilterIds);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS })
  @ApiResponse({ status: HttpStatus.OK, description: 'Access granted.' })
  public async getClient(
    @ParamModel('id', OAuthClientSchemaName, true) client: OAuthClient,
    @Param('businessId') businessId: string,
  ): Promise<OAuthClient> {
    const organization: OrganizationModel =
      client.organization ?
        await this.organizationService.findById(client.organization)
        : null;

    if (
      !client.businesses.includes(businessId)
      && !organization?.businesses.includes(businessId)
    ) {
      throw new BadRequestException(`Client doesn't belong to business`);
    }

    return client;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Acl({ microservice: 'settings', action: AclActionsEnum.delete })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Deleted.' })
  public async removeClient(
    @Param('id') clientId: string,
    @Param('businessId') businessId: string,
  ): Promise<void> {
    await this.oauthService.deleteBusinessClient(businessId, clientId);
    await this.eventProducer.oauthClientRemoved(businessId, clientId);
  }
}
