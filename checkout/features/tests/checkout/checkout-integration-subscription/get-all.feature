Feature: Get subscriptions endpoint

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "integrationId" following value:
      """
      "bce8ef2c-e88c-4066-acb0-1154bb995efc"
      """
    Given I remember as "checkoutSubscriptionId" following value:
      """
      "b0a201a7-b01f-40c4-bfd0-339cfb8d0675"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Get all subscriptions existing
    Given I use DB fixture "checkout/checkout-integration-subscription/get-all/existing"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        "dhl",
        "santander_factoring_de",
        "santander_installment",
        "shipping",
        "ups"
      ]
      """

  Scenario: Get all subscriptions, not installed anything
    Given I use DB fixture "checkout/checkout-integration-subscription/get-all/not-installed-anything"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      []
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"notifications.event.notification.notify",
          "payload":{
            "kind":"business",
            "entity":"{{checkoutId}}",
            "app":"checkout",
            "message":"notification.checkout.payment.addOption",
            "data":{

            }
          }
        },
        {
          "name":"notifications.event.notification.notify",
          "payload":{
            "kind":"business",
            "entity":"{{checkoutId}}",
            "app":"choose-payment-aware",
            "message":"notification.checkout.payment.addOption",
            "data":{

            }
          }
        }
      ]
      """

  Scenario: Get all subscriptions, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout-integration-subscription/get-all/existing"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration"
    Then print last response
    Then the response status code should be 403
