Feature: Integration API
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

  Scenario: Get one payment integration
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I use DB fixture "integration/integration/find-by-name/many-payments"
    When I send a GET request to "/api/integration/{{integrationName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id":"bce8ef2c-e88c-4066-acb0-1154bb995efc",
        "category":"payments",
        "displayOptions":{
          "_id":"*",
          "icon":"#icon-payment-option-santander",
          "title":"integrations.payments.{{integrationName}}.title"
        },
        "name":"{{integrationName}}",
        "settingsOptions":{
          "_id":"*",
          "source":"source"
        },
        "createdAt":"*",
        "updatedAt":"*"
      }
      """

  Scenario: Get integrations without permission
    Given I am not authenticated
    Given I use DB fixture "integration/integration/find-by-name/many-payments"
    When I send a GET request to "/api/integration/{{integrationName}}"
    Then print last response
    And the response status code should be 403
