Feature: Install subscription to checkout endpoint

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

  Scenario: Install integration, installed and enabled in business
    Given I use DB fixture "checkout/checkout-integration-subscription/install/on-installed-and-enabled-in-business"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/install"
    Then print last response
    Then the response status code should be 200
    Then model "CheckoutIntegrationSubscription" with id "b0a201a7-b01f-40c4-bfd0-339cfb8d0675" should contain json:
      """
      {
        "installed": true,
        "integration": "{{integrationId}}"
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"checkout.event.integration.enabled",
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

  Scenario: Install integration, installed and not enabled in business
    Given I use DB fixture "checkout/checkout-integration-subscription/install/on-installed-and-not-enabled-in-business"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/install"
    Then print last response
    Then the response status code should be 409

  Scenario: Install integration, not installed and not enabled in business
    Given I use DB fixture "checkout/checkout-integration-subscription/install/on-not-installed-and-not-enabled-in-business"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/install"
    Then print last response
    Then the response status code should be 409

  Scenario: Install integration, installed and enabled in business and installed in checkout
    Given I use DB fixture "checkout/checkout-integration-subscription/install/on-installed-and-enabled-in-business-and-installed-in-checkout"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/install"
    Then print last response
    Then the response status code should be 200
    Then model "CheckoutIntegrationSubscription" with id "b0a201a7-b01f-40c4-bfd0-339cfb8d0675" should contain json:
      """
      {
        "installed": true,
        "integration": "{{integrationId}}"
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"checkout.event.integration.enabled",
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

  Scenario: Install integration, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout-integration-subscription/install/on-installed-and-enabled-in-business"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/install"
    Then print last response
    Then the response status code should be 403
