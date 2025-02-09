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
    Given I remember as "categoryId" following value:
    """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    """
    Given I remember as "subcategoryId" following value:
    """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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
          "product-category",
          {
          }
        ]
      }
      """

  Scenario: creating product with old categories array, new categories were not created yet, old categories have only one category
    When I send a GraphQL query to "/products":
      """
      mutation {
        createProduct(product: {
          businessUuid: "{{businessId}}",
          imagesUrl: [],
          images: [],
          title: "test product",
          description: "test",
          price: 1000,
          sale: {
            onSales: false,
            salePrice: 500
          },
          sku: "somesku",
          barcode: "123124",
          categories: [
            {
              title: "Clothing",
              businessUuid: "{{businessId}}"
            }
          ],
          channelSetCategories: [{
            channelSetId:"*",
            categories: [
            {
              title: "Clothing",
              businessUuid: "{{businessId}}"
            }],
            channelSetType: "*"
          }]
          channelSets: [],
          condition: "refurbished",
          brand: "brand1",
          type: "physical",
          active: true,
          country: "DE",
          language: "DE"
        }) {
          title
          uuid
          category {
            id
            title
          }

        }
      }
      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
    """
    {
      "data": {
        "createProduct": {
          "title": "test product",
          "uuid": "*",
          "category": {
            "id": "*",
            "title": "Clothing"
          }

        }
      }
    }
    """

  Scenario: creating product with old categories array, new categories were not created yet
    When I send a GraphQL query to "/products":
      """
      mutation {
        createProduct(product: {
          businessUuid: "{{businessId}}",
          imagesUrl: [],
          images: [],
          title: "test product",
          description: "test",
          price: 1000,
          sale: {
            onSales: false,
            salePrice: 500
          },
          sku: "somesku",
          barcode: "123124",
          categories: [
            {
              title: "Clothing",
              businessUuid: "{{businessId}}"
            },
            {
              title: "Shirts",
              businessUuid: "{{businessId}}"
            }
          ],
          channelSets: [],
          condition: "refurbished",
          brand: "brand1",
          type: "physical",
          active: true,
          country: "DE",
          language: "DE"
        }) {
          title
          uuid
          category {
            id
            title
          }
        }
      }
      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
    """
    {
      "data": {
        "createProduct": {
          "title": "test product",
          "uuid": "*",
          "category": {
            "id": "*",
            "title": "Shirts"
          }
        }
      }
    }
    """

  Scenario: creating product with old categories array, new categories were created before
    Given I use DB fixture "graphql/product-mutations/create-products-old-categories-have-mappings"
    When I send a GraphQL query to "/products":
      """
      mutation {
        createProduct(product: {
          businessUuid: "{{businessId}}",
          imagesUrl: [],
          images: [],
          title: "test product",
          description: "test",
          price: 1000,
          sale: {
            onSales: false,
            salePrice: 500
          },
          sku: "somesku",
          barcode: "123124",
          categories: [
            {
              title: "Clothing",
              businessUuid: "{{businessId}}"
            },
            {
              title: "Shirts",
              businessUuid: "{{businessId}}"
            }
          ],
          channelSets: [],
          condition: "refurbished",
          brand: "brand1",
          type: "physical",
          active: true,
          country: "DE",
          language: "DE"
        }) {
          title
          uuid
          category { id }
        }
      }
      """
    Then print last response
    And response status code should be 200
    And I get "data" from response and remember as "response"
    And model "Product" with id "{{response.createProduct.uuid}}" should contain json:
    """
    {
      "category": "{{subcategoryId}}"
    }
    """
