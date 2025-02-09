// tslint:disable: max-union-size
import { Injectable } from '@nestjs/common';
import { InjectNotificationsEmitter, NotificationsEmitter } from '@pe/notifications-sdk';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';
import { NotificationsEnums } from '../enums';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, PopulatedVariantsProductModel, ProductModel } from '../models';

@Injectable()
export class ProductNotificationsService {
  constructor(@InjectNotificationsEmitter() private notificationsEmitter: NotificationsEmitter) { }

  public async sendAddProductNotification(businessId: string): Promise<any> {
    return this.notificationsEmitter.sendNotification(
      {
        app: 'products-aware',
        entity: businessId,
        kind: 'business',
      },
      NotificationsEnums.AddProduct,
      { },
    );
  }

  public async cancelAddProductNotification(businessId: string): Promise<any> {
    return this.notificationsEmitter.cancelNotification(
      {
        app: 'products-aware',
        entity: businessId,
        kind: 'business',
      },
      NotificationsEnums.AddProduct,
      { },
    );
  }

  public async sendMissingImageNotification(
    newProduct: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<any> {
    return this.notificationsEmitter.sendNotification(
      {
        app: 'products',
        entity: newProduct.businessId,
        kind: 'business',
      },
      NotificationsEnums.MissingImage,
      {
        productId: newProduct._id,
        productTitle: newProduct.title,
      },
    );
  }

  public async cancelMissingImageNotification(
    product: ProductModel |
      ProductDocumentLikeDto |
      PopulatedVariantsCategoryCollectionsChannelSetProductModel |
      PopulatedVariantsProductModel,
  ): Promise<void> {
    return this.notificationsEmitter.cancelNotification(
      {
        app: 'products',
        entity: product.businessId,
        kind: 'business',
      },
      NotificationsEnums.MissingImage,
      {
        productId: product._id,
        productTitle: product.title,
      },
    );
  }

  public async cancelChooseProductsNotifications(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    channelSetId: string,
    app: string,
  ): Promise<void> {
    return this.notificationsEmitter.cancelNotification(
      {
        app: app,
        entity: product.businessId,
        kind: 'business',
      },
      NotificationsEnums.ChooseProducts,
      {
        channelSetId: channelSetId,
      },
    );
  }
}
