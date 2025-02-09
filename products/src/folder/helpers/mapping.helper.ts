import { MappedFolderItemInterface } from '@pe/folders-plugin';
import { ProductVariantModel } from '../../products/models/product-variant.model';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../../products/models';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';

export class MappingHelper {
  public static map(
    data: ProductModel | ProductDocumentLikeDto | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): MappedFolderItemInterface {
    let dataObj: any;
    try {
      dataObj = data.toObject();
    } catch (e) {
      dataObj = data;
    }

    return {
      ...dataObj,
      category: (data as ProductModel).category
        && (data as PopulatedVariantsCategoryCollectionsChannelSetProductModel).category.title ?
        (data as PopulatedVariantsCategoryCollectionsChannelSetProductModel).category.title
        : (data as ProductModel).category,

      _id: data._id,
      applicationId: null,
      userId: null,
    };
  }
}
