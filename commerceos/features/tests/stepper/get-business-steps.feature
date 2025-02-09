Feature: Business steps
  Background:
    Given I remember as "sectionName" following value:
      """
      "shop"
      """
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
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

  Scenario: Get business steps list
    Given I use DB fixture "stepper/get-business-steps-list"
    When I send a GET request to "/api/stepper/steps/business/{{businessId}}/{{sectionName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "businessId": "{{businessId}}",
          "isActive": false,
          "section": "shop",
          "step": "*"
        },
        {
          "businessId": "{{businessId}}",
          "isActive": false,
          "section": "shop",
          "step": "*"
        }
      ]
      """
    And response should not contain json:
      """
      [
        {
          "businessId": "{{anotherBusinessId}}"
        }
      ]
      """
    And response should not contain json:
      """
      [
        {
          "section": "shipping"
        }
      ]
      """

  Scenario: Get business steps list for another business
    Given I use DB fixture "stepper/get-business-steps-list"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{anotherBusinessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/stepper/steps/business/{{businessId}}/{{sectionName}}"
    Then print last response
    And the response status code should be 403

  Scenario: Get business steps list anonymous
    Given I use DB fixture "stepper/get-business-steps-list"
    And I am not authenticated
    When I send a GET request to "/api/stepper/steps/business/{{businessId}}/{{sectionName}}"
    Then print last response
    And the response status code should be 403
