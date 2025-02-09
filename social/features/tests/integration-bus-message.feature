Feature: Integration bus messages
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["post-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I remember as "businessId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """

  Scenario: Received app installed method
    Given I use DB fixture "integrations"
    When I publish in RabbitMQ channel "async_events_social_micro" message with json:
      """
      {
        "name": "connect.event.third-party.enabled",
        "payload": {
          "businessId": "{{businessId}}",
          "name": "test",
          "category": "social"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_social_micro" channel
    And look for model "IntegrationSubscription" by following JSON and remember as "data":
    """
    {
      "integration": "dac8cff5-dfc5-4461-b0e3-b25839527305"
    }
    """
    And print storage key "data"
    Then stored value "data" should contain json:
      """
      {
        "_id": "*",
        "integration": "dac8cff5-dfc5-4461-b0e3-b25839527305",
        "installed": true
      }
      """

  Scenario: Received app installed method
    Given I use DB fixture "integrations"
    When I publish in RabbitMQ channel "async_events_social_micro" message with json:
      """
      {
        "name": "connect.event.third-party.disabled",
        "payload": {
          "businessId": "{{businessId}}",
          "name": "test",
          "category": "social"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_social_micro" channel
    And look for model "IntegrationSubscription" by following JSON and remember as "data":
    """
    {
      "integration": "dac8cff5-dfc5-4461-b0e3-b25839527305"
    }
    """
    And print storage key "data"
    Then stored value "data" should contain json:
      """
      {
        "_id": "*",
        "integration": "dac8cff5-dfc5-4461-b0e3-b25839527305",
        "installed": false
      }
      """

  Scenario: Received app enabled method
    Given I use DB fixture "integrations"
    When I publish in RabbitMQ channel "async_events_social_micro" message with json:
      """
      {
        "name": "third-party.event.third-party.connected",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "integration": {
            "name": "test"
          },
          "connection": {
            "id": "{{businessId}}",
            "name": "test"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_social_micro" channel
    And look for model "IntegrationSubscription" by following JSON and remember as "data":
    """
    {
      "integration": "dac8cff5-dfc5-4461-b0e3-b25839527305"
    }
    """
    And print storage key "data"
    Then stored value "data" should contain json:
      """
      {
        "_id": "*",
        "integration": "dac8cff5-dfc5-4461-b0e3-b25839527305",
        "enabled": true
      }
      """

  Scenario: Received app disabled method
    Given I use DB fixture "integrations"
    When I publish in RabbitMQ channel "async_events_social_micro" message with json:
      """
      {
        "name": "third-party.event.third-party.disconnected",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "integration": {
            "name": "test"
          },
          "connection": {
            "id": "{{businessId}}",
            "name": "test"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_social_micro" channel
    And look for model "IntegrationSubscription" by following JSON and remember as "data":
    """
    {
      "integration": "dac8cff5-dfc5-4461-b0e3-b25839527305"
    }
    """
    And print storage key "data"
    Then stored value "data" should contain json:
      """
      {
        "_id": "*",
        "integration": "dac8cff5-dfc5-4461-b0e3-b25839527305",
        "enabled": false
      }
      """
