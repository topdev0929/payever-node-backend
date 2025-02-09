Feature: Admin containers
  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    Given I remember as "containerName" following value:
      """
      "cucumber-test-container-2"
      """

  Scenario: Only admin role has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/admin/containers"
    Then response status code should be 403

  Scenario: create container
    When I send a POST request to "/api/admin/containers" with json:
      """
      {
        "name": "{{containerName}}"
      }
      """
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "name": "{{containerName}}",
        "etag": "*"
      }
      """

  Scenario: get container by name
    When I send a GET request to "/api/admin/containers/{{containerName}}"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "name": "{{containerName}}",
        "etag": "*"
      }
      """

  Scenario: list containers
    When I send a GET request to "/api/admin/containers"
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "entries": [
          {
            "name": "*"
          }
        ],
        "continuationToken": "*"
      }
      """

  Scenario: delete container
    When I send a DELETE request to "/api/admin/containers/existing-container"
    Then print last response
    Then the response status code should be 200
