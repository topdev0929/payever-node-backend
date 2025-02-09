Feature: Business bus messages
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Received business created method
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "shipping-box-folder",
          []
         ],
        "result": {}
      }
      """
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
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
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business updated method
    Given I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
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
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    Then model "Business" with id "dac8cff5-dfc5-4461-b0e3-b25839527304" should contain json:
      """
      {
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
      }
      """

  Scenario: Received business removed
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    Then model "Business" with id "{{businessId}}" should not contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business export new method
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
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
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Received business export existing method
    Given I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
      """
      {
        "name": "users.event.business.export",
        "payload": {
          "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    Then model "Business" with id "dac8cff5-dfc5-4461-b0e3-b25839527304" should contain json:
      """
      {
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
      }
      """

  Scenario: Received AA registry installed method
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
      """
      {
        "name": "app-registry.event.application.installed",
        "payload": {
          "businessId": "568192aa-36ea-48d8-bc0a-8660029e6f72",
          "code": "shipping"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    Then model "IntegrationSubscription" with id "e87ea7d6-de6b-4d73-8226-83c41da3e600" should contain json:
      """
      {
        "rules": [
          "*"
        ]
      }
      """

  Scenario: Received AA registry uminstalled method
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
      """
      {
        "name": "app-registry.event.application.uninstalled",
        "payload": {
          "businessId": "568192aa-36ea-48d8-bc0a-8660029e6f72",
          "code": "shipping"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    Then model "IntegrationSubscription" with id "e87ea7d6-de6b-4d73-8226-83c41da3e600" should contain json:
      """
      {
        "rules": []
      }
      """
