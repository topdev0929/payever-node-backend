Feature: Messaging members
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "channel"
    Given I use DB fixture "user"

  Scenario: Get members of common channel by channel admin
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
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      [{
        "user": {
          "_id": "{{ID_OF_USER_1}}",
          "userAccount": {
            "email": "john@example.com",
            "firstName": "John",
            "lastName": "Doe",
            "logo": "john.png",
            "phone": "+394233123"
          }
        },
        "profile": {
          "_id": "{{ID_OF_USER_1}}",
          "username": "{{USERNAME_OF_USER_1}}",
          "lastSeen": null,
          "status": "offline"
        }
      }, {
        "user": {
          "_id": "{{ID_OF_USER_3}}"
        }
      }, {
        "user": {
          "_id": "{{ID_OF_USER_4}}"
        }
      }]
      """

  Scenario: Get members of common channel by channel subscriber or member
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_3}}",
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
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      [{
        "user": {
          "_id": "{{ID_OF_USER_1}}",
          "userAccount": {
            "email": "john@example.com",
            "firstName": "John",
            "lastName": "Doe",
            "logo": "john.png",
            "phone": "+394233123"
          }
        },
        "profile": {
          "_id": "{{ID_OF_USER_1}}",
          "username": "{{USERNAME_OF_USER_1}}",
          "lastSeen": null,
          "status": "offline"
        }
      }, {
        "user": {
          "_id": "{{ID_OF_USER_3}}"
        }
      }]
      """
    And the response should not contain json:
      """
      [{
        "user": {
          "_id": "{{ID_OF_USER_4}}"
        }
      }]
      """

  Scenario: Get members of public channel
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
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members"
    Then print last response
    Then response status code should be 200
