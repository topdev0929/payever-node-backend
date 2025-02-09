import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageService } from '../services';
import { ChatRabbitMessagesEnum } from '../enums';
import { ChatEventDto, ChatMemberUpdateDto } from '../dto';

@Controller()
export class ChatMessagesConsumer {
  constructor(
    private readonly chatService: MessageService,
  ) { }

  @MessagePattern({
    name: ChatRabbitMessagesEnum.WidgetDataCreated,
  })
  public async onChatCreated(data: ChatEventDto): Promise<void> {
    await this.chatService.createOrUpdateChatFromEvent(data);
  }

  @MessagePattern({
    name: ChatRabbitMessagesEnum.WidgetDataUpdated,
  })
  public async onChatUpdated(data: ChatEventDto): Promise<void> {
    await this.chatService.createOrUpdateChatFromEvent(data);
  }

  @MessagePattern({
    name: ChatRabbitMessagesEnum.WidgetDataExported,
  })
  public async onChatExported(data: ChatEventDto): Promise<void> {
    await this.chatService.createOrUpdateChatFromEvent(data);
  }

  @MessagePattern({
    name: ChatRabbitMessagesEnum.WidgetDataDeleted,
  })
  public async onTerminalDeleted(data: ChatEventDto): Promise<void> {
    await this.chatService.deleteChat(data);
  }

  @MessagePattern({
    name: ChatRabbitMessagesEnum.WidgetDataMemberIncluded,
  })
  public async onMemberIncluded(data: ChatMemberUpdateDto): Promise<void> {
    await this.chatService.includeMember(data);
  }

  @MessagePattern({
    name: ChatRabbitMessagesEnum.WidgetDataMemberExcluded,
  })
  public async onMemberExcluded(data: ChatMemberUpdateDto): Promise<void> {
    await this.chatService.excludeMember(data);
  }

  @MessagePattern({
    name: ChatRabbitMessagesEnum.WidgetDataMemberChanged,
  })
  public async onMemberChanged(data: ChatMemberUpdateDto): Promise<void> {

  }
}
