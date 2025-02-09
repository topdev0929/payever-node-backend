import { Model } from 'mongoose';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ApplicationAccessInterface, ApplicationAccessStatusEnum, RolesEnum, UserRoleCustomer } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit/modules';

import { User } from '../../users/interfaces';
import { UpdateApplicationAccessRequestDto, CreateApplicationAccessRequestDto } from '../dto';
import { UserSchemaName } from '../../users/schemas';
import { UserService } from '../../users/services';
import { RmqSender } from '../../common';
import { AccessRequestChannelEnum } from '../enum';
import type { BusinessLocalDocument } from '../../business/schemas';

export class ApplicationAccessService {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<User>,
    private readonly businessService: BusinessService<BusinessLocalDocument>,
    private readonly userService: UserService,
    private readonly rmqSender: RmqSender,
  ) { }

  public async createApplicationAccessRequest(userId: string, dto: CreateApplicationAccessRequestDto): Promise<any> {
    const customer: User = await this.userModel.findById(userId);
    let customerRole: UserRoleCustomer = customer.getRole(RolesEnum.customer);

    if (!customerRole) {
      customerRole = {
        applications: [],
        name: RolesEnum.customer,
        shops: [],
      };

      customer.roles.push(customerRole);
      customerRole = customer.getRole(RolesEnum.customer);
    }

    customerRole.applications.push({
      applicationId: dto.applicationId,
      businessId: dto.businessId,
      status: ApplicationAccessStatusEnum.PENDING,
      type: dto.type,
    });

    customerRole.applications =
      customerRole.applications.filter(
        function(this: Set<string>, app: ApplicationAccessInterface): boolean {
          const key: string = `${app.applicationId}-${app.type}`;

          return Boolean(!this.has(key) && this.add(key));
        },
        new Set(),
      );

    await customer.save();
    const business: BusinessLocalDocument = await this.businessService.findOneById(dto.businessId);
    const owner: User = await this.userModel.findById(business?.owner);
    await this.sendCustomerRoleEvent(
      AccessRequestChannelEnum.created,
      customer,
      owner,
      business,
      dto.type,
      dto.applicationId,
      ApplicationAccessStatusEnum.PENDING,
    );

    return customer;
  }

  public async updateApplicationAccessRequest(
    ownerId: string,
    businessId: string,
    dto: UpdateApplicationAccessRequestDto,
  ): Promise<void> {
    const business: BusinessLocalDocument = await this.businessService.findOneById(businessId);

    if (business.owner !== ownerId) {
      throw new ForbiddenException('You\'re not allowed to give approval to this business');
    }

    const customer: User = await this.userService.findOneBy({ _id: dto.userId });

    if (!customer) {
      throw new NotFoundException('User not found');
    }

    const customerRole: UserRoleCustomer = customer.getRole(RolesEnum.customer);

    if (!customerRole) {
      throw new NotFoundException('User is not customer');
    }

    let statusChanged: boolean = false;

    for (const app of customerRole.applications) {
      if (app.businessId === businessId && app.applicationId === dto.applicationId && app.type === dto.type) {
        app.status = dto.status;
        statusChanged = true;
        break;
      }
    }

    if (statusChanged) {
      await customer.save();
      const owner: User = await this.userModel.findById(business?.owner);
      await this.sendCustomerRoleEvent(
        AccessRequestChannelEnum.created,
        customer,
        owner,
        business,
        dto.type,
        dto.applicationId,
        dto.status,
      );
    }
  }

  private async sendCustomerRoleEvent(
    channel: string,
    customer: User,
    owner: User,
    business: BusinessLocalDocument,
    applicationType: string,
    applicationId: string,
    status: ApplicationAccessStatusEnum,
  ): Promise<void> {
    const eventData: any = {
      business: business,
      customer: {
        email: customer?.email,
        firstName: customer?.firstName,
        id: customer?.id,
      },
      owner: {
        email: owner?.email,
        firstName: owner?.firstName,
        id: owner?.id,
      },

      applicationId: applicationId,
      applicationType: applicationType,
      status: status,
    };

    await this.rmqSender.send(channel, eventData);
  }
}
