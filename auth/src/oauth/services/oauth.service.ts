import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as crypto from 'crypto';

import { PermissionInterface, RolesEnum, TokensResultModel, UserRoleOauth, UserRoleOrganization } from '@pe/nest-kit';
import { CreateClientDto, OAuthRequestDto, OAuthResponseDto, V3OAuthRequestDto, V3OAuthResponseDto } from '../dto';
import { OAuthClient } from '../interfaces';
import { ScopeService } from './scope.service';
import {
  FastifyRequestWithIpInterface,
  RequestFingerprint,
  RequestParser,
  TokenService,
  V3FastifyRequestWithIpInterface,
} from '../../auth';
import { RabbitMessagesEnum, RmqSender } from '../../common';
import { User } from '../../users';
import { UserTokenModel } from '../../users/models';
import { environment } from '../../environments';
import { OrganizationModel, OrganizationService } from '../../organization';

@Injectable()
export class OAuthService {
  constructor(
    @InjectModel('OAuthClient') private readonly clientModel: Model<OAuthClient & Document>,
    private readonly tokenService: TokenService,
    private readonly scopeService: ScopeService,
    private readonly organizationService: OrganizationService,
    private readonly rmqSender: RmqSender,
  ) { }

  public async createClient(userId: string, businessId: string, dto: CreateClientDto): Promise<OAuthClient> {
    const secret: string = crypto.randomBytes(24).toString('hex');
    const oauthClient: OAuthClient & Document = new this.clientModel(dto);
    oauthClient.user = userId;
    oauthClient.secret = secret;

    if (dto.organizationId) {
      const organization: OrganizationModel =
        await this.organizationService.findByIdAndAddBusiness(dto.organizationId, businessId);
      if (!organization) {
        throw new BadRequestException(
          `OAuth client can not be created. No organization exist with id ${dto.organizationId}`
        );
      }
      oauthClient.organization = dto.organizationId;
    } else {
      oauthClient.businesses = [businessId];
    }

    return oauthClient.save();
  }

  public async createClientFromOrganization(organization: OrganizationModel): Promise<OAuthClient> {
    const dto: CreateClientDto = {
      name: organization.name,
      organizationId: organization._id,
      redirectUri: '',
    };

    const oauthClient: OAuthClient & Document = new this.clientModel(dto);

    const secret: string = this.generateSecret();
    oauthClient.secret = secret;

    oauthClient.organization = dto.organizationId;

    return oauthClient.save();
  }

  public async generateNewClientSecretForOrganization(organization: OrganizationModel): Promise<OAuthClient> {
    return this.clientModel.findOneAndUpdate(
      {
        organization: organization._id,
      },
      {
        $set: {
          secret: this.generateSecret(),
        },
      },
      {
        new: true,
      },
    );
  }

  public async listClients(businessId: string, clients: string[]): Promise<OAuthClient[]> {
    if (clients && clients.length) {
      return this.clientModel.find({ businesses: businessId, _id: { $in: clients } });
    }

    return this.clientModel.find({ businesses: businessId });
  }

  public async findOneById(id: string): Promise<OAuthClient> {
    return this.clientModel.findById(id);
  }

  public async findByIdClientIdAndSecret(clientId: string, clientSecret: string): Promise<OAuthClient> {
    return this.clientModel.findOne({ _id: clientId, secret: clientSecret });
  }

  public async deleteBusinessClient(businessId: string, id: string): Promise<OAuthClient> {
    const oauthClient: OAuthClient = await this.clientModel.findById(id).exec();
    if (!oauthClient) {
      throw new NotFoundException();
    }

    const organization: OrganizationModel =
      await this.organizationService.findById(oauthClient.organization);

    if (
      !oauthClient.businesses.includes(businessId)
      && !organization?.businesses.includes(businessId)
    ) {
      throw new BadRequestException(`OAuth client id: ${id} doesn't belong to business: ${businessId}`);
    }

    await this.clientModel.findByIdAndRemove(id).exec();

    return oauthClient;
  }

