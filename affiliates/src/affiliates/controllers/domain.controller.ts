import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  ParamModel,
} from '@pe/nest-kit';
import slugify from 'slugify';
import { AccessConfigModel, AffiliateBrandingModel, DomainModel } from '../models';
import { CreateDomainDto, UpdateDomainDto } from '../dto';
import { AccessConfigSchemaName, AffiliateBrandingSchemaName, DomainSchemaName } from '../schemas';
import { AccessConfigService, DomainService } from '../services';
import { DomainCheckInterface } from '../interfaces';
import { EntityExistsException } from '../../common/exceptions';
import { environment } from '../../environments';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const AFFILIATES_BRANDING_PLACEHOLDER: string = ':affiliatesBrandingId';

@Controller('business/:businessId/domain')
@ApiTags('domains')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class DomainController extends AbstractController {
  constructor(
    private readonly domainService: DomainService,
    private readonly accessConfigService: AccessConfigService,
  ) {
    super();
  }

  @Get(AFFILIATES_BRANDING_PLACEHOLDER)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Getting domains by business id',
  })
  @ApiResponse({
    description: 'Return domains',
    isArray: true,
    status: 200,
  })
  @ApiTags('list')
  public async getDomainsByShop(
    @ParamModel(AFFILIATES_BRANDING_PLACEHOLDER, AffiliateBrandingSchemaName) affiliateBranding: AffiliateBrandingModel,
  ): Promise<DomainModel[]> {
    return this.domainService.findByBranding(affiliateBranding.id);
  }

  @Post(AFFILIATES_BRANDING_PLACEHOLDER)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  @ApiOperation({
    description: 'Adding new domain for business',
  })
  @ApiResponse({
    description: 'Returns domain',
    status: 201,
  })
  @ApiTags('create')
  public async createDomain(
    @ParamModel(':affiliatesBrandingId', AffiliateBrandingSchemaName) affiliateBranding: AffiliateBrandingModel,
    @Body() dto: CreateDomainDto,
  ): Promise<DomainModel> {
    return this.domainService.create(affiliateBranding, dto);
  }

  @Patch(`${AFFILIATES_BRANDING_PLACEHOLDER}/:domainId`)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.update })
  @ApiOperation({
    description: 'Updating domain info',
  })
  @ApiResponse({
    description: 'Returns domain',
    status: 200,
  })
  @ApiTags('update')
  public async updateDomain(
    @ParamModel(':domainId', DomainSchemaName) domain: DomainModel,
    @Body() payload: UpdateDomainDto,
  ): Promise<DomainModel> {
    return this.domainService.update(domain, payload);
  }

  @Delete(`${AFFILIATES_BRANDING_PLACEHOLDER}/:domainId`)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.delete })
  @ApiOperation({
    description: 'Delete affilliate branding\'s domain',
  })
  @ApiTags('delete')
  public async deleteDomain(
    @ParamModel(':domainId', DomainSchemaName) domain: DomainModel,
  ): Promise<void> {
    await this.domainService.delete(domain);
  }

  @Post(`${AFFILIATES_BRANDING_PLACEHOLDER}/:domainId/check`)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  @ApiOperation({
    description: 'Checking domain\'s dns records',
  })
  public async checkDomainStatus(
    @ParamModel(':domainId', DomainSchemaName) domain: DomainModel,
  ): Promise<DomainCheckInterface> {
    return this.domainService.checkStatus(domain);
  }

  /* @deprecated */

  @Get(':affiliatesBrandingId/isValidName')
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async isValidNameOld(
    @ParamModel(
      {
        affiliateBranding: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_ID_PLACEHOLDER,
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
    @Query('name') name: string,
  ): Promise<{
    result: boolean;
    message?: string;
  }> {
    if (!name) {
      throw new Error(`Query param "name" is required`);
    }

    try {
      const domain: string = slugify(name).toLowerCase();
      if (await this.accessConfigService.isDomainOccupied(domain, accessConfig.business as string)) {
        throw new EntityExistsException(
          `Domain "${domain}" already exists"`,
        );
      }
  
      return { result: true };
    } catch (e) {
      return {
        message: (e && e.message) ? e.message : '',
        result: false,
      };
    }
  }
}
