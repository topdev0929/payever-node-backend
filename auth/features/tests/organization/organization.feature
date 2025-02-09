Feature: Organization
  Background:
    Given I use DB fixture "organizations"
    Given I remember as "clientId" following value:
      """
      "74b58859-3a62-4b63-83d6-cc492b2c8e29"
      """
    Given I remember as "clientSecret" following value:
      """
      "09d1fdca-f692-4609-bc2d-b3003a24c30a"
      """

  Scenario: Generate token
    When I send a POST request to "/api/organizations/token" with json:
      """
      {
        "clientId": "{{clientId}}",
        "clientSecret": "{{clientSecret}}"
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*"
      }
      """

  Scenario: Generate token by scopes
    When I send a POST request to "/api/organizations/token" with json:
      """
      {
        "clientId": "{{clientId}}",
        "clientSecret": "{{clientSecret}}",
        "scopes": ["commerceos", "connect"]
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*"
      }
      """


  Scenario: Try to generate token with invalid scopes
    When I send a POST request to "/api/organizations/token" with json:
      """
      {
        "clientId": "{{clientId}}",
        "clientSecret": "{{clientSecret}}",
        "scopes": ["test"]
      }
      """
    And print last response
    Then the response status code should be 400
