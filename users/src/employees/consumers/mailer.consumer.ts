import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageBusChannelsEnum } from '../../user/enums';
import { RabbitMessagesEnum } from '../enum';
import { Employee } from '../interfaces';
import { EmployeeService } from '../services';

@Controller()
export class MailerConsumer {
  constructor(
    private readonly employeeService: EmployeeService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.BusinessMailSent,
  })
  public async onBusinessMailSentEvent(payload: { 
    to: string; 
    subject: string; 
    templateName: string; 
    businessId: string;
  }): Promise<void> {
    const employee: Employee = await this.employeeService.findOneBy({ email: payload.to });

    if (payload.templateName === 'staff_invitation_new' && employee) {
      await this.employeeService.markInviteMailSent(employee._id, payload.businessId);
    }
  }
}
