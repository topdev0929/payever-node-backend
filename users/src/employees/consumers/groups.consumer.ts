import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageBusChannelsEnum } from '../../user/enums';
import { RabbitMessagesEnum } from '../enum';
import { GroupsService } from '../services';

@Controller()
export class GroupsConsumer {
  constructor(
    private readonly groupsService: GroupsService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.TrustedDomainGroupCreated,
  })
  public async onTrustedDomainGroupCreated(data: any): Promise<void> {
    await this.groupsService.create({ _id: data._id, name: data.name }, data.businessId); 
  }
}
