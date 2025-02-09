Feature: Admin product
  Background: constants
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "admin@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    Given I remember as "BUSINESS_ID_1" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1"
      """
    Given I remember as "BUSINESS_ID_2" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"
      """
    Given I remember as "PRODUCT_ID_1" following value:
      """
      "pppppppp-pppp-pppp-pppp-ppppppppppp1"
      """
    Given I remember as "PRODUCT_ID_2" following value:
      """
      "pppppppp-pppp-pppp-pppp-ppppppppppp2"
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
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products",
          {}
        ]
      }
      """

  Scenario: Only admin rols has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/admin/products"
    Then response status code should be 403

  Scenario: Get all products
    Given I use DB fixture "admin/admin-product"
    When I send a GET request to "/admin/products"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "id": "*",
            "businessId": "{{BUSINESS_ID_1}}"
          },
          {
            "id": "*",
            "businessId": "{{BUSINESS_ID_2}}"
          }
        ]
      }
      """

  Scenario: Get all products with filter
    Given I use DB fixture "admin/admin-product"
    When I send a GET request to "/admin/products?businessIds={{BUSINESS_ID_1}}"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "id": "*",
            "businessId": "{{BUSINESS_ID_1}}"
          }
        ]
      }
      """
    And the response should not contain json:
      """
      {
        "documents": [
          {
            "id": "*",
            "businessId": "{{BUSINESS_ID_2}}"
          }
        ]
      }
      """

  Scenario: Get product by id
    Given I use DB fixture "admin/admin-product"
    When I send a GET request to "/admin/products/{{PRODUCT_ID_1}}"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{PRODUCT_ID_1}}",
        "businessId": "{{BUSINESS_ID_1}}"
      }
      """

  Scenario: Create a product
    Given I use DB fixture "admin/admin-product"
    When I send a POST request to "/admin/products" with json:

      """
      {
        "currency": "EUR",
        "company": "company-a",
        "imagesUrl": [],
        "images": [],
        "videosUrl": [],
        "videos": [],
        "title": "product-title",
        "description": "product-description",
        "price": 1000,
        "vatRate": 0,
        "priceTable": [],
        "country": "country",
        "language": "language",
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "categories": [],
        "sku": "sku-1000",
        "barcode": "1000",
        "businessId": "{{BUSINESS_ID_1}}",
        "businessUuid": "{{BUSINESS_ID_1}}",
        "collections": [],
        "type": "physical",
        "importedId": null,
        "active": true,
        "marketplaces": [],
        "channelSets": [],
        "example": false,
        "recommendations": {
          "tag": "tag",
          "recommendations": []
        },
        "options": [],
        "variantAttributes": []
      }
      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_1}}",
        "_id": "*",
        "id": "*",
        "apps": [],
        "active": true,
        "collections": [],
        "channelSets": [],
        "imagesUrl": [],
        "images": [],
        "dropshipping": false,
        "example": false,
        "videosUrl": [],
        "videos": [],
        "isLocked": false,
        "attributes": [],
        "barcode": "1000",
        "categories": [],
        "company": "company-a",
        "country": "country",
        "currency": "EUR",
        "description": "product-description",
        "importedId": null,
        "language": "language",
        "options": [],
        "price": 1000,
        "priceTable": [],
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "sku": "sku-1000",
        "title": "product-title",
        "type": "physical",
        "variantAttributes": [],
        "vatRate": null
      }
      """

    And store a response as "response"
    And model "Product" with id "{{response._id}}" should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_1}}",
        "_id": "*",
        "apps": [],
        "active": true,
        "collections": [],
        "channelSets": [],
        "imagesUrl": [],
        "images": [],
        "dropshipping": false,
        "example": false,
        "videosUrl": [],
        "videos": [],
        "isLocked": false,
        "attributes": [],
        "barcode": "1000",
        "categories": [],
        "company": "company-a",
        "country": "country",
        "currency": "EUR",
        "description": "product-description",
        "importedId": null,
        "language": "language",
        "options": [],
        "price": 1000,
        "priceTable": [],
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "sku": "sku-1000",
        "title": "product-title",
        "type": "physical",
        "variantAttributes": [],
        "vatRate": null
      }
      """

  Scenario: Update a product
    Given I use DB fixture "admin/admin-product"
    When I send a PATCH request to "/admin/products/{{PRODUCT_ID_1}}" with json:
      """
      {
        "currency": "EUR",
        "company": "company-a",
        "imagesUrl": [],
        "images": [],
        "videosUrl": [],
        "videos": [],
        "title": "product-title",
        "description": "product-description",
        "price": 1000,
        "vatRate": 0,
        "priceTable": [],
        "country": "country",
        "language": "language",
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "categories": [],
        "sku": "sku-1000",
        "barcode": "1000",
        "businessId": "{{BUSINESS_ID_1}}",
        "businessUuid": "{{BUSINESS_ID_1}}",
        "collections": [],
        "type": "physical",
        "importedId": null,
        "active": true,
        "marketplaces": [],
        "channelSets": [],
        "example": false,
        "recommendations": {
          "tag": "tag",
          "recommendations": []
        },
        "options": [],
        "variantAttributes": []
      }
      """
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_1}}",
        "_id": "*",
        "apps": [],
        "active": true,
        "collections": [],
        "channelSets": [],
        "imagesUrl": [],
        "images": [],
        "dropshipping": false,
        "example": false,
        "videosUrl": [],
        "videos": [],
        "isLocked": false,
        "attributes": [],
        "barcode": "1000",
        "categories": [],
        "company": "company-a",
        "country": "country",
        "currency": "EUR",
        "description": "product-description",
        "importedId": null,
        "language": "language",
        "options": [],
        "price": 1000,
        "priceTable": [],
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "sku": "sku-1000",
        "title": "product-title",
        "type": "physical",
        "variantAttributes": [],
        "vatRate": 0
      }
      """

    And store a response as "response"
    And model "Product" with id "{{response._id}}" should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_1}}",
        "_id": "{{PRODUCT_ID_1}}",
        "apps": [],
        "active": true,
        "collections": [],
        "channelSets": [],
        "imagesUrl": [],
        "images": [],
        "dropshipping": false,
        "example": false,
        "videosUrl": [],
        "videos": [],
        "isLocked": false,
        "attributes": [],
        "barcode": "1000",
        "categories": [],
        "company": "company-a",
        "country": "country",
        "currency": "EUR",
        "description": "product-description",
        "importedId": null,
        "language": "language",
        "options": [],
        "price": 1000,
        "priceTable": [],
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "sku": "sku-1000",
        "title": "product-title",
        "type": "physical",
        "variantAttributes": [],
        "vatRate": 0
      }
      """

  Scenario: Update a product by businessId+SKU
    Given I use DB fixture "admin/admin-product"
    When I send a PATCH request to "/admin/products/business/{{BUSINESS_ID_1}}/sku/sku1" with json:
      """
      {
        "currency": "EUR",
        "company": "company-a",
        "imagesUrl": [],
        "images": [],
        "videosUrl": [],
        "videos": [],
        "title": "product-title",
        "description": "product-description",
        "price": 1000,
        "vatRate": 0,
        "priceTable": [],
        "country": "country",
        "language": "language",
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "categories": [],
        "sku": "new-sku",
        "barcode": "1000",
        "businessId": "{{BUSINESS_ID_1}}",
        "businessUuid": "{{BUSINESS_ID_1}}",
        "collections": [],
        "type": "physical",
        "importedId": null,
        "active": true,
        "marketplaces": [],
        "channelSets": [],
        "example": false,
        "recommendations": {
          "tag": "tag",
          "recommendations": []
        },
        "options": [],
        "variantAttributes": []
      }
      """
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_1}}",
        "_id": "{{PRODUCT_ID_1}}",
        "apps": [],
        "active": true,
        "collections": [],
        "channelSets": [],
        "imagesUrl": [],
        "images": [],
        "dropshipping": false,
        "example": false,
        "videosUrl": [],
        "videos": [],
        "isLocked": false,
        "attributes": [],
        "barcode": "1000",
        "categories": [],
        "company": "company-a",
        "country": "country",
        "currency": "EUR",
        "description": "product-description",
        "importedId": null,
        "language": "language",
        "options": [],
        "price": 1000,
        "priceTable": [],
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "sku": "new-sku",
        "title": "product-title",
        "type": "physical",
        "variantAttributes": [],
        "vatRate": 0
      }
      """

    And store a response as "response"
    And model "Product" with id "{{response._id}}" should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_1}}",
        "_id": "{{PRODUCT_ID_1}}",
        "apps": [],
        "active": true,
        "collections": [],
        "channelSets": [],
        "imagesUrl": [],
        "images": [],
        "dropshipping": false,
        "example": false,
        "videosUrl": [],
        "videos": [],
        "isLocked": false,
        "attributes": [],
        "barcode": "1000",
        "categories": [],
        "company": "company-a",
        "country": "country",
        "currency": "EUR",
        "description": "product-description",
        "importedId": null,
        "language": "language",
        "options": [],
        "price": 1000,
        "priceTable": [],
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "sku": "new-sku",
        "title": "product-title",
        "type": "physical",
        "variantAttributes": [],
        "vatRate": 0
      }
      """

  Scenario: Update a product by businessId+SKU which does not exist
    Given I use DB fixture "admin/admin-product"
    When I send a PATCH request to "/admin/products/business/{{BUSINESS_ID_2}}/sku/sku1" with json:
      """
      {
        "currency": "EUR",
        "company": "company-a",
        "imagesUrl": [],
        "images": [],
        "videosUrl": [],
        "videos": [],
        "title": "product-title",
        "description": "product-description",
        "price": 1000,
        "vatRate": 0,
        "priceTable": [],
        "country": "country",
        "language": "language",
        "sale": {
          "onSales": true,
          "salePrice": 1000
        },
        "categories": [],
        "sku": "new-sku",
        "barcode": "1000",
        "businessId": "{{BUSINESS_ID_1}}",
        "businessUuid": "{{BUSINESS_ID_1}}",
        "collections": [],
        "type": "physical",
        "importedId": null,
        "active": true,
        "marketplaces": [],
        "channelSets": [],
        "example": false,
        "recommendations": {
          "tag": "tag",
          "recommendations": []
        },
        "options": [],
        "variantAttributes": []
      }
      """
    Then response status code should be 404

  Scenario: Delete product
    Given I use DB fixture "admin/admin-product"
    When I send a DELETE request to "/admin/products/{{PRODUCT_ID_1}}"
    Then print last response
    And the response status code should be 200
    And model "Product" with id "{{PRODUCT_ID_1}}" should not contain json:
      """
      {
        "_id": "{{PRODUCT_ID_1}}"
      }
      """

