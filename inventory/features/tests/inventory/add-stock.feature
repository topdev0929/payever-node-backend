Feature: Should add stock for inventory
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "anotherProductId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
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

  Scenario: Add stock by sku, anonymous
    Given I am not authenticated
    And I use DB fixture "inventory/add-stock-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}/add"
    Then print last response
    And the response status code should be 403

  Scenario: Add stock by sku
    Given I use DB fixture "inventory/add-stock-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}/add" with json:
      """
      {
        "quantity": 99
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
        "stock": 119
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
           "name": "inventory.event.stock.added",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "quantity": 99,
             "sku": "{{inventorySku}}",
             "stock": 119
           }
         }

      ]
      """

  Scenario: Add stock by sku, inventory not exists
    Given I use DB fixture "inventory/add-stock-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{anotherSku}}/add" with json:
      """
      {
        "quantity": 99
      }
      """
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
        {
          "statusCode": 404,
          "message": "Inventory by {\"businessId\":\"{{businessId}}\",\"sku\":\"{{anotherSku}}\"} not found!"
        }
      """

  Scenario: Add stock by product, anonymous
    Given I am not authenticated
    And I use DB fixture "inventory/add-stock-by-product"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/product/{{productId}}/add"
    Then print last response
    And the response status code should be 403

  Scenario: Add stock by product
    And I use DB fixture "inventory/add-stock-by-product"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/product/{{productId}}/add" with json:
      """
      {
        "quantity": 99
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
        "stock": 119
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
           "name": "inventory.event.stock.added",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "quantity": 99,
             "sku": "{{inventorySku}}",
             "stock": 119
           }
         }

      ]
      """

  Scenario: Add stock by product, inventory not exists
    And I use DB fixture "inventory/add-stock-by-product"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/product/{{anotherProductId}}/add" with json:
      """
      {
        "quantity": 99
      }
      """
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
        {
          "statusCode": 404,
          "message": "Inventory by {\"businessId\":\"{{businessId}}\",\"product\":\"{{anotherProductId}}\"} not found!"
        }
      """

  
  Scenario: Add stock with location
    Given I use DB fixture "inventory/add-stock-with-location"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}/add" with json:
      """
      {
        "quantity": 99,
        "inventoryLocations": [
          {
            "locationId": "location_id_1",
            "stock": 40
          },
          {
            "locationId": "location_id_2",
            "stock": 59
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And I look for model "InventoryLocation" by following JSON and remember as "inventoryLocation":
      """
      {
        "_id": "{{inventoryLocationId1}}"
      }
      """
    And print storage key "inventoryLocation"
    And stored value "inventoryLocation" should contain json:
      """
      {
        "stock": 40
      }
      """

  Scenario: Add stock to paticular location
    Given I use DB fixture "inventory/add-stock-with-location"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}/inventory-location/{{inventoryLocationId1}}/add" with json:
      """
      {
        "quantity": 4
      }
      """
    Then print last response
    And the response status code should be 200
    And I look for model "InventoryLocation" by following JSON and remember as "inventoryLocation":
      """
      {
        "_id": "{{inventoryLocationId1}}"
      }
      """
    And print storage key "inventoryLocation"
    And stored value "inventoryLocation" should contain json:
      """
      {
        "stock": 4
      }
      """
