Feature: Connection API Sort Order

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
    Given I remember as "integrationIdOne" following value:
      """
      "bce8ef2c-e88c-4066-acb0-1154bb995efc"
      """
    Given I remember as "integrationNameOne" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "integrationIdTwo" following value:
      """
      "46dff89b-6190-4e55-bdc4-fa1888bda518"
      """
    Given I remember as "integrationNameTwo" following value:
      """
      "dhl"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "connectionIdOne" following value:
      """
      "4ca57652-6881-4b54-9c11-ce00c79fcb45"
      """
    Given I remember as "connectionIdTwo" following value:
      """
      "ce00c79f-6881-4b54-cb45-4ca576529c11"
      """
    Given I remember as "connectionIdThree" following value:
      """
      "76529c11-cb45-6881-4b54-4ca5ce00c79f"
      """

  Scenario: Sort Order Checkout Connections, Different integrations
    Given I use DB fixture "connection/checkout-connection/get-all/many-connections-different-integrations"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/connection/sort-order" with json:
      """
      [
        {
          "connectionId": "{{connectionIdTwo}}",
          "sortOrder": 1
        },
        {
          "connectionId": "{{connectionIdOne}}",
          "sortOrder": 2
        }
      ]
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{connectionIdTwo}}",
          "name": "Connection of {{integrationNameTwo}}",
          "integration": "{{integrationNameTwo}}"
        },
        {
          "_id": "{{connectionIdOne}}",
          "name": "Connection of {{integrationNameOne}}",
          "integration": "{{integrationNameOne}}"
        }
      ]
      """
    Then I look for model "Connection" with id "{{connectionIdTwo}}" and remember as "example_object"
    Then print storage key "example_object"

    Then model "Connection" with id "{{connectionIdTwo}}" should contain json:
      """
      {
        "_id": "{{connectionIdTwo}}",
        "options": {
          "sortOrder": 1
        }
      }
      """

Scenario: Not existing checkout
  Given I use DB fixture "connection/checkout-connection/get-all/many-connections-different-integrations"
  When I send a PATCH request to "/api/business/{{businessId}}/checkout/not-existing-checkout/connection/sort-order"
  Then print last response
  Then print database connection url
  And the response status code should be 404

Scenario: Wrong business permission
  Given I use DB fixture "connection/checkout-connection/get-all/many-connections-different-integrations"
  When I send a PATCH request to "/api/business/wrong-business/checkout/{{checkoutId}}/connection/sort-order"
  Then print last response
  Then print database connection url
  And the response status code should be 403

Scenario: Anonymous access permission
  Given I am not authenticated
  Given I use DB fixture "connection/checkout-connection/get-all/many-connections-different-integrations"
  When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/connection/sort-order"
  Then print last response
  Then print database connection url
  And the response status code should be 403
