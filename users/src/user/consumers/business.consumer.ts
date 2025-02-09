import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessModel, UserModel } from '../models';
import { BusinessSchemaName, UserSchemaName } from '../schemas';
import { BusinessService, UserService, CountryInfoService, TrafficSourceService } from '../services';
import { MessageBusChannelsEnum } from '../enums';
import { UserTokenInterface } from '@pe/nest-kit';
import { UserAccountDto } from '../dto/update-user-account/user-account.dto';
import { CreateBusinessDto, TrafficSourceDto, BusinessPermissionDto } from '../dto';
import { MailerEventProducer } from '../producers';
import { environment } from '../../environments';
@Controller()
export class BusinessConsumer {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
    private readonly countryInfoService: CountryInfoService,
    private readonly trafficSourceService: TrafficSourceService,
    private readonly mailerEventProducer: MailerEventProducer,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: 'business.event.permission.added',
  })
  public async onBusinessPermissionsAddedEvent(data: BusinessPermissionDto): Promise<void> {
    const business: BusinessModel = await this.businessModel.findById(data.businessId).exec();
    const user: UserModel = await this.userModel.findById(data.userId).exec();
    await this.businessService.assignBusiness(business, user);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: 'business.event.permission.deleted',
  })
  public async onBusinessPermissionsDeletedEvent(data: BusinessPermissionDto): Promise<void> {
    const business: BusinessModel = await this.businessModel.findById(data.businessId).exec();
    const user: UserModel = await this.userModel.findById(data.userId).exec();
    await this.businessService.deassignBusiness(business, user);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: 'onboarding.event.setup.business',
  })
  public async onBusinessPermissionsCreatedEvent(data: {
    userToken: UserTokenInterface;
    createBusinessDto: CreateBusinessDto;
    createUserDto: UserAccountDto;
  }): Promise<void> {
    const { userToken, createBusinessDto, createUserDto }: any = data;

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
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: 'users.event.business.enabled',
  })
  public async enableBusiness(
    data: {
      userToken: UserTokenInterface;
      businessId: string;
    },
  ): Promise<void> {
    const user: UserModel = await this.userService.findOneByUserToken(data.userToken);
    const business: BusinessModel = await this.businessModel.findById(data.businessId).exec();

    if (!user || !business) {
      return;
    }
    await this.businessService.enableBusiness(business, user);
  }
}
