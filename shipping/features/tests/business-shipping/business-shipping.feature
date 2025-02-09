Feature: Business shipping
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "integrationName" following value:
      """
      "custom"
      """
    And I authenticate as a user with the following data:
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

  Scenario: Get business shipping
    Given I use DB fixture "business-shipping/business-shipping"
    When I send a GET request to "/api/business/{{businessId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "integrationSubscriptions": "*",
         "settings": "*",
         "_id": "{{businessId}}"
       }
      """

  Scenario: Get business shipping method
    Given I use DB fixture "business-shipping/business-shipping"
    When I send a GET request to "/api/business/{{businessId}}/methods"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [
          {
            "_id": "e87ea7d6-de6b-4d73-8226-83c41da3e600",
            "integration": "*",
            "rules": "*",
            "enabled": true,
            "installed": true
          }
        ]
      """

  Scenario: Get custom business shipping method
    Given I use DB fixture "business-shipping/business-shipping"
    When I send a GET request to "/api/business/{{businessId}}/custom"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "_id": "e87ea7d6-de6b-4d73-8226-83c41da3e600",
          "integration": "*",
          "rules": "*",
          "enabled": true,
          "installed": true
        }
      """

  Scenario: Get business shipping subscription by integration name
    Given I use DB fixture "business-shipping/business-shipping"
    When I send a GET request to "/api/business/{{businessId}}/subscription/{{integrationName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "_id": "e87ea7d6-de6b-4d73-8226-83c41da3e600",
          "integration": "*",
          "rules": "*",
          "enabled": true,
          "installed": true
        }
      """
