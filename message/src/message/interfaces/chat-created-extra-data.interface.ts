import { DocumentDefinition } from 'mongoose';
import { AbstractMessagingDocument } from '../submodules/platform';

export interface ChatCreatedExtraDataInterface<T extends AbstractMessagingDocument> {
  prototype: DocumentDefinition<T> & { parentFolderId?: string };
}
