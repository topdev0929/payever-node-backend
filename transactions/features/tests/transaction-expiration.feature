@business-transactions
Feature: transaction-retention-setting

  Background:
    Given I remember as "businessId" following value:
      """
      "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
      """
    Given I authenticate as a user with the following data:
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
  Scenario: get transaction-retention-setting 404
    When I send a GET request to "/api/business/{{businessId}}/transaction-retention-setting"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "message": "businessId by id {{businessId}} not found"
      }
      """
  Scenario: Set transaction-retention-setting
    When I send a PATCH request to "/api/business/{{businessId}}/transaction-retention-setting" with json:
      """
      {
        "failedTransactionsRetentionPeriod": "P1Y",
        "transactionsRetentionPeriod": "P5Y"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "failedTransactionsRetentionPeriod": "P1Y",
        "transactionsRetentionPeriod": "P5Y"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/transaction-retention-setting"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "failedTransactionsRetentionPeriod": "P1Y",
        "transactionsRetentionPeriod": "P5Y"
      }
      """
  Scenario: transaction-retention-setting wrong value
    When I send a PATCH request to "/api/business/{{businessId}}/transaction-retention-setting" with json:
      """
      {
        "failedTransactionsRetentionPeriod": "wrong_value",
        "transactionsRetentionPeriod": "P6Y"
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "message": [
          "'(P6Y)' should be a valid duration between 2 days, and 5 years",
          "'(wrong_value)' should be a valid duration between 2 days, and 5 years"
        ]
      }
      """