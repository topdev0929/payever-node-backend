import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MessageBusChannelsEnum, RabbitMessagesEnum, RmqSender } from '../../common';
import { RemoveBusinessDto, UserExportDto } from '../dto';
import { BusinessDto } from '../dto/business.dto';
import { User } from '../interfaces';
import { UserService } from '../services';
import { MailerEventProducer } from '../producer';
import { environment } from '../../environments';
import { EmployeeService } from '../../employees/services';
import { Employee } from '../../employees/interfaces';

@Controller()
export class RabbitController {
  constructor(
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
    private readonly rmqSender: RmqSender,
    private readonly mailerEventProducer: MailerEventProducer,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.BusinessCreated,
  })
  public async onBusinessCreateEvent(data: BusinessDto): Promise<void> {
    const createBusinessDto: BusinessDto = plainToClass(BusinessDto, data);

    await validate(createBusinessDto);

    await this.userService.assignAbsolutePermissions(createBusinessDto.userAccountId, createBusinessDto._id);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.BusinessRemoved,
  })
  public async onBusinessDeleteEvent(data: RemoveBusinessDto): Promise<void> {
    const businessId: string = data._id;

    await this.userService.removePermissionsForBusiness(businessId);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.AccountUpdated,
  })
  public async onUserDataUpdated(
    dto: { _id: string; email: string; firstName: string; lastName: string },
  ): Promise<void> {
    const user: User = await this.userService.findOneBy({ _id: dto._id });
    if (!user) {
      throw new NotFoundException(`User by params ${JSON.stringify(dto)} not found`);
    }
    if (user.email === dto.email && user.firstName === dto.firstName && user.lastName === dto.lastName) {
      return;
    }

    if (dto.email) {
      user.email = dto.email;
    }

    if (dto.firstName) {
      user.firstName = dto.firstName;
    }

    if (dto.lastName) {
      user.lastName = dto.lastName;
    }

    await user.save();
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.AccountCreated,
  })
  public async onUserCreated(payload: any): Promise<void> {

    await this.mailerEventProducer.produceAdminRegistrationEmailMessage(
      {
        email: payload.userAccount.email,
        firstName: payload.userAccount.firstName,
        lastName: payload.userAccount.lastName,
      },
      {
        registrationOrigin: payload.registrationOrigin,
      },
      environment.adminEmail,
    );
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.UserRemoved,
  })
  public async onUserRemoved(dto: { _id: string }): Promise<void> {
    const user: User = await this.userService.findOneBy({ _id: dto._id });
    if (!user) {
      return;
    }

    const employee: Employee = await this.employeeService.findOneBy({ email: user.email });
    if (employee) {
      await this.employeeService.deleteEmployee(employee);
    }
    await this.userService.remove(dto._id);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.GetUserData,
  })
  public async onGetUserData(dto: any): Promise<void> {
    const user: User = await this.userService.findOneBy(dto);
    if (!user) {
      throw new NotFoundException(`User by params ${JSON.stringify(dto)} not found`);
    }
    await this.rmqSender.send(RabbitMessagesEnum.PropagateUserData, user.toObject());
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.UserExportConsumer,
  })
  public async onUserExport(dto: UserExportDto): Promise<void> {
    await this.userService.update(dto._id, { language: dto.userAccount.language } as any);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.UserUpdated,
  })
  public async onUserUpdate(dto: UserExportDto): Promise<void> {
    await this.userService.update(dto._id, { language: dto.userAccount.language } as any);
  }
}
