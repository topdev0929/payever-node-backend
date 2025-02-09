Feature: Social Authentication
  Scenario: login facebook
    Given I use DB fixture "users"
    And I am not authenticated

    When I send a GET request to "/api/social/facebook/login"
    Then print last response
    And response header "location" should have value "https://www.facebook.com/v3.2/dialog/oauth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fsocial%2Ffacebook%2Fredirect%2Flogin&scope=email&client_id=355644785829610"
    And the response status code should be 302

  Scenario: register facebook
    Given I use DB fixture "users"
    And I am not authenticated

    When I send a GET request to "/api/social/facebook/register"
    Then print last response
    And response header "location" should have value "https://www.facebook.com/v3.2/dialog/oauth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fsocial%2Ffacebook%2Fredirect%2Fregister&scope=email&client_id=355644785829610"
    And the response status code should be 302

  Scenario: login google
    Given I use DB fixture "users"
    And I am not authenticated

    When I send a GET request to "/api/social/google/login"
    Then print last response
    And response header "location" should have value "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fsocial%2Fgoogle%2Fredirect%2Flogin&scope=email%20profile&client_id=121980912560-dmd8fv3rjlr3hf72rlliv667ups32pdn.apps.googleusercontent.com"
    And the response status code should be 302

  Scenario: register google
    Given I use DB fixture "users"
    And I am not authenticated

    When I send a GET request to "/api/social/google/register"
    Then print last response
    And response header "location" should have value "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fsocial%2Fgoogle%2Fredirect%2Fregister&scope=email%20profile&client_id=121980912560-dmd8fv3rjlr3hf72rlliv667ups32pdn.apps.googleusercontent.com"
    And the response status code should be 302

  Scenario: get social accounts
    Given I use DB fixture "users"
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

    When I send a GET request to "/api/social/accounts"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [{
      "name": "name",
      "type": "facebook"
    }]
    """

  Scenario: block social accounts
    Given I use DB fixture "users"
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

    When I send a PATCH request to "/api/social/accounts/9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098/block"
    Then print last response
    And the response status code should be 200
    And look for model "Social" by following JSON and remember as "social":
    """
    {"_id": "9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098"}
    """
    And stored value "social" should contain json:
    """
    { "blocked": true }
    """

  Scenario: unblock social accounts
    Given I use DB fixture "users"
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

    When I send a PATCH request to "/api/social/accounts/9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098/unblock"
    Then print last response
    And the response status code should be 200
    And look for model "Social" by following JSON and remember as "social":
    """
    {"_id": "9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098"}
    """
    And stored value "social" should contain json:
    """
    { "blocked": false }
    """

  Scenario: delete social accounts by id
    Given I use DB fixture "users"
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

    When I send a DELETE request to "/api/social/accounts/9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098"
    Then print last response
    And the response status code should be 200
    And model "Social" with id "9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098" should not contain json:
    """
    {"_id": "9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098"}
    """

  Scenario: delete social accounts by id with wrong user
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-2345-537a0a6e17c7",
        "email": "merchant@exammple.com",
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

    When I send a DELETE request to "/api/social/accounts/9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098"
    Then print last response
    And the response status code should be 403

