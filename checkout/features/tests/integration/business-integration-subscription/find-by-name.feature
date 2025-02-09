Feature: Integration API
  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
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

  Scenario: Get one payment integration subscription
    Given I use DB fixture "integration/business-integration-subscription/find-by-name/many-payments"
    When I send a GET request to "/api/business/{{businessId}}/integration/{{integrationName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "enabled": true,
        "installed": true,
        "name": "{{integrationName}}"
      }
      """

  Scenario: Get one payment integration subscription, not existing
    Given I use DB fixture "integration/business-integration-subscription/find-by-name/not-existing"
    When I send a GET request to "/api/business/{{businessId}}/integration/{{integrationName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "enabled": false,
        "installed": false,
        "name": "{{integrationName}}"
      }
      """

  Scenario: Get integrations without permission
    Given I am not authenticated
    Given I use DB fixture "integration/business-integration-subscription/find-by-name/many-payments"
    When I send a GET request to "/api/business/{{businessId}}/integration/{{integrationName}}"
    Then print last response
    And the response status code should be 403
