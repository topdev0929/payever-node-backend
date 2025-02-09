Feature: When received message "synchronizer.event.outer-stock.added" should add stock to inventory
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

  Scenario: Receive "synchronizer.event.outer-stock.added" message
    Given I use DB fixture "synchronizer-bus/outer-stock-added"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "synchronizer.event.outer-stock.added",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "sku": "{{testSku}}",
          "quantity": 20
        }
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
        "stock": 30
      }
      """

  Scenario: Receive "synchronizer.event.outer-stock.added" message, sku not exists
    Given I use DB fixture "synchronizer-bus/outer-stock-added"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "synchronizer.event.outer-stock.added",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "sku": "{{anotherSku}}",
          "quantity": 20
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And model "Inventory" found by following JSON should not exist:
      """
        {
          "sku": "{{anotherSku}}",
          "businessId": "{{businessId}}"
        }
      """
