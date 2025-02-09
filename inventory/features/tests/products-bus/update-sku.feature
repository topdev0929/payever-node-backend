Feature: When received message that sku was updated, should update inventory
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "testSku" following value:
      """
      "test_sku"
      """
    Given I remember as "updatedSku" following value:
      """
      "updated_sku"
      """
    Given I remember as "anotherSku" following value:
      """
      "another_sku"
      """
    Given I remember as "inventoryId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "anotherInventoryId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """

  Scenario: Receive message that sku was updated
    Given I use DB fixture "products-bus/update-inventory-sku"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "products.event.product.sku-updated",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "originalSku": "{{testSku}}",
            "updatedSku": "{{updatedSku}}"
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
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
        {
          "sku": "{{updatedSku}}"
        }
      """

  Scenario: Receive message that sku was updated, and another business also has such sku
    Given I use DB fixture "products-bus/update-inventory-sku-another-business"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "products.event.product.sku-updated",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "originalSku": "{{testSku}}",
            "updatedSku": "{{updatedSku}}"
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
        {
          "sku": "{{updatedSku}}"
        }
      """
    And model "Inventory" with id "{{anotherInventoryId}}" should contain json:
      """
        {
          "sku": "{{testSku}}"
        }
      """
    
  Scenario: Receive message that sku was updated, but another inventory with such sku already exists
    Given I use DB fixture "products-bus/update-inventory-sku-already-exists"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "products.event.product.sku-updated",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "originalSku": "{{testSku}}",
            "updatedSku": "{{anotherSku}}"
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
    And model "Inventory" with id "{{anotherInventoryId}}" should contain json:
      """
        {
          "sku": "{{anotherSku}}"
        }
      """

