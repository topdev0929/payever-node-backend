Feature: Should create location
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
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

  Scenario: Creating new location, not authorized
    Given I am not authenticated
    When I send a POST request to "/api/business/{{businessId}}/location" with json:
      """
      {
        "businessId": "{{businessId}}",
        "city": "city",
        "countryCode": "+91",
        "name": "name",
        "stateProvinceCode": "stateProvinceCode",
        "streetName": "streetName",
        "streetNumber": "streetNumber",
        "zipCode": "zipCode"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Creating new location
    Given I use DB fixture "location/create-location"
    When I send a POST request to "/api/business/{{businessId}}/location" with json:
      """
      {
        "city": "city",
        "countryCode": "+91",
        "name": "name",
        "stateProvinceCode": "stateProvinceCode",
        "streetName": "streetName",
        "streetNumber": "streetNumber",
        "zipCode": "zipCode"
      }
      """
    Then print last response
    And the response status code should be 201
    And look for model "Location" by following JSON and remember as "location":
      """
        {
          "businessId": "{{businessId}}"
        }
      """
    And stored value "location" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "city": "city",
        "countryCode": "+91",
        "name": "name",
        "stateProvinceCode": "stateProvinceCode",
        "streetName": "streetName",
        "streetNumber": "streetNumber",
        "zipCode": "zipCode"
      }
      """
