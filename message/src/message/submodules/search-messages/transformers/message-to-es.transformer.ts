import { MessageEsDocument } from '../interfaces';
import { DecryptedChatTextMessageInterface, DecryptedAbstractChatMessageInterface } from '../../platform';

export function messageToEsTransformer(
  message: DecryptedChatTextMessageInterface | DecryptedAbstractChatMessageInterface,
): MessageEsDocument {
  return {
    _id: message._id,
    chat: message.chat,
    content: (message as DecryptedChatTextMessageInterface).content,
    status: message.status,
  };
}
