Feature: BusinessBusMessageController messages check

  Scenario: Business created
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "users.rpc.business.created",
      "payload":{
        "name":"testName",
        "_id":"e903d4c3-c447-4aab-a8c7-c7f184a8e77f"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "e903d4c3-c447-4aab-a8c7-c7f184a8e77f" should contain json:
    """
    {
        "name":"testName"
    }
    """

  Scenario: Business removed
    Given I use DB fixture "rabbit-mq/business-bus-message/business-removed"
    Given I remember as "businessId" following value:
      """
      "businessToDelete"
      """

    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "users.event.business.removed",
      "payload":{
        "_id":"{{businessId}}"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" found by following JSON should not exist:
    """
      {
        "_id": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      }
    """

  Scenario: Business updated
    Given I use DB fixture "rabbit-mq/business-bus-message/business-updated"
    Given I remember as "businessId" following value:
      """
      "updatedId"
      """

    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "users.event.business.updated",
      "payload":{
        "_id":"{{businessId}}",
        "name":"updatedName",
        "currency":"EUR"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
    """
    {
        "name":"updatedName",
        "currency":"EUR"
    }
    """
