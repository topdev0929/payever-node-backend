Feature: Business shipping zones
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "zoneId" following value:
      """
      "8bbdb36a-8850-442f-8cb2-a59cd59dfd57"
      """
    Given I remember as "integrationId" following value:
      """
      "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
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

  Scenario: Create business shipping zone
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/business/{{businessId}}/shipping-zone" with json:
      """
        {
          "_id": "test",
          "countryCodes": ["CO"],
          "deliveryTimeDays": 10,
          "rates": ["{{integrationId}}"]
        }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "_id": "test",
          "countryCodes": ["CO"],
          "deliveryTimeDays": 10,
          "rates": ["{{integrationId}}"]
        }
      """

  Scenario: Get business shipping zone by id
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/business/{{businessId}}/shipping-zone/{{zoneId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "_id": "{{zoneId}}",
          "countryCodes": ["CO"],
          "deliveryTimeDays": 10,
          "rates": ["{{integrationId}}"]
        }
      """

  Scenario: Update business shipping zone by id
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/business/{{businessId}}/shipping-zone/{{zoneId}}" with json:
      """
        {
          "deliveryTimeDays": 20
        }
      """
    Then print last response
    And the response status code should be 200

  Scenario: Delete business shipping zone by id
    Given I use DB fixture "shipping/shipping"
    When I send a DELETE request to "/api/business/{{businessId}}/shipping-zone/{{zoneId}}"
    Then print last response
    And the response status code should be 200
