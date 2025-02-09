Feature: Business bus messages
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Received business created method
    When I publish in RabbitMQ channel "async_events_plugins_micro" message with json:
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
    Then I process messages from RabbitMQ "async_events_plugins_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business updated method
    Given I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_plugins_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_plugins_micro" channel
    Then model "Business" with id "dac8cff5-dfc5-4461-b0e3-b25839527304" should contain json:
      """
      {
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
      }
      """

  Scenario: Received business migrated
    When I publish in RabbitMQ channel "async_events_plugins_micro" message with json:
      """
      {
        "name": "monolith.business.migrate",
        "payload": {
          "_id": "{{businessId}}",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_plugins_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business removed
    When I publish in RabbitMQ channel "async_events_plugins_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_plugins_micro" channel
    Then model "Business" with id "{{businessId}}" should not contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """
