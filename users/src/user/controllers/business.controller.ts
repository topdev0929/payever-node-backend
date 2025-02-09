import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';

import { Acl, AclActionsEnum, EventDispatcher, ParamModel } from '@pe/nest-kit';
import {
  AccessTokenPayload,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit/modules/auth';
import {
  BusinessListDto,
  CreateBusinessDto,
  EmailSettingsDto,
  GetBusinessDto,
  TrafficSourceDto,
  UpdateBusinessDto,
  OwnershipTransferDto,
} from '../dto';
import { UserAccountDto } from '../dto/update-user-account/user-account.dto';
import { BusinessEventsEnum, UserTypeBusinessEnum } from '../enums';
import { BusinessDetailModel, BusinessModel, UserModel } from '../models';
import { BusinessEventsProducer, MailerEventProducer } from '../producers';
import { BusinessSchemaName } from '../schemas';
import {
  BusinessAppInstallationService,
  BusinessListRetriever,
  BusinessService,
  CountryInfoService,
  TrafficSourceService,
  UserService,
} from '../services';
import { environment } from '../../environments';
import {
  CompanyDocumentsInterface,
  EmailSettingsInterface,
  TaxesInterface,
  ThemeSettingsInterface,
} from '../interfaces';
import { EmailSettingsModel } from '../models/email-settings.model';
import { EmployeeService } from '../../employees/services';
import { PositionInterface } from '../../employees/interfaces';
import { Positions } from '../../employees/enum';

const ContentType: string = 'Content-Type';
const ApplicationJson: string = 'application/json';
const invalidAuthApi: any = { status: 400, description: 'Invalid authorization token.' };
const unauthorizedApi: any = { status: 401, description: 'Unauthorized.' };
const apiResponse: any = {
  description: 'The business info have been successfully fetched.',
  isArray: false,
  status: 200,
  type: GetBusinessDto,
};

@Controller('business')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.user)
export class BusinessController {
  constructor(
    private readonly businessListRetriever: BusinessListRetriever,
    private readonly businessService: BusinessService,
    private readonly countryInfoService: CountryInfoService,
    private readonly userService: UserService,
    private readonly businessEventsProducer: BusinessEventsProducer,
    private readonly eventDispatcher: EventDispatcher,
    private readonly businessAppInstallationService: BusinessAppInstallationService,
    private readonly trafficSourceService: TrafficSourceService,
    private readonly mailerEventProducer: MailerEventProducer,
    private readonly jwtService: JwtService,
    private readonly employeeService: EmployeeService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Post('')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'The business has been successfully created.' })
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.create })
  public async createBusiness(
    @User() userToken: UserTokenInterface,
    @Body() createBusinessDto: CreateBusinessDto,
    @Body() createUserDto: UserAccountDto,
  ): Promise<BusinessModel> {
    await this.userService.createUserAccount(
      userToken.id,
      {
        email: createUserDto.email || '',
        firstName: createUserDto.firstName || '',
        language: this.countryInfoService.getCountryLanguage(createBusinessDto.companyAddress?.country),
        lastName: createUserDto.lastName || '',
        registrationOrigin: {
          account: '',
          url: '',
        },
      },
    );

    const user: UserModel = await this.userService.findOneByUserToken(userToken);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const trafficSource: TrafficSourceDto = createBusinessDto.trafficSource;
    delete createBusinessDto.trafficSource;

    const business: BusinessModel = await this.businessService.createBusiness(user, createBusinessDto);

    if (trafficSource) {
      await this.trafficSourceService.createTrafficSource(business, trafficSource);
    }

    await this.mailerEventProducer.produceBusinessCreatedEmailMessage(
      user,
      business,
      trafficSource,
      environment.adminEmail,
    );

    return business;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(':businessId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiBearerAuth()
  @ApiResponse(apiResponse)
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getBusinessInfo(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<BusinessModel> {
    const active: boolean = await this.businessService.isBusinessActive(business.owner as any, business.id);
    await business.populate('businessDetail').execPopulate();

    business.active = (active === null) ? business.active : active;
    await business.populate({
      path: 'owner',
      select: '-businesses',
    }).execPopulate();

    await this.eventDispatcher.dispatch(
      BusinessEventsEnum.BusinessInformationRequested,
      business,
      await this.businessAppInstallationService.getListByBusinessId(business.id),
    );

    const data: any = {
      _id: business._id,
      active: business.active,
      contactEmails: business.contactEmails,
      currency: business.currency,
      currencyFormat: business.currencyFormat,
      currentWallpaper: business.currentWallpaper,
      defaultLanguage: business.defaultLanguage,
      industry: business.businessDetail?.companyDetails?.industry,
      logo: business.logo,
      name: business.name,
      themeSettings: business.themeSettings,
    };

    if (data.currentWallpaper?.wallpaper) {
      data.currentWallpaper.wallpaper = `${environment.microStorageUrl}/wallpapers/${data.currentWallpaper.wallpaper}`;
    }

    return data;
  }
  

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(':businessId/detail')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiBearerAuth()
  @ApiResponse(apiResponse)
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getBusinessDetail(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<BusinessDetailModel> {
    await business.populate('businessDetail').execPopulate();

    return business.businessDetail;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(':businessId/documents')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiBearerAuth()
  @ApiResponse(apiResponse)
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getBusinessDocuments(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<CompanyDocumentsInterface> {
    return business.documents;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(':businessId/taxes')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiBearerAuth()
  @ApiResponse(apiResponse)
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getBusinessTaxes(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<TaxesInterface> {
    return business.taxes;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(':businessId/theme')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiBearerAuth()
  @ApiResponse(apiResponse)
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getBusinessThemeSetting(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<ThemeSettingsInterface> {
    return business.themeSettings;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Patch(':businessId/enable')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.update })
  @ApiBearerAuth()
  public async enableBusiness(
    @User() userToken: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<void> {
    const user: UserModel = await this.userService.findOneByUserToken(userToken);
    await this.businessService.enableBusiness(business, user);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get('')
  @ApiBearerAuth()
  @ApiResponse({
    description: 'The business list have been successfully fetched.',
    isArray: true,
    status: 200,
    type: GetBusinessDto,
  })
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async getBusinessesList(
    @Query() queryParams: BusinessListDto,
    @User() user: AccessTokenPayload,
  ): Promise<any[]> {
    return this.businessListRetriever.retrieve(queryParams, user);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Patch(':businessId')
  @Roles(RolesEnum.merchant)
  @ApiBearerAuth()
  @Acl({ microservice: 'settings', action: AclActionsEnum.update })
  public async updateBusiness(
    @User() userToken: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<BusinessModel> {
    const user: UserModel = await this.userService.findOneByUserToken(userToken);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const updatedBusiness: BusinessModel = await this.businessService.updateBusiness(business, updateBusinessDto);

    await this.businessEventsProducer.produceBusinessUpdatedEvent(user, updatedBusiness);

    return updatedBusiness;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Delete(':businessId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.delete })
  @ApiBearerAuth()
  public async deleteBusiness(
    @User() userToken: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<void> {

    await this.businessService.deleteBusiness(business);

    const user: UserModel = await this.userService.findOneByUserToken(userToken);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await this.businessEventsProducer.produceBusinessRemovedEvent(user, business);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(':businessId/info')
  @Roles(RolesEnum.anonymous)
  @ApiBearerAuth()
  public async get(
    @ParamModel('businessId', BusinessSchemaName, false) business: BusinessModel,
  ): Promise<{ _id?: string; name: string; themeSettings?: any }> {
    return pick(business, ['_id', 'name', 'themeSettings']);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Post(':businessId/send-ownership-invite')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  @ApiBearerAuth()
  public async sendOwnershipInvite(
    @User() userToken: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: OwnershipTransferDto,
  ): Promise<void> {
    const user: UserModel = await this.userService.findOneByUserToken(userToken);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (user._id !== business.owner) {
      throw new ForbiddenException('Only owner can send owner transfer invite');
    }

    if (userToken.email === dto.email) {
      throw new BadRequestException('You can not send invite to yourself');
    }

    await this.businessService.sendOwnershipInvite(business, dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Patch('/transfer-ownership')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.create })
  public async transferOwnership(
    @Query('token') token: string,
  ): Promise<void> {
    let tokenPayload: { ownerId: string; newOwnerId: string; businessId: string };

    try {
      tokenPayload = this.jwtService.verify(token);
    } catch (e) {
      throw new BadRequestException('Token is not valid');
    }

    const { 
      ownerId, 
      newOwnerId, 
      businessId,
    }: { ownerId: string; newOwnerId: string; businessId: string } = tokenPayload;

    if (!(newOwnerId && businessId && ownerId)) {
      throw new BadRequestException('Token is not valid');
    }

    const business: BusinessModel = await this.businessService.findBusiness(businessId);

    if (business.owner !== ownerId) {
      throw new ForbiddenException('Only owner can transfer the business');
    }

    return this.businessService.transferOwnership(newOwnerId, businessId);
  }


  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Patch(':businessId/transfer-ownership')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.admin)
  public async forceTransferOwnership(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: OwnershipTransferDto,
  ): Promise<void> {
    return this.businessService.forceTransferOwnership(business, dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(':businessId/secrets/email-settings')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiBearerAuth()
  public async getEmailSettings(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<EmailSettingsInterface> {
    const settings: EmailSettingsModel = await this.businessService.getEmailSettings(business);

    return this.businessService.toPasswordLessSettingsLeanObject(settings);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Patch(':businessId/secrets/email-settings')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.update })
  @ApiBearerAuth()
  public async updateEmailSettings(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: EmailSettingsDto,
  ): Promise<EmailSettingsInterface> {
    const settings: EmailSettingsModel = await this.businessService.updateEmailSettings(
      business,
      dto,
    );

    return this.businessService.toPasswordLessSettingsLeanObject(settings);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(':businessId/check-access/settings')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiBearerAuth()
  public async checkAppAccess(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @User() user: UserTokenInterface,
  ): Promise<{
    hasSettingsAccess: boolean;
    userTypeBusiness?: UserTypeBusinessEnum;
  }> {

    const isOwner: boolean = user.id === business.owner;

    if (isOwner) {
      return {
        hasSettingsAccess: true,
        userTypeBusiness: UserTypeBusinessEnum.Owner,
      };
    }

    const businessPosition: PositionInterface = await this.employeeService.employeePosition(
      user.email, 
      business._id,
    );

    if (!businessPosition) {
      
      return {
        hasSettingsAccess: false,
      };
    }

    const isAdmin: boolean = businessPosition.positionType === Positions.admin;

    return {
      hasSettingsAccess: true,
      userTypeBusiness: isAdmin ? UserTypeBusinessEnum.EmployeeAdmin : UserTypeBusinessEnum.Employee,
    };
  }
}
