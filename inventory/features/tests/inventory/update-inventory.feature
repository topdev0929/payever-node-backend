Feature: Should update inventory
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
    Given I remember as "anotherSku" following value:
      """
      "anotherSku"
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

  Scenario: Update inventory by sku, anonymous
    Given I am not authenticated
    And I use DB fixture "inventory/update-inventory-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}"
    Then print last response
    And the response status code should be 403

  Scenario: Update inventory by sku
    Given I use DB fixture "inventory/update-inventory-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}" with json:
      """
      {
        "sku": "{{inventorySku}}",
        "barcode": "updated_barcode",
        "isTrackable": false,
        "isNegativeStockAllowed": true
      }
      """
    Then print last response
    And the response status code should be 200
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{inventorySku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "barcode": "updated_barcode",
        "isTrackable": false,
        "isNegativeStockAllowed": true
      }
      """

  Scenario: Update inventory by sku, inventory not exists
    Given I use DB fixture "inventory/update-inventory-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{anotherSku}}"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
    """
    {
      "message": "Inventory by {\"businessId\":\"{{businessId}}\",\"sku\":\"{{anotherSku}}\"} not found!"
    }
    """

  Scenario: Update inventory by product, anonymous
    Given I am not authenticated
    And I use DB fixture "inventory/update-inventory-by-product"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/product/{{productId}}"
    Then print last response
    And the response status code should be 403

  Scenario: Update inventory by product
    Given I use DB fixture "inventory/update-inventory-by-product"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/product/{{productId}}" with json:
      """
      {
        "sku": "{{inventorySku}}",
        "barcode": "updated_barcode",
        "isTrackable": false,
        "isNegativeStockAllowed": true
      }
      """
    Then print last response
    And the response status code should be 200
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "product": "{{productId}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "barcode": "updated_barcode",
        "isTrackable": false,
        "isNegativeStockAllowed": true
      }
      """

  Scenario: Update inventory by product, sku not match
    Given I use DB fixture "inventory/update-inventory-by-product-sku-not-match-and-exists"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/product/{{productId}}" with json:
      """
      {
        "sku": "{{anotherSku}}",
        "barcode": "updated_barcode",
        "isTrackable": false,
        "isNegativeStockAllowed": true
      }
      """
    Then print last response
    And the response status code should be 409
    And the response should contain json:
      """
      {
        "statusCode": 409,
        "message": "Inventory with SKU '{{anotherSku}}' already exists for business '{{businessId}}'"
      }
      """

  Scenario: Update inventory by product, inventory not exists
    Given I use DB fixture "inventory/update-inventory-by-product"
    And I remember as "anotherProductId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/product/{{anotherProductId}}"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "message": "Inventory by {\"businessId\":\"{{businessId}}\",\"product\":\"{{anotherProductId}}\"} not found!"
      }
      """
