Feature: Social Authentication
  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: get locations
    Given I use DB fixture "users"

    When I send a GET request to "/api/locations"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [{
      "_id" : "9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098",
      "name" : "name",
      "userAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15",
      "userId" : "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "subnet" : "6924e73d1142f5cee81b74b18cc2651b",
      "hashedSubnet" : "ca55c065e1326392ec55d0af650f7c5b"
    }]
    """

  Scenario: change location name
    Given I use DB fixture "users"

    When I send a PATCH request to "/api/locations/9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098" with json:
    """
    {
      "name": "new-name"
    }
    """
    Then print last response
    And the response should contain json:
    """
    {
      "name": "new-name"
    }
    """
    And the response status code should be 200

  Scenario: change location name
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-2b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """

    When I send a PATCH request to "/api/locations/9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098" with json:
    """
    {
      "name": "new-name"
    }
    """
    Then print last response
    And the response status code should be 403
    And the response should contain json:
    """
    {
      "message": "You do not have access to this location",
      "statusCode": 403
    }
    """

  Scenario: delete location
    Given I use DB fixture "users"

    When I send a DELETE request to "/api/locations/9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098"
    Then print last response
    And the response status code should be 200
    And the response should not contain json:
    """
    [{
      "_id" : "9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098",
      "name" : "name",
      "userAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15",
      "userId" : "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "subnet" : "6924e73d1142f5cee81b74b18cc2651b",
      "hashedSubnet" : "ca55c065e1326392ec55d0af650f7c5b"
    }]
    """

  Scenario: delete location with wrong user
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-2b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """

    When I send a DELETE request to "/api/locations/9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098"
    Then print last response
    And the response status code should be 403
    And the response should contain json:
    """
    {
      "message": "You do not have access to this location",
      "statusCode": 403
    }
    """

