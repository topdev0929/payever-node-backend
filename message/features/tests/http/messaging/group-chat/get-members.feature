Feature: Messaging members
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
    Given I use DB fixture "group"
    Given I use DB fixture "user"

  Scenario: Get members of group chat
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}/members"
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
        }
      }, {
        "user": {
          "_id": "{{ID_OF_USER_2}}",
          "userAccount": {
            "email": "sam@example.com",
            "firstName": "Sam",
            "lastName": "Smith",
            "logo": "sam.png",
            "phone": "+15551234567"
          }
        }
      }]
      """

  Scenario: Get members of group chat from non-business member

  Scenario: Get members of foreign group chat
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_2}}/members"
    Then print last response
    Then response status code should be 404

  Scenario: Update member by admin
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
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}/members/{{ID_OF_USER_2}}/update" with json:
      """
      {
        "role": "member",
        "permissions": {
          "sendMessages": true,
          "sendMedia": true
        }
      }
      """
    And I store a response as "response"
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "members": [{
          "user": "{{ID_OF_USER_2}}",
          "role": "member",
          "permissions": {
            "sendMessages": true,
            "sendMedia": true
          }
        }]
      }
      """

