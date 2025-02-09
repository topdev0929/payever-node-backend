Feature: When received message "synchronizer.event.inventory.synchronize" should trigger outward inventory sync
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "anotherBusinessId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
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

  Scenario: Receive "synchronizer.event.inventory.synchronize" message
    Given I use DB fixture "synchronizer-bus/synchronize-inventory"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "synchronizer.event.inventory.synchronize",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            }
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "inventory.event.stock.synchronize",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "sku": "sku_1",
            "stock": 0
          }
        },
        {
          "name": "inventory.event.stock.synchronize",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "sku": "sku_2",
            "stock": 0
          }
        },
        {
          "name": "inventory.event.stock.synchronize",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "sku": "sku_3",
            "stock": 0
          }
        },
        {
          "name": "inventory.event.stock.synchronize",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "sku": "sku_4",
            "stock": 0
          }
        },
        {
          "name": "inventory.event.stock.synchronize",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "sku": "sku_5",
            "stock": 0
          }
        }
      ]
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name": "inventory.event.stock.synchronize",
          "payload": {
            "sku": "{{anotherSku}}",
            "stock": 0
          }
        }
      ]
      """