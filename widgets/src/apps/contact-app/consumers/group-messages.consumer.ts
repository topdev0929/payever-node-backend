import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GroupService } from '../services';
import { GroupRabbitMessagesEnum } from '../enums';
import { GroupInterface } from '../interfaces';

@Controller()
export class GroupMessagesConsumer {
  constructor(
    private readonly groupService: GroupService,
  ) { }

  @MessagePattern({
    name: GroupRabbitMessagesEnum.groupCreated,
  })
  public async onGroupCreated(data: GroupInterface): Promise<void> {
    await this.groupService.createOrUpdateGroupFromEvent(data);
  }

  @MessagePattern({
    name: GroupRabbitMessagesEnum.groupUpdated,
  })
  public async onGroupUpdated(data: GroupInterface): Promise<void> {
    await this.groupService.createOrUpdateGroupFromEvent(data);
  }

  @MessagePattern({
    name: GroupRabbitMessagesEnum.groupExported,
  })
  public async onGroupExport(data: GroupInterface): Promise<void> {
    await this.groupService.createOrUpdateGroupFromEvent(data);
  }

  @MessagePattern({
    name: GroupRabbitMessagesEnum.groupRemoved,
  })
  public async onTerminalDeleted(data: GroupInterface): Promise<void> {
    await this.groupService.deleteGroup(data);
  }
}
