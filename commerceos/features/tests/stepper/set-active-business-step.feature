Feature: Business steps. Set Active
  Background:
    Given I remember as "sectionName" following value:
      """
      "shop"
      """
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "currentActiveStep" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "stepId" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    Given I remember as "anotherSectionStepId" following value:
      """
      "33333333-3333-3333-3333-333333333333"
      """
    Given I remember as "anotherBusinessStepId" following value:
      """
      "44444444-4444-4444-4444-444444444444"
      """
    Given I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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

  Scenario: Set active step for business
    Given I use DB fixture "stepper/set-active-business-step"
    When I send a PUT request to "/api/stepper/steps/business/{{businessId}}/{{stepId}}"
    Then print last response
    And the response status code should be 200
    And model "BusinessStep" with id "{{currentActiveStep}}" should contain json:
    """
      {
        "isActive": false
      }
    """
    And model "BusinessStep" with id "{{stepId}}" should contain json:
    """
      {
        "isActive": true
      }
    """
    And model "BusinessStep" with id "{{anotherSectionStepId}}" should contain json:
    """
      {
        "isActive": true
      }
    """
    And model "BusinessStep" with id "{{anotherBusinessStepId}}" should contain json:
    """
      {
        "isActive": true
      }
    """


  Scenario: Set active step for another business
    Given I use DB fixture "stepper/set-active-business-step"
    When I send a PUT request to "/api/stepper/steps/business/{{anotherBusinessId}}/{{anotherBusinessStepId}}"
    Then print last response
    And the response status code should be 403

  Scenario: Set active step for valid business at route, but wrong stepId
    Given I use DB fixture "stepper/set-active-business-step"
    When I send a PUT request to "/api/stepper/steps/business/{{businessId}}/{{anotherBusinessStepId}}"
    Then print last response
    And the response status code should be 403
