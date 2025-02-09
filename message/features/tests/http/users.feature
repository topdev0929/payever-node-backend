Feature: Users controller
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_1}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    Given I use DB fixture "business"
    Given I use DB fixture "user"

  Scenario: Get all users of business
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/users"
    Then the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_USER_1}}",
        "userAccount": {
          "email": "john@example.com",
          "firstName": "John",
          "lastName": "Doe"
        }
      }, {
        "_id": "{{ID_OF_USER_3}}",
        "userAccount": {
          "email": "jake@example.com",
          "firstName": "Jake",
          "lastName": "Johns",
          "phone": "+84518478"
        }
      }]
      """

  Scenario: Get all common groups with user
    Given I use DB fixture "channel"
    Given I use DB fixture "group"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/mutual/{{ID_OF_USER_2}}"
    Then print last response
    Then the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_GROUP_1}}"
      }]
      """

  Scenario: Update privacy
    When I send a PATCH request to "/api/profile/privacy" with json:
    """
      {
        "status": {
          "showTo": "nobody"
        }
      }
    """
    Then print last response
    Then the response code should be 200
    And I look for model "Profile" by following JSON and remember as "currentUserProfile":
      """
      {
        "_id": "{{ID_OF_USER_1}}"
      }
      """
    And print storage key "currentUserProfile"
    And stored value "currentUserProfile" should contain json:
      """
      {
        "_id": "{{ID_OF_USER_1}}",
        "privacy": {
          "status": {
            "showTo": "nobody"
          }
        }
      }
      """

  Scenario: block and unblock user
    When I send a POST request to "/api/profile/blacklist/{{ID_OF_USER_2}}"
    Then print last response
    Then the response code should be 200
    And I look for model "BlockedUser" by following JSON and remember as "blockedUser":
      """
      {
        "blockedUser": "{{ID_OF_USER_2}}",
        "user": "{{ID_OF_USER_1}}"
      }
      """
    And print storage key "blockedUser"
    And stored value "blockedUser" should contain json:
      """
      {
        "_id": "*",
        "blockedUser": "{{ID_OF_USER_2}}",
        "user": "{{ID_OF_USER_1}}"
      }
      """
    When I send a DELETE request to "/api/profile/blacklist/{{ID_OF_USER_2}}"
    Then the response code should be 200
    And the response should not contain json:
      """
        {
           "_id": "_id-of-existing-user",
           "roles": [{
             "business": "{{ID_OF_EXISTING_BUSINESS}}",
             "role": "whatsappadmin",
             "integrationName": "whatsapp"
           }],
           "sessions": []
         }
      """
    And model "BlockedUser" found by following JSON should not exist:
      """
      {
        "blockedUser": "{{ID_OF_USER_2}}",
        "user": "{{ID_OF_USER_1}}"
      }
      """

  Scenario: Check name is occupied
    When I send a GET request to "/api/profile/username/is-occupied/{{USERNAME_OF_USER_1}}"
    Then print last response
    Then the response code should be 200
    And the response should contain json:
      """
      true
      """

  Scenario: Set own username
    When I send a PATCH request to "/api/profile/username" with json:
      """
      {
        "username": "iron.johny"
      }
      """
    Then print last response
    Then the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_USER_1}}",
        "username": "iron.johny"
      }
      """
