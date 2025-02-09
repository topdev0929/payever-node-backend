Feature: When received message "synchronizer.event.outer-stock.created" should create inventory if not exists
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "testSku" following value:
      """
      "test_sku"
      """
    Given I remember as "anotherSku" following value:
      """
      "another_sku"
      """
    Given I remember as "inventoryId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "synchronizationTaskId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """

  Scenario: Receive "synchronizer.event.outer-stock.created" message
    Given I use DB fixture "synchronizer-bus/outer-stock-created"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "synchronizer.event.outer-stock.created",
        "payload": [{
          "business": {
            "id": "{{businessId}}"
          },
          "sku": "{{testSku}}",
          "stock": 10,
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          }
        }]
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "stock": 10
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
         "name": "inventory.event.inventory-synchronization.succeeded",
         "payload": {
           "inventory": {
             "sku": "{{testSku}}"
           },
           "synchronizationTask": {
             "id": "{{synchronizationTaskId}}"
           }
         }
        }
      ]
      """

  Scenario: Receive "synchronizer.event.outer-stock.created" message, without synchronization task
    Given I use DB fixture "synchronizer-bus/outer-stock-created"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "synchronizer.event.outer-stock.created",
        "payload": [{
          "business": {
            "id": "{{businessId}}"
          },
          "sku": "{{testSku}}",
          "stock": 10,
          "origin": "ebay",
          "isNegativeStockAllowed": true
        }]
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "stock": 10,
        "origin": "ebay",
        "isNegativeStockAllowed": true
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
         "name": "inventory.event.inventory-synchronization.succeeded",
         "payload": {
           "inventory": {
             "sku": "{{testSku}}"
           },
           "synchronizationTask": {
             "id": "{{synchronizationTaskId}}"
           }
         }
        }
      ]
      """

  Scenario: Receive "synchronizer.event.outer-stock.created" message
    Given I use DB fixture "synchronizer-bus/outer-stock-created-sku-exists"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "synchronizer.event.outer-stock.created",
        "payload": [{
          "business": {
            "id": "{{businessId}}"
          },
          "sku": "{{testSku}}",
          "stock": 999,
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          }
        }]
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "stock": 10
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
         "name": "inventory.event.inventory-synchronization.succeeded",
         "payload": {
           "inventory": {
             "sku": "{{testSku}}"
           },
           "synchronizationTask": {
             "id": "{{synchronizationTaskId}}"
           }
         }
        }
      ]
      """

  Scenario: Receive "synchronizer.event.outer-stock.upserted" message, with origin and isNegativeStockAllowed
    Given I use DB fixture "synchronizer-bus/outer-stock-created"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "synchronizer.event.outer-stock.upserted",
        "payload": [{
          "business": {
            "id": "{{businessId}}"
          },
          "sku": "{{testSku}}",
          "stock": 10,
          "origin": "ebay",
          "isNegativeStockAllowed": true
        }]
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "stock": 10,
        "origin": "ebay",
        "isNegativeStockAllowed": true
      }
      """

   Scenario: Change isNegativeStockAllowed with same origin, "synchronizer.event.outer-stock.upserted" message
    Given I use DB fixture "synchronizer-bus/outer-stock-created-sku-exists"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "synchronizer.event.outer-stock.upserted",
        "payload": [{
          "business": {
            "id": "{{businessId}}"
          },
          "sku": "{{testSku}}",
          "origin": "ebay",
          "isNegativeStockAllowed": true,
          "stock": 999,
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          }
        }]
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "origin": "ebay",
        "isNegativeStockAllowed": true
      }
      """
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "synchronizer.event.outer-stock.upserted",
        "payload": [{
          "business": {
            "id": "{{businessId}}"
          },
          "sku": "{{testSku}}",
          "origin": "facebook",
          "isNegativeStockAllowed": false,
          "stock": 999,
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          }
        }]
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "origin": "ebay",
        "isNegativeStockAllowed": true
      }
      """
