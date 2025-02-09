import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LegalDocumentInterface, LegalDocumentService, LegalDocumentTypesEnum } from '@pe/common-sdk';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../user/models';
import { BusinessSchemaName } from '../../user/schemas';
import { BusinessLegalDocumentDto } from '../dto';
import { BusinessLegalDocumentSchemaName } from '../schema';
import { BusinessLegalDocumentService } from '../services';

@Controller('business/:businessId/legal-document/:type')
@ApiTags('business-legal-documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BusinessLegalDocumentsController {

  constructor(
    private readonly businessLegalDocumentService: BusinessLegalDocumentService,
    private readonly legalDocumentService: LegalDocumentService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  @Put()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.update })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'The business legal document has been successfully updated.',
    isArray: false,
    status: 200,
    type: BusinessLegalDocumentDto,
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  @ApiResponse({ status: 400, description: 'Invalid authorization token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async updateDocument(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @Param('type') type: LegalDocumentTypesEnum,
    @Body() businessLegalDocument: BusinessLegalDocumentDto,
  ): Promise<LegalDocumentInterface> {
    return this.businessLegalDocumentService.updateDocument(business, type, businessLegalDocument.content);
  }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  @Get()
  @Roles(RolesEnum.anonymous)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'The business legal document has been successfully returned.',
    isArray: false,
    status: 200,
    type: BusinessLegalDocumentDto,
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  @ApiResponse({ status: 400, description: 'Invalid authorization token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async getDocument(
    @ParamModel(
      {
        business: ':businessId',
        type: ':type',
      },
      BusinessLegalDocumentSchemaName,
      false,
    ) businessDocument: LegalDocumentInterface,
    @Param('type') type: LegalDocumentTypesEnum,
  ): Promise<LegalDocumentInterface> {
    if (!businessDocument) {
      businessDocument = await this.legalDocumentService.getDocument(type);
    }

    return businessDocument;
  }
}
