Feature: Http Group Http
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
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": ["folder_chats"],
        "result": {
          "body": { "hits": {
            "hits": []
          }}
        }
      }
      """
    Given I mock Elasticsearch method "count" with:
      """
      {
        "arguments": ["folder_chats"],
        "result": {
          "body": {
            "count": 50
          }
        }
      }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """

  Scenario: Create group
    Given I use DB fixture "channel-set"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group" with json:
      """
      {
        "title": "Group title",
        "members": [{
          "user": "{{ID_OF_USER_2}}"
        }, {
          "user": "{{ID_OF_USER_3}}",
          "role": "subscriber"
        }]
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "members": [{
          "user": "{{ID_OF_USER_1}}",
          "role": "admin"
        }, {
          "user": "{{ID_OF_USER_2}}",
          "role": "member"
        }, {
          "user": "{{ID_OF_USER_3}}",
          "role": "subscriber"
        }]
      }
      """
    And Stomp queue "message.event.chat.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "deleted": false
      }]
      """

  Scenario: Get group by Id
    Given I use DB fixture "group"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_GROUP_1}}",
        "title": "Title of group",
        "messages": []
      }
      """

  Scenario: Find all groups of business
    Given I remember as "filter" following value:
      """
      "{\"type\": \"group\"}"
      """
    Given I use DB fixture "group"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging?filter={{filter}}"
    Then print last response
    And I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_GROUP_1}}",
        "title": "Title of group",
        "messages": []
      }]
      """

  Scenario: Update group
    Given I use DB fixture "group"
    When I send a PATCH request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}" with json:
      """
      {
        "title": "New Chat title",
        "usedInWidget": true
      }
      """
    Then the response code should be 200
    And the response should contain json:
      """
      {
        "title": "New Chat title",
        "usedInWidget": true
      }
      """
    And Stomp queue "message.event.chat.updated" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_GROUP_1}}",
        "title": "New Chat title",
        "usedInWidget": true
      }]
      """

  Scenario: Delete group
    Given I use DB fixture "group"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}" with json:
      """
      {
        "deleteForEveryone": true
      }
      """
    Then the response code should be 204
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "deleted": true
      }
      """
    And Stomp queue "message.event.chat.deleted" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_GROUP_1}}",
        "deleted": true
      }]
      """

  Scenario: Update group permissions
    Given I use DB fixture "group"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}/permissions" with json:
      """
      {
        "addMembers": false,
        "live": true
      }
      """
    Then the response code should be 200
    And the response should contain json:
      """
      {
        "permissions": {
          "live": true,
          "addMembers": false
        }
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "permissions":{
          "live": true,
          "addMembers": false
        },
        "usedInWidget": false
      }
      """

  Scenario: Join group via inviteCode
    Given I use DB fixture "group"
    When I send a POST request to "/api/invitations/XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT/join"
    Then print last response
    Then response status code should be 200
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_GROUP_1}}"
      }
      """

  Scenario: Invite and exclude member to group
    Given I use DB fixture "group"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}/members/{{ID_OF_USER_4}}/include" with json:
      """
      {
      }
      """
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_1}}"
          },
          {
            "user": "{{ID_OF_USER_4}}"
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}/members/{{ID_OF_USER_1}}/exclude" with json:
      """
      {
      }
      """
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should not contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_4}}"
          }
        ]
      }
      """

  Scenario: Invite to group and can't
    Given I use DB fixture "group"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}/members/{{ID_OF_USER_3}}/include" with json:
      """
      {
      }
      """
    Then print last response
    And the response code should be 403
    And the response should contain json:
      """
      {
        "error": "Forbidden",
        "message": "User with id \"{{ID_OF_USER_3}}\" forbids to be a member of group \"{{ID_OF_GROUP_1}}\"",
        "statusCode": 403
      }
      """

  Scenario: Invite to group with higher role
    Given I use DB fixture "group"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_2}}",
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
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}/members/{{ID_OF_USER_4}}/include" with json:
      """
      {
        "role": "admin"
      }
      """
    Then print last response
    And the response code should be 400
    And the response should contain json:
      """
      {
        "error": "Bad Request",
        "message": "You can't include members with higher roles than yours",
        "statusCode": 400
      }
      """

  Scenario: Exclude yourself by delete with deleteForEveryone: false
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_2}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
            ],
            "tags": [],
            "name": "user"
          }
        ]
      }
      """
    Given I use DB fixture "group"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}" with json:
      """
      {
        "deleteForEveryone": false
      }
      """
    Then the response code should be 204
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "deleted": false
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should not contain json:
      """
      {
        "members": [{
          "user": "{{ID_OF_USER_2}}"
        }]
      }
      """

  Scenario: Exclude yourself from group
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_2}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
            ],
            "tags": [],
            "name": "user"
          }
        ]
      }
      """
    Given I use DB fixture "group"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/group/{{ID_OF_GROUP_1}}/members/{{ID_OF_USER_2}}/exclude"
    Then the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "deleted": false
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should not contain json:
      """
      {
        "members": [{
          "user": "{{ID_OF_USER_2}}"
        }]
      }
      """
