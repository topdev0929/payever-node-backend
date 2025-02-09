import { AutomaticCollectionsListener } from './automatic-collections.listener';
import { BusinessEventsListener } from './business-events.listener';
import { CollectionRemoverListener } from './collection-remover.listener';
import { ElasticIndexesUpdaterListener } from './elastic-indexes-updater.listener';
import { ExampleProductsRemoverListener } from './example-products-remove.listener';
import { FirstProductCreatedListener } from './first-product-created.listener';
import { ProductEventsListener } from './product-events.listener';
import { ProductNotificationsListener } from './product-notifications.listener';
import { AutomaticCollectionsProductsListener } from './automatic-collections-products.listener';
import { ChannelSetEventListener } from './channel-set-event.listener';

export const ListenersEnum: any[] = [
  AutomaticCollectionsListener,
  AutomaticCollectionsProductsListener,
  BusinessEventsListener,
  CollectionRemoverListener,
  ElasticIndexesUpdaterListener,
  ExampleProductsRemoverListener,
  FirstProductCreatedListener,
  ProductEventsListener,
  ProductNotificationsListener,
  ChannelSetEventListener,
];
