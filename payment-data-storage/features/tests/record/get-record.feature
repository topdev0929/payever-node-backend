Feature: Storage API, object notation
  Background:
    Given I remember as "recordId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """

  Scenario: Get existing record
    Given I use DB fixture "record/existing-record"
    When I send a GET request to "/api/storage/{{recordId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "existingProperty1": 1,
        "existingProperty2": "value2",
        "existingProperty3": {
          "existingProperty4": true
        }
      }
      """

  Scenario: Put, not authenticated
    Given I am not authenticated
    When I send a GET request to "/api/storage/{{recordId}}"
    Then print last response
    Then the response status code should be 403
