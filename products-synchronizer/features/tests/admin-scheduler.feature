Feature: Admin scheduler
  Background: constants
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "admin@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    Given I remember as "SYNCHRONIZATION_ID_1" following value:
      """
      "synchronization-1"
      """
    Given I remember as "SYNCHRONIZATION_ID_2" following value:
      """
      "synchronization-2"
      """
    Given I remember as "SYNCHRONIZATION_ID_3" following value:
      """
      "synchronization-3"
      """

  Scenario: Only admin users have access to admin endpoint
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
    When I send a PUT request to "/api/admin/scheduler/trigger-synchronizations"
    Then print last response
    Then response status code should be 403
    When I send a PUT request to "/api/admin/scheduler/process-synchronization/{{SYNCHRONIZATION_ID_1}}"
    Then print last response
    Then response status code should be 403

  Scenario: Trigger synchronizations
    Given I use DB fixture "scheduler/admin-scheduler"
    When I send a PUT request to "/api/admin/scheduler/trigger-synchronizations"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      2
      """

  Scenario: Get awaiting integrations
    Given I use DB fixture "scheduler/admin-scheduler"
    When I send a GET request to "/api/admin/scheduler/awaiting-synchronization"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "synchronization-1"
        },
        {
          "_id": "synchronization-2"
        }
      ]
      """
    And the response should not contain json:
      """
      [
        {
          "_id": "synchronization-3"
        },
        {
          "_id": "synchronization-4"
        }
      ]
      """