  public async getTokenV3(
    dto: V3OAuthRequestDto,
    request: V3FastifyRequestWithIpInterface,
  ): Promise<V3OAuthResponseDto> {
    const executionStartTime: [number, number] = process.hrtime();

    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    const client: OAuthClient = await this.clientModel
      .findOne({ _id: dto.client_id, secret: dto.client_secret })
      .populate({ path: 'user' })
      .exec();

    if (!client) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const userModel: UserTokenModel = UserTokenModel.fromUser(client.user as User, null);

    const organization: OrganizationModel =
      await this.organizationService.findById(client.organization);

    const businesses: string[] = [
      ...(organization && organization.businesses ? organization.businesses : []),
      ...(client.businesses ? client.businesses : []),
    ];

    const permissions: PermissionInterface[] = [];
    for (const businessId of businesses) {
      if (!dto.business_id || dto.business_id === businessId) {
        permissions.push({
          acls: this.scopeService.createAcls(dto.scopes ?? []),
          businessId,
        });
      }
    }

    userModel.roles = [
      {
        name: RolesEnum.oauth,
        permissions,
      } as UserRoleOauth,
    ];

    if (organization) {
      userModel.roles.push({
        acls: dto.scopes?.map((scope: string) => {
          return {
            create: true,
            delete: true,
            microservice: scope,
            read: true,
            update: true,
          };
        }),
        name: RolesEnum.organization,
      } as UserRoleOrganization);
    }

    await this.tokenService.revokeTokens((client.user as User)._id, true);

    const tokens: TokensResultModel = await this.tokenService.issueTokenFromModel(userModel, parsedRequest, client);

    const response: V3OAuthResponseDto = new V3OAuthResponseDto();
    response.access_token = tokens.accessToken;
    response.refresh_token = tokens.refreshToken;
    response.expires_in = environment.jwtOptions.signOptions.expiresIn;
    response.scopes = dto.scopes;

    const executionEndTime: [number, number] = process.hrtime(executionStartTime);
    const finalExecutionTime: number = executionEndTime[0] * 1000 + executionEndTime[1] / 1000000;

    await this.rmqSender.send(RabbitMessagesEnum.OAuthAccessTokenIssued, {
      businesses,
      clientId: client._id,
      createdAt: new Date(),
      executionTime: finalExecutionTime,
    });

    return response;
  }

  public async getToken(dto: OAuthRequestDto, request: FastifyRequestWithIpInterface): Promise<OAuthResponseDto> {
    const executionStartTime: [number, number] = process.hrtime();

    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    const client: OAuthClient = await this.clientModel
      .findOne({ _id: dto.client_id, secret: dto.client_secret })
      .populate({ path: 'user' })
      .exec();

    if (!client) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const userModel: UserTokenModel = UserTokenModel.fromUser(client.user as User, null);

    const organization: OrganizationModel =
      await this.organizationService.findById(client.organization);

    const businesses: string[] = [
      ...(organization && organization.businesses ? organization.businesses : []),
      ...(client.businesses ? client.businesses : []),
    ];

    const permissions: PermissionInterface[] = [];
    for (const businessId of businesses) {
      if (!request.query.business_id || request.query.business_id === businessId) {
        permissions.push({ businessId, acls: [] });
      }
    }

    userModel.roles = [
      {
        name: RolesEnum.oauth,
        permissions,
      } as UserRoleOauth,
    ];

    await this.tokenService.revokeTokens((client.user as User)._id, true);

    const tokens: TokensResultModel = await this.tokenService.issueTokenFromModel(userModel, parsedRequest, client);

    const response: OAuthResponseDto = new OAuthResponseDto();
    response.access_token = tokens.accessToken;
    response.refresh_token = tokens.refreshToken;
    response.expires_in = environment.jwtOptions.signOptions.expiresIn;

    const executionEndTime: [number, number] = process.hrtime(executionStartTime);
    const finalExecutionTime: number = executionEndTime[0] * 1000 + executionEndTime[1] / 1000000;

    await this.rmqSender.send(RabbitMessagesEnum.OAuthAccessTokenIssued, {
      businesses,
      clientId: client._id,
      createdAt: new Date(),
      executionTime: finalExecutionTime,
    });

    return response;
  }

  private generateSecret(): string {
    return crypto.randomBytes(24).toString('hex');
  }
}
