import { v4 as uuid } from 'uuid';
import { FilterQuery } from 'mongoose';
import {
  Controller,
  Inject,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  AclActionsEnum,
  Acl,
  AbstractController,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';

import {
  ContactsService,
  ContactDocument,
  ContactSchemaName,
} from '../../message/submodules/platform';

import {
  EventOriginEnum,
} from '../../message';
import {
  BUSINESS_ID_PLACEHOLDER,
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  CONTACT_ID_PLACEHOLDER,
  CONTACT_ID_PLACEHOLDER_C,
} from './const';
import { FastifyRequestLocal } from '../interfaces';
import { ContactCreateHttpRequestDto, ContactUpdateHttpRequestDto } from '../dto';
import { VoteCodes } from '../../message/const';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/contacts`)
@ApiTags('contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class ContactsController extends AbstractController {
  @Inject() private readonly contactsService: ContactsService;

  @Post()
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async addContact(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Body() dto: ContactCreateHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<ContactDocument> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_CONTACT,
      business,
      { userToken },
      `You have no access to create contacts in business "${business._id}"`,
    );

    return this.contactsService.create({
      ...dto,
      _id: uuid(),
      business: business._id,
    }, EventOriginEnum.MerchantHttpServer);
  }

  @Get()
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  @ApiQuery({
    name: 'filter',
    required: false,
  })
  public async findContacts(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Query() query: FastifyRequestLocal['query'],
    @User() userToken: UserTokenInterface,
  ): Promise<ContactDocument[]> {
    await this.denyAccessUnlessGranted(
      VoteCodes.READ_CONTACT,
      business,
      { userToken },
      `You have no access to read contacts of business "${business._id}"`,
    );
    const filter: FilterQuery<ContactDocument> = JSON.parse(query.filter || '{}');

    return this.contactsService.find({
      ...filter,
      business: business._id,
    });
  }

  @Get('search')
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  @ApiQuery({
    name: 'search',
    required: true,
  })
  public async searchContacts(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Query() query: { search: string },
    @User() userToken: UserTokenInterface,
  ): Promise<ContactDocument[]> {
    await this.denyAccessUnlessGranted(
      VoteCodes.READ_CONTACT,
      business,
      { userToken },
      `You have no access to read contacts of business "${business._id}"`,
    );

    return this.contactsService.find({
      $text: { $search: query.search },
      business: business._id,
    });
  }

  @Patch(CONTACT_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updateContact(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CONTACT_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
    }, ContactSchemaName) contact: ContactDocument,
    @Param(CONTACT_ID_PLACEHOLDER) swaggerContactId: string,
    @Body() dto: ContactUpdateHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<ContactDocument> {
    await this.denyAccessUnlessGranted(
      VoteCodes.READ_CONTACT,
      business,
      { userToken },
      `You have no access to update contacts in business "${business._id}"`,
    );

    return this.contactsService.update({
      ...dto,
      _id: contact._id,
    }, EventOriginEnum.MerchantHttpServer);
  }

  @Delete(CONTACT_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteContact(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CONTACT_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
    }, ContactSchemaName) contact: ContactDocument,
    @Param(CONTACT_ID_PLACEHOLDER) swaggerContactId: string,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.READ_CONTACT,
      business,
      { userToken },
      `You have no access to delete contacts in business "${business._id}"`,
    );
    await this.contactsService.delete(contact._id, EventOriginEnum.MerchantHttpServer);
  }
}
