Feature: IntegrationSubscriptionBusMessageController messages process

  Scenario: Integration installed
    Given I use DB fixture "rabbit-mq/integration-subscription-bus-message/business-not-enabled-subscription"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "connect.event.third-party.enabled",
      "payload":{
        "name":"testName",
        "category":"testCategory",
        "businessId":"d903d4c3-c447-4aab-a8c7-c7f184a8e77f"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "IntegrationSubscription" with id "testName" should contain json:
    """
    {
        "_id": "testName",
        "installed": true,
        "integration": "testName"
    }
    """

  Scenario: Integration uninstalled
    Given I use DB fixture "rabbit-mq/integration-subscription-bus-message/integration-uninstalled"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "connect.event.third-party.disabled",
      "payload":{
        "name":"testName",
        "category":"testCategory",
        "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "IntegrationSubscription" with id "testName" should contain json:
    """
    {
        "_id": "testName",
        "installed": false,
        "enabled": true,
        "integration": "testName"
    }
    """

  Scenario: 3d party auth disabled
    Given I use DB fixture "rabbit-mq/integration-subscription-bus-message/3d-party-auth-disabled"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "third-party.event.third-party.auth.disabled",
      "payload":{
        "name":"testName",
        "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel

    Then model "IntegrationSubscription" with id "testName" should contain json:
    """
    {
        "_id": "testName",
        "installed": true,
        "enabled": false,
        "integration": "testName"
    }
    """


