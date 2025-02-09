import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { AppEnum } from '../../../enums';
import { EmployeeRabbitMessagesEnum } from '../enums';
import { EmployeeAccountDto, EmployeeDto } from '../dto';

@Controller()
export class EmployeesMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: EmployeeRabbitMessagesEnum.EmployeeCreated,
  })
  public async onEmployeeCreated(data: EmployeeDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data.employee, data.employee.id, data.businessId);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: EmployeeRabbitMessagesEnum.EmployeeCreatedCustomAccess,
  })
  public async onEmployeeCreatedByCustomAccess(data: EmployeeDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data.employee, data.employee.id, data.businessId);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: EmployeeRabbitMessagesEnum.EmployeeUpdated,
  })
  public async onEmployeeUpdated(data: EmployeeDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data.dto, data.employee.id, data.businessId);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: EmployeeRabbitMessagesEnum.EmployeeUpdatedCustomAccess,
  })
  public async onEmployeeUpdatedByCustomAccess(data: EmployeeDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data.dto, data.employee.id, data.businessId);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: EmployeeRabbitMessagesEnum.EmployeeRemoved,
  })
  public async onEmployeeDeleted(data: EmployeeDto): Promise<void> {
    await this.spotlightService.delete(
      data.employee.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(
    data: EmployeeAccountDto, id: string, businessId: string
  ): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.employeeToSpotlightDocument(data, id, businessId),
      id,
    );
  }

  private employeeToSpotlightDocument(
    employeeAccount: EmployeeAccountDto, id: string, businessId: string
  ): SpotlightInterface {

    const fullName: string = `${employeeAccount.first_name} ${employeeAccount.last_name}`;

    return {
      app: AppEnum.Users,
      businessId: businessId,
      description: employeeAccount.email,
      icon: employeeAccount.logo,
      serviceEntityId: id,
      title: fullName,
    };
  }
}
