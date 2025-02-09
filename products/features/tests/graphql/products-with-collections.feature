Feature: Products with collections
  Background:
    Given I remember as "businessId" following value:
    """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    """
    And I remember as "anotherBusinessId" following value:
    """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
    """
    And I remember as "collectionId" following value:
    """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    """
    And I remember as "productId" following value:
    """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
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

  Scenario: Creating product with collection
    Given I use DB fixture "api/collections/create-product-with-collection"
    When I send a POST request to "/products" with json:
      """
      {
        "operationName": "createProduct",
        "variables": {
          "product": {
            "businessUuid": "{{businessId}}",
            "categories": [],
            "channelSets": [],
            "imagesUrl": [],
            "images": [],
            "title": "test product",
            "description": "test",
            "price": 1000,
            "sale": {
              "onSales": false,
              "salePrice": 500
            },
            "sku": "somesku",
            "barcode": "123124",
            "collections": ["{{collectionId}}"],
            "type": "physical",
            "active": true,
            "country": "DE",
            "language": "DE"
          }
        },
        "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n    title\n    uuid\n    collections { _id\n name\n }\n  }\n}\n"
      }
      """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "data": {
        "createProduct": {
          "title": "test product",
          "collections": [
             {
               "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
             }
           ]
        }
      }
    }
    """

  Scenario: Creating product with collection of another business
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{anotherBusinessId}}", "acls": []}]
      }]
    }
    """
    When I send a POST request to "/products" with json:
      """
      {
        "operationName": "createProduct",
        "variables": {
          "product": {
            "businessUuid": "{{anotherBusinessId}}",
            "imagesUrl": [],
            "images": [],
            "title": "test product",
            "description": "test",
            "price": 1000,
            "sale": {
              "onSales": false,
              "salePrice": 500
            },
            "sku": "somesku",
            "barcode": "123124",
            "collections": ["{{collectionId}}"],
            "type": "physical",
            "active": true,
            "country": "DE",
            "language": "DE"
          }
        },
        "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n    title\n    uuid\n    collections { _id\n }\n }\n}\n"
      }
      """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    Then the response should contain json:
      """
      {
        "errors": [
          {
              "extensions": {
              "code": "INTERNAL_SERVER_ERROR",
              "exception": {
                "response": {
                  "statusCode": 400,
                  "message": [
                    {
                      "constraints": {
                        "isArray": "categories must be an array"
                      },
                      "constraints": {
                        "CollectionExistsConstraint": "Collection \"($value)\" is not exists at business \"cccccccc-cccc-cccc-cccc-cccccccccccc\""
                      }
                    }
                  ],
                  "error": "Bad Request"
                },
                "status": 400
              }
            }
          }
        ]
      }
      """

  Scenario: Update product
    Given I use DB fixture "api/collections/update-product-with-collection"
    When I send a GraphQL query to "/products":
      """
      mutation {
        updateProduct(
          product: {
            id: "{{productId}}",
            businessUuid: "{{businessId}}",
            categories: [],
            title: "test product",
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
            brand: "brand1",
            condition: "refurbished",
            type: "service",
            active: false,
            country: "DE",
            language: "DE",
            collections: ["{{collectionId}}"]
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
    Then the response should contain json:
      """
       {
         "data": {
           "updateProduct": {
             "id": "{{productId}}",
             "collections": [
               {
                  "_id": "{{collectionId}}"
               }
             ]
           }
         }
       }
      """

  Scenario: Get products - filter by collections
    Given I use DB fixture "api/collections/get-products-by-collection"
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://backend-inventory.test.devpayever.com/api/business/{{businessId}}/inventory/sku/stock"
        },
        "response": {
          "status": 200,
          "body": "{}"
        }
      }
      """
    When I send a GraphQL query to "/products":
      """
      {
        getProducts(
          businessUuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          paginationLimit: 10,
          filters: [
            {
              field: "collections",
              fieldType: "string",
              fieldCondition: "is",
              value: "{{collectionId}}"
            }
          ]) {
          products {
            uuid
            collections {
              _id
            }
          }
        }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "getProducts": {
            "products": [
              {
                "uuid": "11111111-1111-1111-1111-111111111111",
                "collections": [{
                  "_id": "{{collectionId}}"
                }]
              },
              {
                "uuid": "22222222-2222-2222-2222-222222222222",
                "collections": [{
                  "_id": "{{collectionId}}"
                }]
              }
            ]
          }
        }
      }
      """
    Then the response should not contain json:
      """
      {
        "data": {
          "getProducts": {
            "products": [
              {
                "uuid": "33333333-3333-3333-3333-333333333333"
              }
            ]
          }
        }
      }
      """
