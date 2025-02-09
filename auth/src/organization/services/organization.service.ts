import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { TokensGenerationService, RolesEnum, TokensResultModel, TokenType } from '@pe/nest-kit';
import { OrganizationTokenRequestDto, UpdateOrganizationDto, CreateOrganizationDto } from '../dto';
import { OrganizationModel } from '../models';
import { OrganizationEventProducer } from '../producers';
import { OrganizationSchemaName } from '../schemas';
import { RabbitMessagesEnum } from '../../common';
import { environment } from '../../environments';
import { OAuthClient } from '../../oauth';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(OrganizationSchemaName) private readonly organizationModel: Model<OrganizationModel>,
    private readonly organizationEventProducer: OrganizationEventProducer,
    private readonly tokensGenerationService: TokensGenerationService,
  ) { }

  public async findAll(): Promise<OrganizationModel[]> {
    return this.organizationModel.find({ });
  }

  public async findById(id: string): Promise<OrganizationModel> {
    return this.organizationModel.findById(id);
  }

  public async findByIdAndAddBusiness(id: string, businessId: string): Promise<OrganizationModel> {
    const organization: OrganizationModel = await this.organizationModel.findById(id);

    if (organization) {
      return this.organizationModel.findByIdAndUpdate(
        organization._id,
        {
          $addToSet: {
            businesses: businessId,
          },
        },
        {
          new: true,
        },
      );
    }

    return organization;
  }

  public async create(dto: CreateOrganizationDto): Promise<OrganizationModel> {
    const organization: OrganizationModel = await this.organizationModel.create(dto);

    await this.organizationEventProducer.send(RabbitMessagesEnum.OrganizationCreated, organization.toObject());

    return organization;
  }

  public async update(organization: OrganizationModel, dto: UpdateOrganizationDto): Promise<OrganizationModel> {
    const updatedOrganization: OrganizationModel = await this.organizationModel.findOneAndUpdate(
      {
        _id: organization._id,
      },
      {
        $set: dto,
      },
      {
        new: true,
      },
    );

    await this.organizationEventProducer.send(RabbitMessagesEnum.OrganizationUpdated, updatedOrganization.toObject());

    return updatedOrganization;
  }

  public async remove(organization: OrganizationModel): Promise<void> {
    await this.organizationModel.findOneAndRemove(
      {
        _id: organization._id,
      },
    );
  }

  public async generateNewToken(client: OAuthClient, dto: OrganizationTokenRequestDto): Promise<TokensResultModel> {
    const organization: OrganizationModel =
      await this.findOrganizationFromClient(client);
    if (!organization) {
      throw new NotFoundException(`Organization with clientId "${dto.clientId}" not found!`);
    }

    return this.tokensGenerationService.issueOrganizationToken(
      environment.organizationTokenExpiresIn, // Default value: 1 year: 60 * 60 * 24 * 365 * 10,
      {
        clientId: dto.clientId,
        id: organization._id,
        name: organization.name,
        roles: [{
          acls: dto.scopes.map((scope: string) => {
            return {
              create: true,
              delete: true,
              microservice: scope,
              read: true,
              update: true,
            };
          }),
          name: RolesEnum.organization,
        }],
        tokenId: uuid(),
        tokenType: TokenType.common,
      },
    );
  }

  private async findOrganizationFromClient(client: OAuthClient): Promise<OrganizationModel> {
    if (!client || !client.organization) {
      return null;
    }

    return this.organizationModel.findOne({
      _id: client.organization,
    });
  }
}
