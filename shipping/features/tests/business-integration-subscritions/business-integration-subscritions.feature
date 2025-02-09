Feature: Business integration subscriptions
  Background:
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
    Given I remember as "ruleId" following value:
      """
      "a17913e9-e737-4839-880f-a3ae4df9b081"
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

  Scenario: Business integration subscriptions switch-off
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    When I send a PUT request to "/api/business/{{businessId}}/integration-subscriptions/{{subscriptionId}}/switch-off"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "integrationSubscriptions": "*",
         "settings": "*",
         "_id": "{{businessId}}"
       }
      """

  Scenario: Business integration subscriptions switch-on
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    When I send a PUT request to "/api/business/{{businessId}}/integration-subscriptions/{{subscriptionId}}/switch-on"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "integrationSubscriptions": "*",
         "settings": "*",
         "_id": "{{businessId}}"
       }
      """

  Scenario: Get business integration rules
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    When I send a GET request to "/api/business/{{businessId}}/integration-subscriptions/{{subscriptionId}}/rules"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [{
          "isActive": true,
          "_id": "{{ruleId}}",
          "rateRanges": [],
          "weightRanges": []
        }]
      """

  Scenario: Add business integration rules
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    When I send a POST request to "/api/business/{{businessId}}/integration-subscriptions/{{subscriptionId}}/rule"
    Then print last response
    And the response status code should be 201

  Scenario: Update business integration rules
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    When I send a PUT request to "/api/business/{{businessId}}/integration-subscriptions/{{subscriptionId}}/rule/{{ruleId}}" with json:
      """
        {
          "isActive": false
        }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "isActive": false,
          "_id": "{{ruleId}}",
          "rateRanges": [],
          "weightRanges": []
        }
      """

  Scenario: Delete business integration rules
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    When I send a DELETE request to "/api/business/{{businessId}}/integration-subscriptions/{{subscriptionId}}/rule/{{ruleId}}"
    Then print last response
    And the response status code should be 200
