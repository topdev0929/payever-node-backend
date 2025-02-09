Feature: Business bus messages
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Received business created method
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business updated method
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "{{businessId}}",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business exported
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "users.event.business.export",
        "payload": {
          "_id": "{{businessId}}",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business removed
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    Then model "Business" with id "{{businessId}}" should not contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """
