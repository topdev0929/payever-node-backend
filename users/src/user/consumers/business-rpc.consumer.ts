import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TrafficSourceDto, RpcCreateBusinessDto, RpcRemoveBusinessDto } from '../dto';
import { UserModel, BusinessModel } from '../models';
import { MailerEventProducer, BusinessEventsProducer } from '../producers';
import { UserService, BusinessService, TrafficSourceService, CountryInfoService } from '../services';
import { environment } from '../../environments';
import { BusinessDto } from '../dto/create-business/business.dto';

@Controller()
export class BusinessRpcConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
    private readonly trafficSourceService: TrafficSourceService,
    private readonly mailerEventProducer: MailerEventProducer,
    private readonly countryInfoService: CountryInfoService,
    private readonly businessEventsProducer: BusinessEventsProducer,
  ) { }

  @MessagePattern({
    name: 'users.rpc.business.create',
  })
  public async create(dto: RpcCreateBusinessDto): Promise<BusinessModel> {
    await this.userService.createUserAccount(
      dto.userId,
      {
        email: dto.user.email || '',
        firstName: dto.user.firstName || '',
        language: this.countryInfoService.getCountryLanguage(dto.business.companyAddress.country),
        lastName: dto.user.lastName || '',
        registrationOrigin: {
          account: '',
          url: '',
        },
      },
    );

    const user: UserModel = await this.userService.findById(dto.userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const trafficSource: TrafficSourceDto = dto.business.trafficSource;
    delete dto.business.trafficSource;

    const business: BusinessModel = await this.businessService.createBusiness(user, dto.business as BusinessDto);

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

  @MessagePattern({
    name: 'users.rpc.business.delete',
  })
  public async remove(dto: RpcRemoveBusinessDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findBusiness(dto.businessId);
    if (!business) {
      throw new NotFoundException(`Business not found`);
    }

    await this.businessService.deleteBusiness(business);

    const user: UserModel = await this.userService.findById(business.owner as string);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await this.businessEventsProducer.produceBusinessRemovedEvent(user, business);
  }
}
