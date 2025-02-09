Feature: Uninstall subscription from checkout endpoint

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

  Scenario: Uninstall installed in checkout subscription
    Given I use DB fixture "checkout/checkout-integration-subscription/uninstall/on-installed-in-checkout"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/uninstall"
    Then print last response
    Then the response status code should be 200
    Then model "CheckoutIntegrationSubscription" with id "{{checkoutSubscriptionId}}" should contain json:
      """
      {
        "installed": false,
        "integration": "{{integrationId}}"
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"checkout.event.integration.disabled",
          "payload":{
            "checkout":{
              "settings": "*",
              "default":true,
              "_id":"{{checkoutId}}",
              "businessId":"{{businessId}}",
              "name":"*",
              "sections":"*",
              "createdAt":"*",
              "updatedAt":"*",
              "__v":0
            },
            "integration":{
              "_id":"{{integrationId}}",
              "category":"payments",
              "displayOptions":"*",
              "name":"santander_factoring_de",
              "settingsOptions":"*",
              "createdAt":"*",
              "updatedAt":"*",
              "__v":0
            }
          }
        }
      ]
      """

  Scenario: Uninstall not installed in checkout subscription
    Given I use DB fixture "checkout/checkout-integration-subscription/uninstall/on-not-installed-in-checkout"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/uninstall"
    Then print last response
    Then the response status code should be 200
    Then model "CheckoutIntegrationSubscription" with id "{{checkoutSubscriptionId}}" should contain json:
      """
      {
        "installed": false,
        "integration": "{{integrationId}}"
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"checkout.event.integration.disabled",
          "payload":{
            "checkout":{
              "settings": "*",
              "default":true,
              "_id":"{{checkoutId}}",
              "businessId":"{{businessId}}",
              "name":"*",
              "sections":"*",
              "createdAt":"*",
              "updatedAt":"*",
              "__v":0
            },
            "integration":{
              "_id":"{{integrationId}}",
              "category":"payments",
              "displayOptions":"*",
              "name":"santander_factoring_de",
              "settingsOptions":"*",
              "createdAt":"*",
              "updatedAt":"*",
              "__v":0
            }
          }
        }
      ]
      """

  Scenario: Uninstall installed, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout-integration-subscription/uninstall/on-installed-in-checkout"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/uninstall"
    Then print last response
    Then the response status code should be 403
