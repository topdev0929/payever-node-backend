import { AutomaticCollectionConditionsInterface } from './automatic-collection-conditions.interface';

export interface CollectionInterface {
  businessId: string;
  description: string;
  name: string;
  slug: string;
  image?: string;
  channelSets: string[];
  activeSince: Date;
  activeTill: Date;
  automaticFillConditions: AutomaticCollectionConditionsInterface;
  ancestors?: string[];
  parent?: string;
  productCount?: number;
}
