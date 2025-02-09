import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Acl, AclActionsEnum, JwtAuthGuard, QueryDto, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ListQueryDto } from '@pe/folders-plugin';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { ProductFolderDocumentsService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';

@Controller('api/folders')
@ApiTags('Folders')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class ProductFolderDocumentsController {
  constructor(
    private readonly productFolderDocumentsService: ProductFolderDocumentsService,
  ) { }

  @Get('/product/default')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  public async getDefaultFolder(): Promise<any> {
    return this.productFolderDocumentsService.getDefaultFolder();
  }

  @Get('/business/:businessId/product/dropshipping')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  public async getDropshippingProducts(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @QueryDto() listDto: ListQueryDto,
  ): Promise<any> {
    return this.productFolderDocumentsService.searchForDropshippingProducts(business, listDto);
  }

  @Get('/business/:businessId/product/imported')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  public async getImportedProducts(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @QueryDto() listDto: ListQueryDto,
  ): Promise<any> {
    return this.productFolderDocumentsService.searchForImportedProducts(business, listDto);
  }
}
