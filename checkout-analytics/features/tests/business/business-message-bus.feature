Feature: Payment flow bus message handling
  Background:
    Given I remember as "businessId" following value:
      """
      "c4f3df1c-2167-4e1e-b85f-d065570f4494"
      """

  Scenario: Business created event
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "users.event.business.created",
      "payload": {
        "_id": "{{businessId}}",
        "name": "Test",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then I look for model "Business" by following JSON and remember as "businessData":
    """
    {
      "_id": "{{businessId}}"
    }
    """
    And stored value "businessData" should contain json:
    """
    {
      "_id": "{{businessId}}",
      "name": "Test",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Business updated event
    Given I use DB fixture "business/business"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "users.event.business.updated",
      "payload": {
        "_id": "{{businessId}}",
        "name": "Test",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
    """
    {
      "_id": "{{businessId}}",
      "name": "Test",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """
    And I look for model "Business" by following JSON and remember as "businessData":
    """
    {
      "_id": "{{businessId}}"
    }
    """
    And stored value "businessData" should contain json:
    """
    {
      "_id": "{{businessId}}",
      "name": "Test",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Business removed event
    Given I use DB fixture "business/business"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "users.event.business.removed",
      "payload": {
        "_id": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel

  Scenario: Business export event
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "users.event.business.export",
      "payload": {
        "_id": "{{businessId}}",
        "name": "Test",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then I look for model "Business" by following JSON and remember as "businessData":
    """
    {
      "_id": "{{businessId}}"
    }
    """
    And stored value "businessData" should contain json:
    """
    {
      "_id": "{{businessId}}",
      "name": "Test",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """
