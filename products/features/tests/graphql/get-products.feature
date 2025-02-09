Feature: Products GraphQL API
  Background:
    Given I remember as "businessId" following value:
    """
      "21f4947e-929a-11e9-bb05-7200004fe4c0"
    """
    And I use DB fixture "graphql/get-products/get-products-business"
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

  Scenario: Get products
    Given I use DB fixture "graphql/get-products/get-products"
    When I send a GraphQL query to "/products":
      """
      {
        getProducts(businessUuid: "{{businessId}}", paginationLimit: 10) {
          products {
            uuid,
            apps,
            priceTable {
              condition {
                field
              },
              currency,
              price,
              sale {
                salePrice,
                salePercent,
                saleEndDate,
                saleStartDate,
              }
              vatRate
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
                "apps": ["builder"],
                "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
                "priceTable": [{
                  "condition": {
                    "field": "customerUserId"
                  },
                  "currency": "USD",
                  "price": 50,
                  "sale": {
                    "salePrice": 45,
                    "salePercent": 10,
                    "saleEndDate": "2019-04-01T00:00:00.000Z",
                    "saleStartDate": "2019-04-03T00:00:00.000Z"
                  },
                  "vatRate": 12
                }]
              },
              {
                "apps": ["builder"],
                "uuid": "e563339f-0b4c-4aef-92e7-203b9761981c"
              },
              {
                "apps": ["builder"],
                "uuid": "a482bf57-1aec-4304-8751-4ce5cea603a4"
              }
            ]
          }
        }
      }
      """

  Scenario: Get products - check pagination and ordering
    Given I use DB fixture "graphql/get-products/get-products-check-pagination-and-ordering"
    When I send a GraphQL query to "/products":
      """
      {
        getProducts(businessUuid: "{{businessId}}", paginationLimit: 2, pageNumber: 2, orderBy: "updatedAt", orderDirection: "desc") {
          products {
            uuid
            imagesUrl
            videosUrl
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
                "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
                "videosUrl": [
                  "https://payevertesting.blob.core.windows.net/products/video1",
                  "https://payevertesting.blob.core.windows.net/products/video2"
                ],
                "imagesUrl": [
                  "https://payevertesting.blob.core.windows.net/products/image1",
                  "https://payevertesting.blob.core.windows.net/products/image2"
                ]
              }
            ]
          }
        }
      }
      """

  Scenario: Get products - check filter by id
    Given I use DB fixture "graphql/get-products/get-products-check-filter-by-id"
    When I send a GraphQL query to "/products":
      """
      {
      getProducts(
      businessUuid: "{{businessId}}",
      paginationLimit: 10,
      filterById: ["a482bf57-1aec-4304-8751-4ce5cea603a4", "e563339f-0b4c-4aef-92e7-203b9761981c"]
      ) {
      products {
      uuid
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
                "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
              }
            ]
          }
        }
      }
      """

  Scenario: Get Products - check filter by sku
    Given I use DB fixture "graphql/get-products/get-products-by-sku"
    When I send a GraphQL query to "/products":
    """
        {
          getProducts(
                businessUuid: "{{businessId}}",
                paginationLimit: 10,
                orderBy: "title",
                orderDirection: "asc",
                filters: [
                  {
                    field: "sku",
                    fieldType: "string",
                    fieldCondition: "contains",
                    value: "12345"
                  }
                ]
          )
          {
          products {
              uuid,
              title,
              sku,
            }
          }
        }
      """
    And the response status code should be 200
    Then the response should contain json:
    """
   {
           "data": {
             "getProducts": {
               "products": [
                 {
                   "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
                   "title": "Salt",
                   "sku": "12345678"
                 },
                 {
                   "uuid": "275e854f-4d0d-402e-bf8d-cf09d8b0bfa8",
                   "title": "phone",
                   "sku": "12345abcde"
                 }
               ]
             }
          }
    }
    """

  Scenario: Get Products - check filter by sku -endsWith
    Given I use DB fixture "graphql/get-products/get-products-by-sku"
    When I send a GraphQL query to "/products":
    """
        {
          getProducts(
                businessUuid: "{{businessId}}",
                paginationLimit: 10,
                orderBy: "title",
                orderDirection: "asc",
                filters: [
                  {
                    field: "sku",
                    fieldType: "string",
                    fieldCondition: "endsWith",
                    value: "abcde"
                  }
                ]
          )
          {
          products {
              uuid,
              title,
              sku,
            }
          }
        }
      """
    And the response status code should be 200
    Then the response should contain json:
    """
   {
           "data": {
             "getProducts": {
               "products": [
                 {
                   "uuid": "894d57ae-a164-4608-af05-7f5ab78bb0a1",
                   "title": "Pepper",
                   "sku": "abcde"
                 },
                 {
                   "uuid": "275e854f-4d0d-402e-bf8d-cf09d8b0bfa8",
                   "title": "phone",
                   "sku": "12345abcde"
                 }
               ]
             }
          }
    }
    """

  Scenario: Get products that do exist in given marketplace
    Given I use DB fixture "graphql/get-products/get-products-that-do-exist-in-given-marketplace"
    Given I use DB fixture "marketplaces"
    Given I use DB fixture "marketplace-assigments"
    When I send a GraphQL query to "/products":
    """
    {
      getProductsByMarketplace(
        businessUuid: "{{businessId}}",
        paginationLimit: 10,
        orderBy: "updatedAt",
        orderDirection: "asc",
        existInMarketplace: true,
        marketplaceId: "25321cee-c416-11e9-9b34-a721acfd92ed"
      ) {
      products {
      uuid
      }
      }
      }
      """
    Then print last response
    Then the response should contain json:
    """
    {
      "data": {
        "getProductsByMarketplace": {
          "products": [
            {
              "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
            }
          ]
        }
      }
    }
      """

  Scenario: Get products that does not exist in given marketplace
    Given I use DB fixture "graphql/get-products/get-products-that-do-not-exist-in-given-marketplace"
    Given I use DB fixture "marketplaces"
    Given I use DB fixture "marketplace-assigments"
    When I send a GraphQL query to "/products":
    """
    {
      getProductsByMarketplace(
        businessUuid: "{{businessId}}",
        paginationLimit: 10,
        orderBy: "updatedAt",
        orderDirection: "desc",
        existInMarketplace: false,
        marketplaceId: "25321cee-c416-11e9-9b34-a721acfd92ed"
      ) {
      products {
      uuid
      }
      }
      }
      """
    Then print last response
    Then the response should contain json:
    """
    {
      "data": {
        "getProductsByMarketplace": {
          "products": [
            {
              "uuid": "a482bf57-1aec-4304-8751-4ce5cea603a4"
            },
            {
              "uuid": "e563339f-0b4c-4aef-92e7-203b9761981c"
            }
          ]
        }
      }
    }
      """

  Scenario: get products by categories
    Given I use DB fixture "graphql/get-products/get-products-by-categories"
    When I send a GraphQL query to "/products":
      """
      {
      getProductsByCategories(
      businessUuid: "{{businessId}}",
      paginationLimit: 10,
      orderBy: "updatedAt",
      orderDirection: "asc",
      categories: ["82cfeeff-e483-4d61-acc5-b49103d8ec57"]
      ) {
      products {
      uuid
      }
      }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "getProductsByCategories": {
            "products": [
              {
                "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
              },
              {
                "uuid": "a482bf57-1aec-4304-8751-4ce5cea603a4"
              }
            ]
          }
        }
      }
      """

  Scenario: get product by uuid
    Given I use DB fixture "graphql/get-products/get-product-by-uuid"
    When I send a GraphQL query to "/products":
      """
      {
        product(uuid: "e563339f-0b4c-4aef-92e7-203b9761981c") {
          uuid
          videosUrl
        }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "product": {
            "uuid": "e563339f-0b4c-4aef-92e7-203b9761981c",
            "videosUrl": [
              "https://payevertesting.blob.core.windows.net/products/video3",
              "https://payevertesting.blob.core.windows.net/products/video4"
            ]
          }
        }
      }
      """
