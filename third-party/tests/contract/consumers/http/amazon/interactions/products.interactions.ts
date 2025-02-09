import { InteractionObject, Matchers } from '@pact-foundation/pact';

const authorizationId: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const UUID_REGEXP: string = '[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}';

export class ProductsInteractions {
  public static getSyncProductsInteraction(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Request to amazon to sync products',
      withRequest: {
        method: 'POST',
        path: Matchers.term({
          generate: `/api/action/sync-products/${authorizationId}`,
          matcher: `/api/action/sync-products/${UUID_REGEXP}`,
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
        body: '',
      },
    };
  }

  public static getUpdateProductInteractionFullProductDataWithVariants(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Update product request to amazon with all possible fields',
      withRequest: {
        method: 'PATCH',
        path: Matchers.term({
          generate: `/api/action/update-product/${authorizationId}`,
          matcher: `/api/action/update-product/${UUID_REGEXP}`,
        }),
        body: Matchers.like({
          barcode: 'test_barcode',
          categories: Matchers.eachLike({ name: 'Category name' }),
          currency: 'EUR',
          description: 'Test description',
          images: Matchers.eachLike('image1.png'),
          price: 100,
          enabled: true,
          salePrice: 10,
          shipping: {
            weight: 10,
            width: 1,
            length: 2,
            height: 3,
            measure_mass: 'kg',
            measure_size: 'cm',
          },
          sku: 'test_sku',
          title: 'Some Title',
          type: 'physical',
          variants: Matchers.eachLike({
            images: Matchers.eachLike('var_image.png'),
            title: 'Test Variant Title',
            description: 'Some variant description',
            hidden: false,
            price: 10,
            salePrice: 15,
            shipping: {
              weight: 10,
              width: 1,
              length: 2,
              height: 3,
              measure_mass: 'kg',
              measure_size: 'cm',
            },
            sku: 'variant_sku',
            barcode: 'barcode',
          }),
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
        body: '',
      },
    };
  }

  public static getUpdateProductInteractionMinimalProductData(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Update product request to amazon with minimal fields sets',
      withRequest: {
        method: 'PATCH',
        path: Matchers.term({
          generate: `/api/action/update-product/${authorizationId}`,
          matcher: `/api/action/update-product/${UUID_REGEXP}`,
        }),
        body: Matchers.like({
          price: 100,
          sku: 'test_sku',
          title: 'Some Title',
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
        body: '',
      },
    };
  }

  public static getCreateProductInteractionFullProductDataWithVariants(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Create product request to amazon with all possible fields',
      withRequest: {
        method: 'POST',
        path: Matchers.term({
          generate: `/api/action/create-product/${authorizationId}`,
          matcher: `/api/action/create-product/${UUID_REGEXP}`,
        }),
        body: Matchers.like({
          barcode: 'test_barcode',
          categories: Matchers.eachLike({ name: 'Category name' }),
          currency: 'EUR',
          description: 'Test description',
          images: Matchers.eachLike('image1.png'),
          price: 100,
          enabled: true,
          salePrice: 10,
          shipping: {
            weight: 10,
            width: 1,
            length: 2,
            height: 3,
            measure_mass: 'kg',
            measure_size: 'cm',
          },
          sku: 'test_sku',
          title: 'Some Title',
          type: 'physical',
          variants: Matchers.eachLike({
            images: Matchers.eachLike('var_image.png'),
            title: 'Test Variant Title',
            description: 'Some variant description',
            hidden: false,
            price: 10,
            salePrice: 15,
            shipping: {
              weight: 10,
              width: 1,
              length: 2,
              height: 3,
              measure_mass: 'kg',
              measure_size: 'cm',
            },
            sku: 'variant_sku',
            barcode: 'barcode',
          }),
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
        body: '',
      },
    };
  }

  public static getCreateProductInteractionMinimalProductData(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Create product request to amazon with minimal fields sets',
      withRequest: {
        method: 'POST',
        path: Matchers.term({
          generate: `/api/action/create-product/${authorizationId}`,
          matcher: `/api/action/create-product/${UUID_REGEXP}`,
        }),
        body: Matchers.like({
          price: 100,
          sku: 'test_sku',
          title: 'Some Title',
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
        body: '',
      },
    };
  }
}
