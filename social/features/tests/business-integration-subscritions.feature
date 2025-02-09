Feature: Business integration subscriptions
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["post-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "integrationName" following value:
      """
      "custom"
      """
    Given I remember as "subscriptionId" following value:
      """
      "e87ea7d6-de6b-4d73-8226-83c41da3e600"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
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

  Scenario: Get business shipping
    Given I use DB fixture "/business-integration-subscriptions"
    When I send a GET request to "/business/{{businessId}}/integration-subscriptions"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "integrationSubscriptions": "*",
         "_id": "{{businessId}}"
       }
      """

  Scenario: Business integration subscriptions switch-off
    Given I use DB fixture "/business-integration-subscriptions"
    When I send a PUT request to "/business/{{businessId}}/integration-subscriptions/{{subscriptionId}}/switch-off"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "integrationSubscriptions": [
             {
               "_id": "*",
               "enabled": false
             }
           ],
         "_id": "{{businessId}}"
       }
      """

  Scenario: Business integration subscriptions switch-on
    Given I use DB fixture "/business-integration-subscriptions"
    When I send a PUT request to "/business/{{businessId}}/integration-subscriptions/{{subscriptionId}}/switch-on"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "integrationSubscriptions": [
             {
               "_id": "*",
               "enabled": true
             }
           ],
         "_id": "{{businessId}}"
       }
      """
