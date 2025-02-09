Feature: Business shipping boxes
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "originId" following value:
      """
      "0acf9a70-db1d-4af9-8be3-4d97d671cf14"
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

  Scenario: Create business shipping origin
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/business/{{businessId}}/shipping-origin" with json:
      """
        {
          "_id": "test",
          "isDefault": true,
          "streetName": "Street name",
          "streetNumber": "111",
          "city": "city",
          "zipCode": "11111",
          "countryCode": "CO"
        }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "_id": "test",
          "isDefault": true,
          "streetName": "Street name",
          "streetNumber": "111",
          "city": "city",
          "zipCode": "11111",
          "countryCode": "CO"
        }
      """

  Scenario: Get business shipping origin by id
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/business/{{businessId}}/shipping-origin/{{originId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "_id": "{{originId}}",
          "isDefault": true,
          "streetName": "Street name",
          "streetNumber": "111",
          "city": "city",
          "zipCode": "11111",
          "countryCode": "CO"
        }
      """

  Scenario: Update business shipping origin by id
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/business/{{businessId}}/shipping-origin/{{originId}}" with json:
      """
        {
          "isDefault": false
        }
      """
    Then print last response
    And the response status code should be 200

  Scenario: Delete business shipping origin by id
    Given I use DB fixture "shipping/shipping"
    When I send a DELETE request to "/api/business/{{businessId}}/shipping-origin/{{originId}}"
    Then print last response
    And the response status code should be 200
