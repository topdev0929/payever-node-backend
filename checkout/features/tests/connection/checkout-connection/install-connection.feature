Feature: Connection API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
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
    Given I remember as "integrationId" following value:
      """
      "bce8ef2c-e88c-4066-acb0-1154bb995efc"
      """
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "connectionId" following value:
      """
      "4ca57652-6881-4b54-9c11-ce00c79fcb45"
      """

  Scenario: Install existing connection to checkout
    Given I use DB fixture "connection/checkout-connection/install-connection/existing-not-installed-connection"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/connection/{{connectionId}}/install"
    Then print last response
    Then print database connection url
    And the response status code should be 200
    Then model "Checkout" with id "{{checkoutId}}" should contain json:
      """
      {
        "_id": "{{checkoutId}}",
        "connections": ["{{connectionId}}"]
      }
      """

  Scenario: Install existing connection to checkout
    Given I use DB fixture "connection/checkout-connection/install-connection/existing-installed-connection"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/connection/{{connectionId}}/install"
    Then print last response
    Then print database connection url
    And the response status code should be 200
    Then model "Checkout" with id "{{checkoutId}}" should contain json:
      """
      {
        "_id": "{{checkoutId}}",
        "connections": ["{{connectionId}}"]
      }
      """

  Scenario: Install connection for integration not belonging to business, prohibited
    Given I use DB fixture "connection/checkout-connection/install-connection/integration-does-not-belong-to-business"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/connection/{{connectionId}}/install"
    Then print last response
    Then print database connection url
    And the response status code should be 404

  Scenario: Not existing checkout
    Given I use DB fixture "connection/checkout-connection/install-connection/existing-not-installed-connection"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/not-existing-checkout/connection/{{connectionId}}/install"
    Then print last response
    Then print database connection url
    And the response status code should be 404

  Scenario: Not existing connection
    Given I use DB fixture "connection/checkout-connection/install-connection/existing-not-installed-connection"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/connection/not-existing-connection/install"
    Then print last response
    Then print database connection url
    And the response status code should be 404

  Scenario: Wrong business permission
    Given I use DB fixture "connection/checkout-connection/install-connection/existing-not-installed-connection"
    When I send a PATCH request to "/api/business/wrong-business/checkout/{{checkoutId}}/connection/{{connectionId}}/install"
    Then print last response
    Then print database connection url
    And the response status code should be 403

  Scenario: Anonymous access permission
    Given I am not authenticated
    Given I use DB fixture "connection/checkout-connection/install-connection/existing-not-installed-connection"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/connection/{{connectionId}}/install"
    Then print last response
    Then print database connection url
    And the response status code should be 403
