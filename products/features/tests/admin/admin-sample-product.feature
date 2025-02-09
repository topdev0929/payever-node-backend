Feature: Admin sample-product
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
    Given I remember as "BUSINESS_ID_3" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3"
      """

    Given I remember as "SAMPLE_PRODUCT_ID_1" following value:
      """
      "pppppppp-pppp-pppp-pppp-ppppppppppp1"
      """
    Given I remember as "SAMPLE_PRODUCT_ID_2" following value:
      """
      "pppppppp-pppp-pppp-pppp-ppppppppppp2"
      """

  Scenario: Only admin role has access to admin endpoint
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
    When I send a GET request to "/admin/sample-products"
    Then response status code should be 403

  Scenario: Get all sample-products
    Given I use DB fixture "admin/admin-sample-product"
    When I send a GET request to "/admin/sample-products"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "*",
            "businessId": "{{BUSINESS_ID_1}}"
          },
          {
            "_id": "*",
            "businessId": "{{BUSINESS_ID_1}}"
          },
          {
            "_id": "*",
            "businessId": "{{BUSINESS_ID_2}}"
          },
          {
            "_id": "*",
            "businessId": "{{BUSINESS_ID_2}}"
          }
        ]
      }
      """

  Scenario: Get all sample-products with filter
    Given I use DB fixture "admin/admin-sample-product"
    When I send a GET request to "/admin/sample-products?businessIds={{BUSINESS_ID_1}}&limit=1"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "*",
            "businessId": "{{BUSINESS_ID_1}}"
          }
        ],
        "page": 1,
        "total": 4
      }
      """
    And the response should not contain json:
      """
      {
        "documents": [
          {
            "_id": "*",
            "businessId": "{{BUSINESS_ID_2}}"
          }
        ]
      }
      """

  Scenario: Get sample-product by id
    Given I use DB fixture "admin/admin-sample-product"
    When I send a GET request to "/admin/sample-products/{{SAMPLE_PRODUCT_ID_1}}"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{SAMPLE_PRODUCT_ID_1}}",
        "businessId": "{{BUSINESS_ID_1}}"
      }
      """

  Scenario: Create a sample-product
    Given I use DB fixture "admin/admin-sample-product"
    When I send a POST request to "/admin/sample-products" with json:

      """

      {

        "active": true,

        "barcode": "1234567890",

        "businessId": "{{BUSINESS_ID_1}}",

        "description": "New Sample Product Description",

        "example": true,

        "images": [],

        "industry": "TEST_INDUSTRY",

        "onSales": false,

        "price": 100,

        "product": "3213i49582",

        "sku": "A101",

        "title": "New Sample Product",

        "type": "physical"

      }

      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "barcode": "1234567890",
        "businessId": "{{BUSINESS_ID_1}}",
        "description": "New Sample Product Description",
        "industry": "TEST_INDUSTRY",
        "title": "New Sample Product"
      }
      """

    And store a response as "response"
    And model "SampleProducts" with id "{{response._id}}" should contain json:
      """
      {
        "barcode": "1234567890",
        "businessId": "{{BUSINESS_ID_1}}",
        "description": "New Sample Product Description",
        "industry": "TEST_INDUSTRY",
        "title": "New Sample Product"
      }
      """

  Scenario: Update a sample-product
    Given I use DB fixture "admin/admin-sample-product"
    When I send a PATCH request to "/admin/sample-products/{{SAMPLE_PRODUCT_ID_1}}" with json:
      """
      {
        "description": "New Description",
        "title": "New Title"
      }
      """
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      {
        "description": "New Description",
        "title": "New Title"
      }
      """

    And store a response as "response"
    And model "SampleProducts" with id "{{response._id}}" should contain json:
      """
      {
        "description": "New Description",
        "title": "New Title"
      }
      """

  Scenario: Delete sample-product
    Given I use DB fixture "admin/admin-sample-product"
    When I send a DELETE request to "/admin/sample-products/{{SAMPLE_PRODUCT_ID_1}}"
    Then print last response
    And the response status code should be 200
    And model "SampleProducts" with id "{{SAMPLE_PRODUCT_ID_1}}" should not contain json:
      """
      {
        "_id": "{{SAMPLE_PRODUCT_ID_1}}"
      }
      """

