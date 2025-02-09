@integration-subscriptions
Feature: Integration subscription access check
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["category-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "count" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """

    And I remember as "business1" following value:
    """
    "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
    """
    And I authenticate as a user with the following data:
      """
      {
        "email": "service@payever.de",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{business1}}",
                "acls": [
                        {
                            "create": true,
                            "delete": false,
                            "microservice": "products",
                            "read": true,
                            "update": false
                        }
                ]
              }
            ]
          }
        ]
      }
      """

Scenario: get integrations by name, user with products create permission
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I send a GET request to "/api/business/{{business1}}/integration/Name_1"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": false,
      "name": "Name_1"
    }
    """