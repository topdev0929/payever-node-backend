Feature: Organization Admin
  Background:
    Given I use DB fixture "organizations"
    Given I remember as "organizationId" following value:
      """
      "6391e66e-2416-4e1f-b09c-88e57bb019c0"
      """
    And I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
          {
            "name": "user",
            "permissions": []
          },
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """

  Scenario: Get organizations
    When I send a GET request to "/api/admin/organizations"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{organizationId}}",
          "name": "Adyen"
        }
      ]
      """

  Scenario: Create organization
    When I send a POST request to "/api/admin/organizations" with json:
      """
      {
        "name": "Adyen"
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "Adyen",
        "clientId": "*",
        "secret": "*",
        "id": "*"
      }
      """

  Scenario: create new secret for organization
    When I send a POST request to "/api/admin/organizations/{{organizationId}}/new-secret"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "Adyen",
        "clientId": "*",
        "secret": "*",
        "id": "*"
      }
      """

  Scenario: Get organization
    When I send a GET request to "/api/admin/organizations/{{organizationId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{organizationId}}",
        "name": "*"
      }
      """

  Scenario: Update organization
    When I send a PATCH request to "/api/admin/organizations/{{organizationId}}" with json:
      """
      {
        "name": "New Name"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{organizationId}}",
        "name": "New Name"
      }
      """

  Scenario: Delete organization
    When I send a DELETE request to "/api/admin/organizations/{{organizationId}}"
    Then print last response
    And the response status code should be 200
