Feature: Should create inventory, if inventory is exists then must throw error
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
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

  Scenario: Creating new inventory, not authorized
    Given I am not authenticated
    When I send a POST request to "/api/business/{{businessId}}/inventory" with json:
      """
      {
        "sku": "{{inventorySku}}",
        "barcode": "barcode",
        "isTrackable": true,
        "isNegativeStockAllowed": true
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Creating new inventory, sku doesn't exist
    Given I use DB fixture "inventory/create-inventory-sku-not-exists"
    When I send a POST request to "/api/business/{{businessId}}/inventory" with json:
      """
      {
        "sku": "{{inventorySku}}",
        "barcode": "barcode",
        "isTrackable": true,
        "isNegativeStockAllowed": true
      }
      """
    Then print last response
    And the response status code should be 201
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
        "barcode": "barcode",
        "isTrackable": true,
        "isNegativeStockAllowed": true,
        "origin": "commerceos"
      }
      """

  Scenario: Creating new inventory, sku already exists
    Given I use DB fixture "inventory/create-inventory-sku-already-exists"
    When I send a POST request to "/api/business/{{businessId}}/inventory" with json:
      """
      {
        "sku": "{{inventorySku}}",
        "barcode": "barcode",
        "isTrackable": true,
        "isNegativeStockAllowed": true
      }
      """
    Then print last response
    And the response status code should be 409
    And the response should contain json:
      """
      {
        "statusCode": 409,
        "message": "Inventory for sku \"testSku\" already exists"
      }
      """

  
  Scenario: Creating new inventory, sku doesn't exist, with origin
    Given I use DB fixture "inventory/create-inventory-sku-not-exists"
    When I send a POST request to "/api/business/{{businessId}}/inventory" with json:
      """
      {
        "sku": "{{inventorySku}}",
        "barcode": "barcode",
        "isTrackable": true,
        "isNegativeStockAllowed": true,
        "origin": "ebay"
      }
      """
    Then print last response
    And the response status code should be 201
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
        "barcode": "barcode",
        "isTrackable": true,
        "isNegativeStockAllowed": true,
        "origin": "ebay"
      }
      """
