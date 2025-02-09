import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { environment } from '../../environments';
import { RabbitMessagesEnum } from '../../common';
import { Positions } from '../enum';

@Injectable()
export class EmployeeMessageProducer {
  constructor(
    private readonly logger: Logger,
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async produceEmployeeRemovedSynced(userId: string, businessId: string, employeeId: string): Promise<void> {
    const payload: any = {
      businessId,
      employeeId,
      userId,
    };

    await this.sendMessage(RabbitMessagesEnum.EmployeeRemovedSynced, payload);
  }

  public async produceEmployeeAddedSynced(userId: string, businessId: string, employeeId: string): Promise<void> {
    const payload: any = {
      businessId,
      employeeId,
      userId,
    };

    await this.sendMessage(RabbitMessagesEnum.EmployeeAddedSynced, payload);
  }

  public async produceUntrustedDomainRegisteredEmailMessage(
    businessId: string,
    to: string,
    employee: {
      firstName: string;
      fullName: string;
      lastName: string;
      email: string;
      position: Positions;
    },
    locale: string = 'business',
  ): Promise<void> {

    const redirectUrl: string = `${environment.commerseOSUrl}/business/${businessId}/settings/employees`;

    const payload: any = {
      businessId: businessId,
      locale: locale,
      subject: '',
      templateName: 'untrusted_domain_registered',
      to: to,
      variables: { employee, redirectUrl },
    };

    await this.sendMessage(RabbitMessagesEnum.PayeverBusinessEmail, payload);
  }

  public async produceEmployeeAccessApprovedEmailMessage(
    businessId: string,
    to: string,
    employee: {
      firstName: string;
    },
    locale: string = 'business',
  ): Promise<void> {

    const payload: any = {
      businessId: businessId,
      locale: locale,
      subject: '',
      templateName: 'employee_access_approved',
      to: to,
      variables: { employee },
    };

    await this.sendMessage(RabbitMessagesEnum.PayeverBusinessEmail, payload);
  }

  public async produceEmployeeRegisteredEmailMessage(
    businessId: string,
    to: string,
    link: string,
    locale: string = 'business',
  ): Promise<void> {

    const payload: any = {
      businessId: businessId,
      locale: locale,
      subject: '',
      templateName: 'employee_registration',
      to: to,
      variables: { staff_invitation: { link } },
    };

    await this.sendMessage(RabbitMessagesEnum.PayeverBusinessEmail, payload);
  }

  private async sendMessage(channel: string, payload: any): Promise<void> {
    return this.rabbitClient.send(
      {
        channel: channel,
        exchange: 'async_events',
      },
      {
        name: channel,
        payload: payload,
      },
      true,
    );
  }
}
