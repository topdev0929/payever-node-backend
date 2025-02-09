Feature: Integration API
  Background:
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "integrationCategory" following value:
      """
      "payments"
      """
    Given I remember as "integrationTitle" following value:
      """
      "integrations.payments.santander_factoring_de.title"
      """
    Given I remember as "integrationIcon" following value:
      """
      "#icon-payment-option-santander"
      """
    Given I remember as "integrationOrder" following value:
      """
      "0"
      """

  Scenario: Create new integration with admin permission
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    When I send a POST request to "/api/integration" with json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """
    Then print last response
    And the response status code should be 201
    Then I look for model "Integration" by following JSON and remember as "foundIntegration":
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}"
      }
      """
    And stored value "foundIntegration" should contain json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """

  Scenario: Create new integration with admin permission on existing name
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    Given I use DB fixture "integration/integration/create/existing-payment"
    When I send a POST request to "/api/integration" with json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """
    Then print last response
    And the response status code should be 409

  Scenario: Create new integration with merchant permission, forbidden
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": []
          }
        ]
      }
      """
    Given I use DB fixture "integration/integration/find-all/many"
    When I send a POST request to "/api/integration" with json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Create new integration with anonymous permission, forbidden
    Given I am not authenticated
    Given I use DB fixture "integration/integration/find-all/many"
    When I send a POST request to "/api/integration" with json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """
    Then print last response
    And the response status code should be 403
