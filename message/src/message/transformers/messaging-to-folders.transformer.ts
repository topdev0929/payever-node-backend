import { MappedFolderItemInterface } from '@pe/folders-plugin';
import { MessagingWithIntegration } from '@pe/message-kit';

import { AbstractMessaging, AbstractChannel } from '../submodules/platform';
import { CustomerChat } from '../submodules/messaging/customer-chat';

export function messagingToFolderItem(messaging: AbstractMessaging): MappedFolderItemInterface {
  return {
    _id: messaging._id,
    businessId: AbstractMessaging.hasBusiness(messaging) ? messaging.business : null,
    contact: (messaging as CustomerChat).contact,
    deleted: messaging.deleted,
    integrationName: (messaging as AbstractChannel & MessagingWithIntegration).integrationName,
    title: messaging.title,
    type: messaging.type,

    applicationId: null,
    userId: null,
  };
}
