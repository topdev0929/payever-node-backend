Feature: App registry bus messages
  Background:
    Given I remember as "businessId" following value:
      """
      "_id-of-business"
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "subscription-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "subscription-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Received subscriptions created method
    Given I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_billing_subscription_micro" message with json:
      """
      {
        "name": "app-registry.event.application.installed",
        "payload": {
          "businessId": "{{businessId}}",
          "code": "subscriptions"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_billing_subscription_micro" channel
    Then look for model "SubscriptionNetwork" by following JSON and remember as "subscriptionNetwork":
    """
    {
      "business": "{{businessId}}"
    }
    """
    Then print storage key "subscriptions"
    And model "SubscriptionNetwork" with id "{{subscriptionNetwork._id}}" should contain json:
    """
    {
      "_id": "{{subscriptionNetwork._id}}",
      "business": "{{businessId}}",
      "name": "test",
      "isDefault": true
    }
    """
     Then look for model "SubscriptionPlan" by following JSON and remember as "subscriptionPlan":
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then print storage key "subscriptionPlan"
    And model "SubscriptionPlan" with id "{{subscriptionPlan._id}}" should contain json:
    """
    {
      "_id": "{{subscriptionPlan._id}}",
      "businessId": "{{businessId}}",
      "name": "Start Plan"
    }
    """
