Feature: Should return location if it is exists
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
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

  Scenario: Get all location by business, anonymous
    Given I am not authenticated
    And I use DB fixture "location/get-location-by-business"
    When I send a GET request to "/api/business/{{businessId}}/location"
    Then print last response
    And the response status code should be 403

  Scenario: Get all location by business
    Given I use DB fixture "location/get-location-by-business"
    When I send a GET request to "/api/business/{{businessId}}/location"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
     [
       {
         "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
         "city": "city_1",
         "countryCode": "country_1"
       },
       {
         "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
         "city": "city_2",
         "countryCode": "country_2"
       },
       {
         "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
         "city": "city_3",
         "countryCode": "country_3"
       }
     ]
    """