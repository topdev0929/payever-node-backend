Feature: Create product
  Background:
    Given I remember as "businessId" following value:
    """
      "a560407c-b98d-40eb-8565-77c0d7ae23ea"
    """
    Given I authenticate as a user with the following data:
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

  Scenario: Creating product with price table
    When I send a GraphQL query to "/products":
      """
      mutation {
        createProduct(product: {
          businessUuid: "a560407c-b98d-40eb-8565-77c0d7ae23ea",
          images: ["image1", "image2"],
          videos: ["video1", "video2"],
          title: "test product",
          description: "description value",
          sale: {
            onSales: false
          },
          price: 1000,
          priceTable: [{
            condition: {
              field: "customerCountryCode",
              fieldType: "string",
              fieldCondition: "is",
              value: "GB"
            },
            currency: "eur",
            price: 900,
            vatRate: 19
          }, {
            condition: {
              field: "customerUserId",
              fieldType: "string",
              fieldCondition: "isIn",
              value: [
                "e69a0526-1bfc-412f-ae6d-826d2a0af1b1",
                "ca4e8409-9574-42a8-a89c-9d864e0a961a"
              ]
            },
            currency: "eur",
            price: 850,
            vatRate: 19
          }],
          sku: "grasada",
          barcode: "51273",
          categories: [],
          channelSets: [],
          condition: "refurbished",
          brand: "brand1",
          type: "physical",
          active: true
        }) {
          title
          uuid
          videosUrl
          imagesUrl
          priceTable {
            condition {
              field
              fieldType
              fieldCondition
              value
            }
            currency
            price
            vatRate
          }
        }
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
          "uuid": "*",
          "videosUrl": [
            "https://payevertesting.blob.core.windows.net/products/video1",
            "https://payevertesting.blob.core.windows.net/products/video2"
          ],
          "imagesUrl": [
            "https://payevertesting.blob.core.windows.net/products/image1",
            "https://payevertesting.blob.core.windows.net/products/image2"
          ],
          "priceTable": [{
            "condition": {
              "field": "customerCountryCode",
              "fieldType": "string",
              "fieldCondition": "is",
              "value": "GB"
            },
            "currency": "eur",
            "price": 900
          }, {
            "condition": {
              "field": "customerUserId",
              "fieldType": "string",
              "fieldCondition": "isIn",
              "value": [
                "e69a0526-1bfc-412f-ae6d-826d2a0af1b1",
                "ca4e8409-9574-42a8-a89c-9d864e0a961a"
              ]
            },
            "currency": "eur",
            "price": 850,
            "vatRate": 19
          }]
        }
      }
    }
    """
  And model "Product" with id "{{response.createProduct.uuid}}" should contain json:
    """
    {
      "priceTable": [{
        "condition": {
          "field": "customerCountryCode",
          "fieldType": "string",
          "fieldCondition": "is",
          "value": "GB"
        }
      }, {
        "condition": {
          "field": "customerUserId",
          "fieldType": "string",
          "fieldCondition": "isIn",
          "value": [
            "e69a0526-1bfc-412f-ae6d-826d2a0af1b1",
            "ca4e8409-9574-42a8-a89c-9d864e0a961a"
          ]
        }
      }]
    }
    """

  Scenario: Creating product without a category
    When I send a POST request to "/products" with json:
    """
    {
      "operationName": "createProduct",
      "variables": {
        "product": {
          "businessUuid": "a560407c-b98d-40eb-8565-77c0d7ae23ea",
          "images": ["image1", "image2"],
          "videos": ["video1", "video2"],
          "title": "test product",
          "brand": "brand1",
          "condition": "new",
          "variants": [
              {
                  "price":1000,
                  "options":{
                      "name":"color",
                      "value":"Red",
                      "type":"DEFAULT",
                      "extra":{
                          "hex":"#fff000",
                          "someOtherData": { "some": 1 }
                      }
                  }
              }
           ],
          "description": "test",
          "price": 1000,
          "sale": {
            "onSales": false,
            "salePrice": 500,
            "saleEndDate": "2014-04-01",
            "saleStartDate": "2014-04-01"
          },
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
      "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n    title\n  brand\n variants {\n      id\n      images\n      options {\n        name\n        value\n        extra\n        type\n      }\n      description\n      price\n      sale {\n        onSales\n        salePrice\n        saleEndDate\n        saleStartDate\n      }\n      sku\n      barcode\n    }\n    condition\n sale {\n salePrice\n saleEndDate\n saleStartDate\n }\n uuid\n videosUrl\n imagesUrl\n }\n}\n"
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
          "brand": "brand1",
          "variants": [
              {
                "images": [],
                "options": [
                  {
                    "name": "color",
                    "value": "Red",
                    "extra": {
                      "hex": "#fff000",
                      "someOtherData": {
                        "some": 1
                      }
                    },
                    "type": "DEFAULT"
                  }
                ],
                "description": null,
                "price": 1000,
                "sale": null,
                "sku": "somesku_1",
                "barcode": null
              }
          ],
          "condition": "new",
          "sale": {
            "salePrice": 500,
            "saleEndDate": "2014-04-01T00:00:00.000Z",
            "saleStartDate": "2014-04-01T00:00:00.000Z"
          },
          "uuid": "*",
          "videosUrl": [
            "https://payevertesting.blob.core.windows.net/products/video1",
            "https://payevertesting.blob.core.windows.net/products/video2"
          ],
          "imagesUrl": [
            "https://payevertesting.blob.core.windows.net/products/image1",
            "https://payevertesting.blob.core.windows.net/products/image2"
          ]
        }
      }
    }
    """
    Then model "ProductTranslation" found by following JSON should exist:
      """
      {
        "product": "{{response.createProduct.uuid}}"
      }
      """
    Then model "ProductCountrySetting" found by following JSON should exist:
      """
      {
        "product": "{{response.createProduct.uuid}}"
      }
      """

  Scenario: Creating product for payever Market
    When I send a POST request to "/products" with json:
    """
    {
      "operationName": "createProduct",
      "variables": {
        "product": {
          "businessUuid": "a560407c-b98d-40eb-8565-77c0d7ae23ea",
          "images": [],
          "title": "test product",
          "brand": "brand1",
          "condition": "new",
          "description": "test",
          "price": 1000,
          "sale": {
            "onSales": false,
            "salePrice": 500,
            "saleEndDate": "2014-04-01",
            "saleStartDate": "2014-04-01"
          },
          "sku": "somesku",
          "barcode": "123124",
          "categories": [],
          "channelSets": [
            {
              "id": "b8fcae3f-94fa-4a90-9fde-a769fe9e8ced",
              "type": "dropshipping"
            }
          ],
          "type": "physical",
          "active": true,
          "country": "DE",
          "language": "DE"
        }
      },
      "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n    title\n  brand\n  condition\n  sale {\n salePrice\n saleEndDate\n saleStartDate\n }\n uuid\n dropshipping\n }\n}\n"
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
          "brand": "brand1",
          "condition": "new",
          "sale": {
            "salePrice": 500,
            "saleEndDate": "2014-04-01T00:00:00.000Z",
            "saleStartDate": "2014-04-01T00:00:00.000Z"
          },
          "uuid": "*",
          "dropshipping": true
        }
      }
    }
    """
    Then model "ProductTranslation" found by following JSON should exist:
      """
      {
        "product": "{{response.createProduct.uuid}}"
      }
      """
    Then model "ProductCountrySetting" found by following JSON should exist:
      """
      {
        "product": "{{response.createProduct.uuid}}"
      }
      """

  Scenario: Sanitize product title
    When I send a POST request to "/products" with json:
    """
    {
      "operationName": "createProduct",
      "variables": {
        "product": {
          "businessUuid": "a560407c-b98d-40eb-8565-77c0d7ae23ea",
          "images": ["image1", "image2"],
          "videos": ["video1", "video2"],
          "title": "<script>alert(1);</script><img src=0 onload='alert(2);'/>test product",
          "brand": "brand1",
          "condition": "new",
          "description": "test",
          "price": 1000,
          "sale": {
            "onSales": false,
            "salePrice": 900,
            "salePercent": 50,
            "saleEndDate": "2014-04-01",
            "saleStartDate": "2014-04-01"
          },
          "sku": "somesku",
          "barcode": "123124",
          "categories": [],
          "channelSets": [],
          "type": "physical",
          "active": true,
          "country": "DE"
        }
      },
      "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n    title\n   brand\n condition\n sale {\n salePrice\n salePercent\n saleEndDate\n saleStartDate\n }\n uuid\n videosUrl\n imagesUrl\n }\n}\n"
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
          "brand": "brand1",
          "condition": "new",
          "sale": {
            "salePercent": 50,
            "salePrice": 500,
            "saleEndDate": "2014-04-01T00:00:00.000Z",
            "saleStartDate": "2014-04-01T00:00:00.000Z"
          },
          "uuid": "*",
          "videosUrl": [
            "https://payevertesting.blob.core.windows.net/products/video1",
            "https://payevertesting.blob.core.windows.net/products/video2"
          ],
          "imagesUrl": [
            "https://payevertesting.blob.core.windows.net/products/image1",
            "https://payevertesting.blob.core.windows.net/products/image2"
          ]
        }
      }
    }
    """

  Scenario: creating product with category that belongs to another business
    Given I use DB fixture "graphql/product-mutations/create-product-with-category"
    When I send a POST request to "/products" with json:
    """
    {
      "operationName": "createProduct",
      "variables": {
        "product": {
          "businessUuid": "06bbebab-e917-4c07-9f4d-6f4685b4ff20",
          "imagesUrl": [],
          "images": [],
          "title": "test product",
          "brand": "brand1",
          "condition": "new",
          "description": "test",
          "price": 1000,
          "sale": {
            "onSales": false,
            "salePrice": 500,
            "saleEndDate": "2014-04-01",
            "saleStartDate": "2014-04-01"
          },
          "sku": "somesku",
          "barcode": "123124",
          "categories": [],
          "category": "a34eb905-11b3-46d3-a3f5-7ea71d92cda5",
          "type": "physical",
          "active": true,
          "country": "DE",
          "language": "DE"
        }
      },
      "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n    title\n    uuid\n  }\n}\n"
    }

    """
    Then print last response
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
                    "CategoryExistsConstraint": "Category \"(a34eb905-11b3-46d3-a3f5-7ea71d92cda5)\" is not exists for business \"06bbebab-e917-4c07-9f4d-6f4685b4ff20\""
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
