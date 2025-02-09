Feature: Set subscription option endpoint

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

  Scenario: Set subscription options on installed in checkout
    Given I use DB fixture "checkout/checkout-integration-subscription/set-options/on-installed-in-checkout"
    When I send a PUT request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/options" with json:
      """
      {
        "option1": "value1"
      }
      """
    Then print last response
    Then the response status code should be 200
    Then model "CheckoutIntegrationSubscription" with id "{{checkoutSubscriptionId}}" should contain json:
      """
      {
        "options":{
          "option1": "value1"
        }
      }
      """

  Scenario: Set subscription options on not installed in checkout
    Given I use DB fixture "checkout/checkout-integration-subscription/set-options/on-not-installed-in-checkout"
    When I send a PUT request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/options" with json:
      """
      {
        "option1": "value1"
      }
      """
    Then print last response
    Then the response status code should be 200
    Then model "CheckoutIntegrationSubscription" with id "{{checkoutSubscriptionId}}" should contain json:
      """
      {
        "options":{
          "option1": "value1"
        }
      }
      """

  Scenario: Set subscription options on not installed in business
    Given I use DB fixture "checkout/checkout-integration-subscription/set-options/on-not-installed-in-business"
    When I send a PUT request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/options" with json:
      """
      {
        "option1": "value1"
      }
      """
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "error": "Not Found",
        "message": "Integration '{{integrationName}}' doesn't belong business '{{businessId}}'"
      }
      """

  Scenario: Set subscription options on installed in business and never installed in checkout
    Given I use DB fixture "checkout/checkout-integration-subscription/set-options/on-installed-in-business-and-never-installed-in-checkout"
    When I send a PUT request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/options" with json:
      """
      {
        "option1": "value1"
      }
      """
    Then print last response
    Then the response status code should be 200
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/options"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "option1": "value1"
      }
      """

  Scenario: Set subscription options, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout-integration-subscription/set-options/on-installed-in-checkout"
    When I send a PUT request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/integration/{{integrationName}}/options" with json:
      """
      {}
      """
    Then print last response
    Then the response status code should be 403
