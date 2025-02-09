Feature: Should return inventory if it is exists
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "inventorySku" following value:
      """
      "testSku"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Get all inventory by business, anonymous
    Given I am not authenticated
    And I use DB fixture "inventory/get-inventory-by-business"
    When I send a GET request to "/api/business/{{businessId}}/inventory"
    Then print last response
    And the response status code should be 403

  Scenario: Get all inventory by business
    Given I use DB fixture "inventory/get-inventory-by-business"
    When I send a GET request to "/api/business/{{businessId}}/inventory"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
     [
       {
         "isNegativeStockAllowed": "*",
         "isTrackable": "*",
         "barcode": "test_barcode_1",
         "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
         "product": "*",
         "reserved": 1,
         "sku": "testSku_1",
         "stock": 11
       },
       {
         "isNegativeStockAllowed": "*",
         "isTrackable": "*",
         "barcode": "test_barcode_2",
         "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
         "product": "*",
         "reserved": 2,
         "sku": "testSku_2",
         "stock": 12
       },
       {
         "isNegativeStockAllowed": "*",
         "isTrackable": "*",
         "barcode": "test_barcode_3",
         "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
         "product": "*",
         "reserved": 3,
         "sku": "testSku_3",
         "stock": 13
       }
     ]
    """

  Scenario: Get inventory by sku, anonymous
    Given I am not authenticated
    And I use DB fixture "inventory/get-inventory-by-sku"
    When I send a GET request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isNegativeStockAllowed": true,
        "isTrackable": true,
        "barcode": "test_barcode",
        "businessId": "{{businessId}}",
        "product": "{{productId}}",
        "reserved": 10,
        "sku": "{{inventorySku}}",
        "stock": 20
      }
      """

  Scenario: Get inventory by sku, anonymous, sku not exists
    Given I am not authenticated
    And I use DB fixture "inventory/get-inventory-by-sku-not-exists"
    When I send a GET request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "message": "Inventory by {\"businessId\":\"{{businessId}}\",\"sku\":\"{{inventorySku}}\"} not found!"
      }
      """

  Scenario: Get inventory by product, anonymous
    Given I am not authenticated
    And I use DB fixture "inventory/get-inventory-by-product"
    When I send a GET request to "/api/business/{{businessId}}/inventory/product/{{productId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isNegativeStockAllowed": true,
        "isTrackable": true,
        "barcode": "test_barcode",
        "businessId": "{{businessId}}",
        "product": "{{productId}}",
        "reserved": 10,
        "sku": "{{inventorySku}}",
        "stock": 20
      }
      """

  Scenario: Get inventory by sku, anonymous, sku not exists
    Given I am not authenticated
    And I use DB fixture "inventory/get-inventory-by-product-not-exists"
    When I send a GET request to "/api/business/{{businessId}}/inventory/product/{{productId}}"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "message": "Inventory by {\"businessId\":\"{{businessId}}\",\"product\":\"{{productId}}\"} not found!"
      }
      """
