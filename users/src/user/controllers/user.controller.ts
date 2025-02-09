import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  ForbiddenException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum, User, UserTokenInterface } from '@pe/nest-kit/modules/auth';
import { Model } from 'mongoose';
import { UpdateUserAccountDto, UserResponseDto } from '../dto';
import { UserAccountInterface } from '../interfaces';
import { BusinessModel, UserModel } from '../models';
import { BusinessSchemaName, UserSchemaName } from '../schemas';
import { BusinessService, UserService } from '../services';
import { environment } from '../../environments';
import { UserInfoDto } from '../dto/create-user-account';
import { MailerEventProducer } from '../producers';
import { userToUserDtoTransformer } from '../transformers/user-to-user-dto.transformer';

const contentType: string = `Content-Type`;
const jsonHeader: string = `application/json`;

@Controller('user')
@ApiBearerAuth()
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.user)
export class UserController extends AbstractController {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserModel>,
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
    private readonly mailerEventProducer: MailerEventProducer,
    private readonly logger: Logger,
  ) {
    super();
  }

  @HttpCode(HttpStatus.OK)
  @Header(contentType, jsonHeader)
  @Get('')
  @ApiBearerAuth()
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async findUserInformation(
    @User() userToken: UserTokenInterface,
  ): Promise<UserResponseDto> {
    const start: number = new Date().getTime();

    const user: UserModel = await this.userService.findOneByUserToken(userToken);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const end: number = new Date().getTime();
    this.logger.log({
      message: 'User GET /user time',
      time: end - start,
    });

    let birthday: string;
    if (user.userAccount.birthday) {
      const date: Date = new Date(user.userAccount.birthday as any);
      birthday = date.toISOString();
    }

    return {
      _id: user._id,
      birthday: birthday,
      email: user.userAccount.email,
      firstName: user.userAccount.firstName,
      hasUnfinishedBusinessRegistration: user.userAccount.hasUnfinishedBusinessRegistration,
      language: user.userAccount.language,
      lastName: user.userAccount.lastName,
      logo: user.userAccount.logo,
      phone: user.userAccount.phone,
      registrationOrigin: user.registrationOrigin,
      salutation: user.userAccount.salutation,
      shippingAddresses: user.userAccount.shippingAddresses,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Header(contentType, jsonHeader)
  @Get(':userId')
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  public async getUserInformation(
    @ParamModel(':userId', UserSchemaName, true) user: UserModel,
  ): Promise<UserModel> {
    return userToUserDtoTransformer(user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Header(contentType, jsonHeader)
  @Post('')
  @ApiBearerAuth()
  public async createUser(
    @User() userToken: UserTokenInterface,
    @Body() userInfo: UserInfoDto,
  ): Promise<UserAccountInterface & { _id: string }> {
    const {
      id,
      firstName,
      lastName,
      email,
    }: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } = userToken;
    const userModel: UserModel = await this.userService.createUserAccount(
      id,
      {
        email,
        firstName,
        hasUnfinishedBusinessRegistration: userInfo.hasUnfinishedBusinessRegistration || false,
        language: userInfo.language ? userInfo.language : 'en',
        lastName,
        registrationOrigin: userInfo.registrationOrigin || {
          account: '',
          url: '',
        },
        shippingAddresses: [],
      } as UserAccountInterface,
    );

    if (userInfo.registrationOrigin?.account === RolesEnum.merchant) {
      await this.mailerEventProducer.produceMerchantRegistrationEmailMessage(
        userToken,
        userInfo,
        environment.adminEmail,
      );
    }

    return { ...userModel.toObject().userAccount, _id: userModel._id };
  }

  @HttpCode(HttpStatus.OK)
  @Header(contentType, jsonHeader)
  @Patch('')
  @ApiBearerAuth()
  public async updateUserInformation(
    @User() userToken: UserTokenInterface,
    @Body() updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<void> {
    const user: UserModel = await this.userModel.findById(userToken.id).exec();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await this.userService.updateUserAccount(user, updateUserAccountDto);
  }

  @HttpCode(HttpStatus.OK)
  @Header(contentType, jsonHeader)
  @Patch(':userId/business/:businessId')
  @ApiBearerAuth()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async assignBusinessToUser(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userId', UserSchemaName) user: UserModel,
  ): Promise<void> {
    await this.businessService.assignBusiness(business, user);
  }

  @Delete(':userId')
  @Roles(RolesEnum.user)
  public async removeUser(
    @User() userToken: UserTokenInterface,
    @ParamModel('userId', UserSchemaName, true) user: UserModel,
  ): Promise<UserModel> {
    if (userToken.id !== user._id) {
      throw new ForbiddenException({
        error: 'Forbidden',
        message: 'app.permission.insufficient.error',
        statusCode: 403,
      });
    }

    const ownedBusinesses: BusinessModel[] = await this.businessService.getOwnedBusinesses(user._id);
    
    for (const business of ownedBusinesses) {
      await this.businessService.deleteBusiness(business);
    }

    return this.userService.remove(user);
  }
}

