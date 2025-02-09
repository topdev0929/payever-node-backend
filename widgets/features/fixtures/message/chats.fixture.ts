import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { ChatModel } from '../../../src/apps/message-app/models';
import { ChatSchemaName } from '../../../src/apps/message-app/schemas';
import { CHAT_1_ID, CHAT_2_ID, USER_1_ID } from '../const';


class ChatFixture extends BaseFixture {
  private readonly chatModel: Model<ChatModel> = this.application.get(getModelToken(ChatSchemaName));

  public async apply(): Promise<void> {
    await this.chatModel.create({
      _id:CHAT_1_ID,
      title:'chat 1 title',
      type: 'channel',
      members:[
        {
          user: USER_1_ID,
        }
      ]
    });

    await this.chatModel.create({
      _id:CHAT_2_ID,
      title:'chat 2 title',
      type: 'channel',
      members:[]
    });

  }
}

export = ChatFixture;
