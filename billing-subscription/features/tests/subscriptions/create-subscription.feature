Feature: Create subscription
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "transactionId" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "planId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I remember as "userId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "remoteSubscriptionId" following value:
      """
        "some_identifier"
      """
    Given I remember as "reference" following value:
      """
        "ab03078f-8eb1-40d5-b5e1-036f66f0c50a"
      """


  Scenario: Received transaction with subscriptions
    Given I use DB fixture "subscriptions/create-subscription"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "billing-subscriptions",
          {
            "userId": "{{userId}}",
            "plan": {
              "_id": "{{planId}}",
              "businessId": "{{businessId}}"
            },
            "transactionUuid": "{{transactionId}}"
          }
         ],
        "result": {}
      }
      """
    When I publish in RabbitMQ channel "async_events_billing_subscription_micro" message with json:
      """
      {
        "name": "checkout.event.payment.created",
        "payload": {
          "payment": {
            "user_uuid": "{{userId}}",
            "uuid": "{{transactionId}}",
            "business": {
               "uuid": "{{businessId}}"
            },
            "customer_name": "Customer name",
            "customer_email": "Customer email",
            "reference": "{{reference}}",
            "items": [
              {
                "identifier": "some_item_uuid",
                "extra_data": {
                  "subscriptionPlan": "{{planId}}",
                  "subscriptionId": "{{remoteSubscriptionId}}"
                }
              }
            ]
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_billing_subscription_micro" channel
    And I look for model "Subscription" by following JSON and remember as "subscription":
      """
      {
        "plan": "{{planId}}",
        "transactionUuid": "{{transactionId}}"
      }
      """
    And model "Subscription" with id "{{subscription._id}}" should contain json:
      """
      {
        "remoteSubscriptionId": "{{remoteSubscriptionId}}"
      }
      """

  Scenario: Received transaction with no subscriptions
    Given I use DB fixture "subscriptions/create-subscription"
    When I publish in RabbitMQ channel "async_events_billing_subscription_micro" message with json:
      """
      {
        "name": "checkout.event.payment.created",
        "payload": {
          "payment": {
            "uuid": "{{transactionId}}",
            "business": {
               "uuid": "{{businessId}}"
            },
            "items": [
              {
                "identifier": "some_item_uuid"
              }
            ]
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_billing_subscription_micro" channel
    And model "Subscription" found by following JSON should not exist:
      """
      {
        "transactionUuid": "{{transactionId}}"
      }
      """
