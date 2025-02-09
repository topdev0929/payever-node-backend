Feature: Custom sync interval
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


  Scenario: Trigger synchronizations
    Given I use DB fixture "scheduler/custom-sync-interval"
    When I send a PUT request to "/api/admin/scheduler/trigger-synchronizations"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      2
      """

    When I send a PUT request to "/api/admin/scheduler/trigger-synchronizations"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      0
      """

  Scenario: Trigger synchronizations 2
    Given I use DB fixture "scheduler/custom-sync-interval"
    When I send a PUT request to "/api/admin/scheduler/process-synchronization/{{SYNCHRONIZATION_ID_1}}"
    When I send a PUT request to "/api/admin/scheduler/process-synchronization/{{SYNCHRONIZATION_ID_2}}"
    When I send a PUT request to "/api/admin/scheduler/process-synchronization/{{SYNCHRONIZATION_ID_3}}"
    When I send a PUT request to "/api/admin/scheduler/trigger-synchronizations"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      0
      """
