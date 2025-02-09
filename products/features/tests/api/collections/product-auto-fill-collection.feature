Feature: Auto fill satisfying collections on product create/update
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "collectionByTitleId" following value:
      """
        "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "collectionByVariantPriceId" following value:
      """
        "22222222-2222-2222-2222-222222222222"
      """
    And I remember as "collectionByPriceId" following value:
      """
        "33333333-3333-3333-3333-333333333333"
      """
    And I remember as "manualCollectionId" following value:
      """
        "44444444-4444-4444-4444-444444444444"
      """
    And I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """

    Scenario: Creating product satisfying collection by title
      Given I use DB fixture "api/collections/auto-fill-product-on-product-create"
      When I send a POST request to "/products" with json:
        """
        {
          "operationName": "createProduct",
          "variables": {
            "product": {
              "businessUuid": "{{businessId}}",
              "imagesUrl": [],
              "images": [],
              "title": "Test title 123",
              "description": "test",
              "price": 1000,
              "sale": {
                "onSales": false,
                "salePrice": 500
              },
              "sku": "somesku",
              "barcode": "123124",
              "categories": [],
              "condition": "used",
              "brand": "brand1",
              "type": "physical",
              "active": true,
              "channelSets": [],
              "country": "DE",
              "language": "DE"
            }
          },
          "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n  id\n  }\n}\n"
        }
        """
      Then print last response
      Then I get "data" from response and remember as "response"
      Then the response status code should be 200
      And model "Product" with id "{{response.createProduct.id}}" should contain json:
        """
        {
          "collections": ["{{collectionByTitleId}}"]
        }
        """
      And model "Product" with id "{{response.createProduct.id}}" should not contain json:
        """
        {
          "collections": ["{{collectionByPriceId}}"]
        }
        """
      And model "Product" with id "{{response.createProduct.id}}" should not contain json:
        """
        {
          "collections": ["{{collectionByVariantPriceId}}"]
        }
        """

    Scenario: Creating product satisfying collection by price
      Given I use DB fixture "api/collections/auto-fill-product-on-product-create"
      When I send a POST request to "/products" with json:
        """
        {
          "operationName": "createProduct",
          "variables": {
            "product": {
              "businessUuid": "{{businessId}}",
              "imagesUrl": [],
              "images": [],
              "title": "Product name",
              "description": "test",
              "price": 90,
              "sale": {
                "onSales": false,
                "salePrice": 500
              },
              "condition": "used",
              "brand": "brand1",
              "sku": "somesku",
              "barcode": "123124",
              "categories": [],
              "channelSets": [],
              "type": "physical",
              "active": true,
              "country": "DE",
              "language": "DE"
            }
          },
          "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n  id\n  }\n}\n"
        }
        """
      Then print last response
      Then I get "data" from response and remember as "response"
      Then the response status code should be 200
      And model "Product" with id "{{response.createProduct.id}}" should not contain json:
        """
        {
          "collections": ["{{collectionByTitleId}}"]
        }
        """
      And model "Product" with id "{{response.createProduct.id}}" should contain json:
        """
        {
          "collections": ["{{collectionByPriceId}}"]
        }
        """
      And model "Product" with id "{{response.createProduct.id}}" should not contain json:
        """
        {
          "collections": ["{{collectionByVariantPriceId}}"]
        }
        """

  Scenario: Creating product satisfying collection by variant price and collection by product price
    Given I use DB fixture "api/collections/auto-fill-product-on-product-create"
    When I send a POST request to "/products" with json:
      """
      {
        "operationName": "createProduct",
        "variables": {
          "product": {
            "businessUuid": "{{businessId}}",
            "imagesUrl": [],
            "images": [],
            "title": "Product name",
            "description": "test",
            "price": 90,
            "sale": {
              "onSales": false,
              "salePrice": 500
            },
            "sku": "somesku123456",
            "barcode": "123124",
            "categories": [],
            "channelSets": [],
            "type": "physical",
            "condition": "used",
            "brand": "brand1",
            "active": true,
            "country": "DE",
            "language": "DE",
            "variants": [
              {
                "price": 40
              }
            ]
          }
        },
        "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n  id\n  }\n}\n"
      }
      """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    And model "Product" with id "{{response.createProduct.id}}" should not contain json:
      """
      {
        "collections": ["{{collectionByTitleId}}"]
      }
      """
    And model "Product" with id "{{response.createProduct.id}}" should contain json:
      """
      {
        "collections": ["{{collectionByPriceId}}"]
      }
      """
    And model "Product" with id "{{response.createProduct.id}}" should contain json:
      """
      {
        "collections": ["{{collectionByVariantPriceId}}"]
      }
      """

  Scenario: Updating product to satisfy collection by title
    Given I use DB fixture "api/collections/auto-fill-product-on-product-update"
    When I send a GraphQL query to "/products":
      """
      mutation {
        updateProduct(
          product: {
            id: "{{productId}}",
            businessUuid: "{{businessId}}",
            title: "Test title 123",
            description: "test",
            imagesUrl: [],
            images: [],
            price: 2000,
            sale: {
              onSales: true,
              salePrice: 1000
            },
            sku: "someothersku",
            barcode: "54321",
            condition: "used",
            brand: "brand1",
            type: "service",
            active: false,
            categories: [],
            channelSets: [],
            country: "DE",
            language: "DE"
          }
        ) {
          id
          collections {
            _id
          }
      }
    }
      """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    And model "Product" with id "{{response.updateProduct.id}}" should contain json:
        """
        {
          "collections": ["{{collectionByTitleId}}"]
        }
        """

  Scenario: Dissociate product from collection on update
    Given I use DB fixture "api/collections/dissociate-product-from-collection"
    And I mock Elasticsearch method "singleIndex" with:
      """
      [
        {
          "arguments": [
            "products",
            {
              "apps": [
                "builder"
              ],
              "active": false,
              "collections": [],
              "channelSets": [],
              "imagesUrl": [],
              "images": [],
              "example": false,
              "videosUrl": [],
              "videos": [],
              "isLocked": false,
              "__t": "Product",
              "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
              "barcode": "54321",
              "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
              "categories": [],
              "currency": "USD",
              "description": "test",
              "price": "2000.00",
              "sale": {
                "onSales": true,
                "salePrice": "1000.00"
              },
              "sku": "someothersku",
              "title": "Test title 123",
              "condition": "used",
              "brand": "brand1",
              "type": "service",
              "attributes": [],
              "variantAttributes": [],
              "__v": 1,
              "options": [],
              "country": "DE",
              "language": "DE",
              "uuid": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
              "hidden": false,
              "enabled": false,
              "businessUuid": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
              "product_relations": {
                "name": "parentProduct"
              }
            }
          ],
          "result": {}
        }
      ]
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products-folder",
          {
            "query": {
              "match_phrase": {
                "serviceEntityId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
              }
            }
          }
        ],
        "result": {}
      }
      """
    When I send a GraphQL query to "/products":
      """
      mutation {
        updateProduct(
          product: {
            id: "{{productId}}",
            businessUuid: "{{businessId}}",
            title: "New title",
            description: "test",
            imagesUrl: [],
            images: [],
            price: 2000,
            sale: {
              onSales: true,
              salePrice: 1000
            },
            sku: "someothersku",
            barcode: "54321",
            condition: "used",
            brand: "brand1",
            type: "service",
            active: false,
            categories: [],
            channelSets: [],
            country: "DE",
            language: "DE"
          }
        ) {
          id
          collections {
            _id
          }
      }
    }
      """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    And model "Product" with id "{{response.updateProduct.id}}" should not contain json:
        """
        {
          "collections": ["{{collectionByTitleId}}"]
        }
        """
    And model "Product" with id "{{response.updateProduct.id}}" should contain json:
        """
        {
          "collections": ["{{manualCollectionId}}"]
        }
        """

  Scenario: Updating product that was manually added to collection
    Given I use DB fixture "api/collections/auto-collection-with-manual-product"
    When I send a GraphQL query to "/products":
      """
      mutation {
        updateProduct(
          product: {
            id: "{{productId}}",
            businessUuid: "{{businessId}}",
            title: "Test title 123",
            description: "test",
            imagesUrl: [],
            images: [],
            price: 2000,
            sale: {
              onSales: true,
              salePrice: 1000
            },
            sku: "someothersku",
            barcode: "54321",
            type: "service",
            condition: "used",
            brand: "brand1",
            active: false,
            categories: [],
            channelSets: [],
            country: "DE",
            language: "DE"
          }
        ) {
          id
          collections {
            _id
          }
      }
    }
      """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    And model "Product" with id "{{response.updateProduct.id}}" should contain json:
        """
        {
          "collections": ["{{collectionByTitleId}}"]
        }
        """
