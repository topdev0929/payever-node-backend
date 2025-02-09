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
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "deleteByQuery" with:
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

  Scenario: create product mutation
    When I send a GraphQL query to "/products":
      """
      mutation {
        createProduct(product: {
          businessUuid: "{{businessId}}",
          channelSets: [],
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
          categories: [],
          type: "physical",
          condition: "refurbished",
          brand: "brand1",
          active: true,
          country: "DE",
          language: "DE",
          attributes: [
            {
              name: "Text Attribute",
              value: "Text Value",
              type: "text"
            }
          ],
          variantAttributes: [
            {
              name: "Variation Attribute1",
              type: "text"
            }
            {
              name: "Variation Attribute2",
              type: "color"
            }
          ],
          deliveries: [
            {
              name: "fedex",
              duration: 3,
              measure_duration: "month"
            }
          ],
          variants: [
            {
              barcode: "",
              description: "test variant",
              images: [],
              sale: {
                onSales: false
              },
              attributes: [
                {
                  name: "Variation Attribute1",
                  value: "100",
                  type: "text"
                }
              ],
              price: 111,
              sku: "variantSku"
            }
          ]
        }) {
          businessUuid
          currency
          uuid
          images
          imagesUrl
          title
          description
          price
          sale {
            onSales
            salePrice
          }
          sku
          barcode
          categories {
            _id
            businessUuid
            title
            slug
          }
          type
          active
          variants {
            id
            images
            title
            description
            price
            sale {
              onSales
              salePrice
            }
            sku
            barcode
          }
          deliveries {
            name
            duration
            measure_duration
          }
          shipping {
            free
            general
            weight
            width
            length
            height
          }
          attributes {
            name
            value
            type
          }
          variantAttributes {
            name
            type
          }
          variants {
            attributes {
              name
              value
              type
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
          "createProduct": {
            "businessUuid": "{{businessId}}",
            "currency": "EUR",
            "images": [],
            "imagesUrl": [],
            "title": "test product",
            "description": "test",
            "price": 1000,
            "sale": {
              "onSales": false,
              "salePrice": 500
            },
            "sku": "somesku",
            "barcode": "123124",
            "categories": [],
            "type": "physical",
            "active": true,
            "variants": [
              {
                "attributes": [
                  {
                    "name": "Variation Attribute1",
                    "value": "100",
                    "type": "text"
                  }
                ]
              }
            ],
			"deliveries": [
              {
                "name": "fedex",
                "duration": 3,
                "measure_duration": "month"
              }
			],
            "attributes": [
              {
                "name": "Text Attribute",
                "value": "Text Value",
                "type": "text"
              }
            ],
            "variantAttributes": [
              {
                "name": "Variation Attribute1",
                "type": "text"
              },
              {
                "name": "Variation Attribute2",
                "type": "color"
              }
            ]
          }
        }
      }
      """
    Then I get "data" from response and remember as "response"
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

  Scenario: Should not duplicate sku+businessId
    When I send a GraphQL query to "/products":
      """
      mutation {
        createProduct(product: {
          businessUuid: "{{businessId}}",
          channelSets: [],
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
          categories: [],
          condition: "refurbished",
          brand: "brand1",
          type: "physical",
          active: true,
          country: "DE",
          language: "DE"
        }) {
          businessUuid
          sku
        }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "createProduct": {
            "businessUuid": "{{businessId}}",
            "sku": "somesku"
          }
        }
      }
      """
    When I send a GraphQL query to "/products":
      """
      mutation {
      createProduct(product: {
      businessUuid: "{{businessId}}",
      channelSets: [],
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
      categories: [],
      condition: "refurbished",
      brand: "brand1",
      type: "physical",
      active: true,
      country: "DE",
      language: "DE"
      }) {
      uuid
      }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "errors": [
          {
            "extensions": {
              "code": "BAD_USER_INPUT"
            }
          }
        ]
      }
      """

  # Always failing in pipeline by timeout
  # Scenario: Update product
  #   Given I use DB fixture "graphql/product-mutations/update-product"
  #   Given I use DB fixture "marketplaces"
  #   When I send a GraphQL query to "/products":
  #     """
  #     mutation {
  #       updateProduct(product: {
  #         id: "3799bb06-929a-11e9-b5a6-7200004fe4c0"
  #         businessUuid: "{{businessId}}"
  #         categories: [],
  #         title: "test product",
  #         description: "test",
  #         onSales: true,
  #         imagesUrl: [],
  #         images: [],
  #         price: 2000,
  #         salePrice: 1000,
  #         sku: "someothersku",
  #         barcode: "54321",
  #         condition: "refurbished",
  #         brand: "brand1",
  #         type: "service",
  #         active: false,
  #         country: "DE",
  #         language: "DE",
  #         marketplaces: [
  #           {
  #             id: "25321cee-c416-11e9-9b34-a721acfd92ed",
  #           }
  #         ],
  #         attributes: [
  #           {
  #             name: "Text Attribute",
  #             value: "Text Value",
  #             type: "text"
  #           }
  #         ],
  #         variantAttributes: [
  #           {
  #             name: "Variation Attribute1",
  #             type: "text"
  #           }
  #           {
  #             name: "Variation Attribute2",
  #             type: "color"
  #           }
  #         ],
  #         variants: [
  #           {
  #             barcode: "",
  #             description: "test variant",
  #             images: [],
  #             onSales: false,
  #             attributes: [
  #               {
  #                 name: "Variation Attribute1",
  #                 value: "100",
  #                 type: "text"
  #               }
  #             ],
  #             price: 111,
  #             sku: "variantSku"
  #           }
  #         ]
  #       }) {
  #         id
  #         uuid
  #         title
  #         description
  #         onSales
  #         price
  #         salePrice
  #         sku
  #         barcode
  #         type
  #         active
  #         marketplaces {
  #           id
  #           type
  #           activated
  #           connected
  #         }
  #         attributes {
  #           name
  #           value
  #           type
  #         }
  #         variantAttributes {
  #           name
  #           type
  #         }
  #         variants {
  #           attributes {
  #             name
  #             value
  #             type
  #           }
  #         }
  #       }
  #     }
  #     """
  #   Then print last response
  #   Then the response should contain json:
  #     """
  #     {
  #       "data": {
  #         "updateProduct": {
  #           "id": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
  #           "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
  #           "title": "test product",
  #           "description": "test",
  #           "onSales": true,
  #           "price": 2000,
  #           "salePrice": 1000,
  #           "sku": "someothersku",
  #           "barcode": "54321",
  #           "type": "service",
  #           "active": false,
  #           "attributes": [
  #             {
  #               "name": "Text Attribute",
  #               "value": "Text Value",
  #               "type": "text"
  #             }
  #           ],
  #           "variantAttributes": [
  #             {
  #               "name": "Variation Attribute1",
  #               "type": "text"
  #             },
  #             {
  #               "name": "Variation Attribute2",
  #               "type": "color"
  #             }
  #           ],
  #           "variants": [
  #             {
  #               "attributes": [
  #                 {
  #                   "name": "Variation Attribute1",
  #                   "value": "100",
  #                   "type": "text"
  #                 }
  #               ]
  #             }
  #           ]
  #         }
  #       }
  #     }
  #     """
  #   Then I get "data" from response and remember as "response"
  #   Then model "ProductTranslation" found by following JSON should exist:
  #     """
  #     {
  #       "product": "{{response.updateProduct.uuid}}"
  #     }
  #     """
  #   Then model "ProductCountrySetting" found by following JSON should exist:
  #     """
  #     {
  #       "product": "{{response.updateProduct.uuid}}"
  #     }
  #     """

  # TODO: Restore test. it always fails by timeout in pipeline only
  # Scenario: Update product with price table
  #   Given I use DB fixture "graphql/product-mutations/update-product"
  #   Given I use DB fixture "marketplaces"
  #   When I send a GraphQL query to "/products":
  #     """
  #     mutation {
  #       updateProduct(product: {
  #         id: "3799bb06-929a-11e9-b5a6-7200004fe4c0"
  #         businessUuid: "{{businessId}}"
  #         categories: [],
  #         title: "test product with price table",
  #         description: "test",
  #         onSales: true,
  #         imagesUrl: [],
  #         images: [],
  #         price: 2000,
  #         salePrice: 1000,
  #         sku: "someothersku",
  #         barcode: "54321",
  #         brand: "brand1",
  #         type: "service",
  #         type: "service",
  #         active: false,
  #         country: "DE",
  #         marketplaces: [
  #           {
  #             id: "25321cee-c416-11e9-9b34-a721acfd92ed",
  #           }
  #         ],
  #         attributes: [
  #           {
  #             name: "Text Attribute",
  #             value: "Text Value",
  #             type: "text"
  #           }
  #         ],
  #         variantAttributes: [
  #           {
  #             name: "Variation Attribute1",
  #             type: "text"
  #           }
  #           {
  #             name: "Variation Attribute2",
  #             type: "color"
  #           }
  #         ],
  #         variants: [
  #           {
  #             barcode: "",
  #             description: "test variant",
  #             images: [],
  #             onSales: false,
  #             attributes: [
  #               {
  #                 name: "Variation Attribute1",
  #                 value: "100",
  #                 type: "text"
  #               }
  #             ],
  #             price: 111,
  #             sku: "variantSku"
  #           }
  #         ]
  #         priceTable: [
  #           {
  #             condition: {
  #               field: "customerCountryCode",
  #               fieldType: "string",
  #               fieldCondition: "is",
  #               value: "GB"
  #             },
  #             currency: "eur",
  #             price: 1800
  #           }
  #         ]
  #       }) {
  #         id
  #         uuid
  #         title
  #         onSales
  #         price
  #         salePrice
  #         priceTable {
  #           condition {
  #             field
  #             fieldType
  #             fieldCondition
  #             value
  #           }
  #           currency
  #           price
  #           salePrice
  #           vatRate
  #         }
  #       }
  #     }
  #     """
  #   Then print last response
  #   Then the response should contain json:
  #     """
  #     {
  #       "data": {
  #         "updateProduct": {
  #           "id": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
  #           "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
  #           "title": "test product with price table",
  #           "priceTable": [
  #             {
  #               "condition": {
  #                 "field": "customerCountryCode",
  #                 "fieldType": "string",
  #                 "fieldCondition": "is",
  #                 "value": "GB"
  #               },
  #               "currency": "eur",
  #               "price": 1800
  #             }
  #           ]
  #         }
  #       }
  #     }
  #     """

  Scenario: Update products to marketplaces
    Given I use DB fixture "graphql/product-mutations/update-product"
    Given I use DB fixture "marketplace-assigments"
    When I send a GraphQL query to "/products":
      """
      mutation {
      updateProductsToMarketplaces(
      deleteFromProductIds: ["3799bb06-929a-11e9-b5a6-7200004fe4c0"],
      addToProductIds: ["6401148a-b51e-4806-bfab-973c4448281a"],
      marketplaces: [
      {
      id: "25321cee-c416-11e9-9b34-a721acfd92ed"
      }
      ]
      ) {
      uuid
      }
      }
      """
    Then print last response
    Then the response status code should be 200

  Scenario: Delete products
    Given I use DB fixture "graphql/product-mutations/delete-products"
    When I send a GraphQL query to "/products":
      """
      mutation {
      deleteProduct(ids: ["8ec067ba-b673-40b1-baa4-e05856acf637", "406e4c1b-b0f8-48d3-9956-95657a36957b"])
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "deleteProduct": 2
        }
      }
      """
    When I send a GraphQL query to "/products":
      """
      {
      getProducts(businessUuid: "{{businessId}}", paginationLimit: 10) {
      products {
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
          "getProducts": {
            "products": []
          }
        }
      }
      """
