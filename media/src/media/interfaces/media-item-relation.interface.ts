import { MediaItemInterface } from './media-item.interface';

export interface MediaItemRelationInterface {
  mediaItem: MediaItemInterface;
  entityId: string;
  entityType: string;
}
