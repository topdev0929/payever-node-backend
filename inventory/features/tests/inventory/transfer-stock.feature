Feature: Should subtract stock from inventory
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "inventoryLocationId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "inventoryLocationId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    Given I remember as "inventorySku" following value:
      """
      "testSku"
      """
    Given I remember as "location1" following value:
      """
      "location_id_1"
      """
    Given I remember as "location2" following value:
      """
      "location_id_2"
      """
    Given I remember as "location3" following value:
      """
      "location_id_3"
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

  Scenario: transfer stock by sku
    Given I use DB fixture "inventory/transfer-stock-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}/transfer" with json:
      """
      {
        "fromLocationId": "{{location1}}",
        "toLocationId": "{{location2}}",
        "quantity": 3
      }
      """
    Then print last response
    And the response status code should be 200
    And look for model "InventoryLocation" by following JSON and remember as "fromInventory":
      """
        {
          "locationId": "{{location1}}"
        }
      """
    And stored value "fromInventory" should contain json:
      """
      {
        "stock": 12
      }
      """
    And look for model "InventoryLocation" by following JSON and remember as "toInventory":
      """
        {
          "locationId": "{{location2}}"
        }
      """
    And stored value "toInventory" should contain json:
      """
      {
        "stock": 8
      }
      """

  Scenario: transfer stock by sku for new location
    Given I use DB fixture "inventory/transfer-stock-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}/transfer" with json:
      """
      {
        "fromLocationId": "{{location1}}",
        "toLocationId": "{{location3}}",
        "quantity": 3
      }
      """
    Then print last response
    And the response status code should be 200
    And look for model "InventoryLocation" by following JSON and remember as "fromInventory":
      """
        {
          "locationId": "{{location1}}"
        }
      """
    And stored value "fromInventory" should contain json:
      """
      {
        "stock": 12
      }
      """
    And look for model "InventoryLocation" by following JSON and remember as "toInventory":
      """
        {
          "locationId": "{{location3}}"
        }
      """
    And stored value "toInventory" should contain json:
      """
      {
        "stock": 3
      }
      """
