Feature: When received message that sku was removed, should remove inventory
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "testSku" following value:
      """
      "test_sku"
      """
    Given I remember as "inventoryId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """

  Scenario: Trying to remove inventory with zero stock
    Given I use DB fixture "products-bus/remove-inventory-with-zero-stock"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "products.event.product.sku-removed",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "sku": "{{testSku}}"
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And model "Inventory" found by following JSON should not exist:
      """
        {
          "sku": "{{testSku}}"
        }
      """

  Scenario: Trying to remove inventory with non-zero stock, shouldn't allow removal
    Given I use DB fixture "products-bus/remove-inventory-with-non-zero-stock"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "products.event.product.sku-removed",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "sku": "{{testSku}}"
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
        {
          "sku": "{{testSku}}"
        }
      """

  Scenario: Trying to remove inventory with non-zero reserved, shouldn't allow removal
    Given I use DB fixture "products-bus/remove-inventory-with-non-zero-reserved"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "products.event.product.sku-removed",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "sku": "{{testSku}}"
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
        {
          "sku": "{{testSku}}"
        }
      """
