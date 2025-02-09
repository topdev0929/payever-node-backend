Feature: Should update location
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "locationId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
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

  Scenario: Update location
    And I use DB fixture "location/update-location"
    When I send a PATCH request to "/api/business/{{businessId}}/location/{{locationId}}" with json:
      """
      {
          "countryCode": "+1"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
     """
      {
          "_id": "{{locationId}}",
          "countryCode": "+1"
      }
      """