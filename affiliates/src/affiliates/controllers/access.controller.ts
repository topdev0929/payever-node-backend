import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AbstractController, Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateAccessConfigDto } from '../dto';
import { DomainCheckInterface } from '../interfaces/domain-check.interface';
import { AccessConfigSchemaName, AffiliateBrandingSchemaName } from '../schemas';
import { AccessConfigService } from '../services';
import { AccessConfigModel, AffiliateBrandingModel } from '../models';
import { environment } from '../../environments';

const BUSINESS_PLACEHOLDER: string = ':businessId';
const AFFILIATES_BRANDING_PLACEHOLDER: string = ':affiliatesBrandingId';
const ACCESS_CONFIG_PLACEHOLDER: string = ':id';

@Controller('business/:businessId/affiliates-branding/access/:affiliatesBrandingId')
@ApiTags('affiliate-branding-access')
export class AccessController extends AbstractController {
  constructor(
    private readonly accessConfigService: AccessConfigService,
  ) {
    super();    
  }

  @Patch(ACCESS_CONFIG_PLACEHOLDER)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.update })
  @ApiOperation({
    description: 'Updating access config',
  })
  public async updateAccessConfig(
    @ParamModel(
      {
        _id: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      }, 
      AffiliateBrandingSchemaName, 
      true,
    ) 
    affiliateBranding: AffiliateBrandingModel,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    return this.accessConfigService.createOrUpdate(affiliateBranding, dto);
  }

  @Get()
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Is accessConfig live',
  })
  public async getConfig(
    @ParamModel(
      {
        _id: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      }, 
      AffiliateBrandingSchemaName, 
      true,
    ) 
    affiliateBranding: AffiliateBrandingModel): Promise<AccessConfigModel> {
    return this.accessConfigService.findOrCreate(affiliateBranding);
  }

  @Get('is-live')
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Is accessConfig live',
  })
  public async getIsLiveStatus(
    @ParamModel(
      {
        affiliateBranding: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
  ): Promise<boolean> {
    return accessConfig.isLive;
  }

  @Post('domain/check')
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  @ApiOperation({
    description: 'Checking own domain\'s dns records',
  })
  public async checkStatus(
    @ParamModel(
      {
        affiliateBranding: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
  ): Promise<DomainCheckInterface> {
    return this.accessConfigService.checkStatus(accessConfig);
  }
}
