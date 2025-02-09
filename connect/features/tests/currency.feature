Feature: Folder features
  Background:
    Given I use DB fixture "currency"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "anonymous",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Get currencies
    When I send a GET request to "/api/currency"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [{
        "code": "EUR",
        "id": "EUR",
        "name": "EUR",
        "rate": 5,
        "symbol": "EUR"
      }]
      """

  Scenario: Get currency by code
    When I send a GET request to "/api/currency/EUR/code"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "code": "EUR",
        "id": "EUR",
        "name": "EUR",
        "rate": 5,
        "symbol": "EUR"
      }
      """
