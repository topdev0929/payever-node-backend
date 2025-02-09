
import { AbstractMessagingDocument, GuestUserInterface } from '../../../message/submodules/platform';

export interface ChatSyncDto {
    chat: AbstractMessagingDocument;
    guest : GuestUserInterface;
}
