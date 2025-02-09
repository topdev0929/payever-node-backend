Feature: Business bus messages
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["marketplace-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Received business created method
    When I publish in RabbitMQ channel "async_events_marketplace_micro" message with json:
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
    Then I process messages from RabbitMQ "async_events_marketplace_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business updated method
    Given I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_marketplace_micro" message with json:
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
    Then I process messages from RabbitMQ "async_events_marketplace_micro" channel
    Then model "Business" with id "dac8cff5-dfc5-4461-b0e3-b25839527304" should contain json:
      """
      {
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
      }
      """

  Scenario: Received business export
    When I publish in RabbitMQ channel "async_events_marketplace_micro" message with json:
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
    Then I process messages from RabbitMQ "async_events_marketplace_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business removed
    When I publish in RabbitMQ channel "async_events_marketplace_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_marketplace_micro" channel
    Then model "Business" with id "{{businessId}}" should not contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """
