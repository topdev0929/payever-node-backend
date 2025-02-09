Feature: Default steps
  Background:
    Given I remember as "sectionName" following value:
      """
      "shop"
      """

  Scenario: Get default steps list
    Given I use DB fixture "stepper/get-default-steps-list"
    When I send a GET request to "/api/stepper/steps/{{sectionName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "11111111-1111-1111-1111-111111111111",
          "action": "step_1",
          "allowSkip": false,
          "order": 1,
          "section": "shop",
          "title": "Step 1"
        },
        {
          "_id": "22222222-2222-2222-2222-222222222222",
          "action": "step_2",
          "allowSkip": true,
          "order": 2,
          "section": "shop",
          "title": "Step 2"
        }
      ]
      """