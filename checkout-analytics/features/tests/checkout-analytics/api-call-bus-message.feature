@apicall
Feature: Api call bus message handling
  Background:
    Given I remember as "businessId" following value:
      """
      "d916ec94-3b2e-4728-bce2-3e9b4f9d353d"
      """

  Scenario: create api call
    Given I use DB fixture "checkout-metrics/api-call/api-call"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.api-call.created",
      "payload": {
        "businessId": "{{businessId}}",
        "paymentId": "test"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel

    When look for model "ApiCall" by following JSON and remember as "app":
      """
      {
        "paymentId": "test"
      }
      """
    Then print storage key "app"
    And stored value "app" should contain json:
      """
      {
        "__v": "*",
        "_id": "*",
        "businessId": "{{businessId}}",
        "paymentId": "test"
      }
      """

  Scenario: update api call
    Given I use DB fixture "checkout-metrics/api-call/api-call"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.api-call.updated",
      "payload": {
        "businessId": "{{businessId}}",
        "paymentId": "test",
        "executionTime": "2s 329ms"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel

    When look for model "ApiCall" by following JSON and remember as "app":
      """
      {
        "paymentId": "test"
      }
      """
    Then print storage key "app"
    And stored value "app" should contain json:
      """
      {
        "__v": "*",
        "_id": "*",
        "businessId": "{{businessId}}",
        "paymentId": "test",
        "executionTime": 2329
      }
      """

  Scenario: migrate api call
    Given I use DB fixture "checkout-metrics/api-call/api-call"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.api-call.migrate",
      "payload": {
        "businessId": "{{businessId}}",
        "paymentId": "test",
        "executionTime": "5s 123ms"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel

    When look for model "ApiCall" by following JSON and remember as "app":
      """
      {
        "paymentId": "test"
      }
      """
    Then print storage key "app"
    And stored value "app" should contain json:
      """
      {
        "__v": "*",
        "_id": "*",
        "businessId": "{{businessId}}",
        "paymentId": "test",
        "executionTime": 5123
      }
      """

  Scenario: create action api call
    Given I use DB fixture "checkout-metrics/api-call/api-call"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.action-api-call.created",
      "payload": {
        "businessId": "{{businessId}}",
        "paymentId": "test",
        "executionTime": "4s 19ms"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel

    When look for model "ActionApiCall" by following JSON and remember as "app":
      """
      {
        "paymentId": "test"
      }
      """
    Then print storage key "app"
    And stored value "app" should contain json:
      """
      {
        "__v": "*",
        "_id": "*",
        "businessId": "{{businessId}}",
        "paymentId": "test",
        "executionTime": 4019
      }
      """

  Scenario: migrate action api call
    Given I use DB fixture "checkout-metrics/api-call/api-call"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.action-api-call.migrate",
      "payload": {
        "businessId": "{{businessId}}",
        "paymentId": "test",
        "executionTime": "0s 23ms"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel

    When look for model "ActionApiCall" by following JSON and remember as "app":
      """
      {
        "paymentId": "test"
      }
      """
    Then print storage key "app"
    And stored value "app" should contain json:
      """
      {
        "__v": "*",
        "_id": "*",
        "businessId": "{{businessId}}",
        "paymentId": "test",
        "executionTime": 23
      }
      """
