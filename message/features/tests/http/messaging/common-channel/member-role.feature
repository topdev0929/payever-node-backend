Feature: Make common-channel requests by member
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_3}}",
        "email": "common-channel-member@example.com",
        "firstName": "Channel",
        "lastName": "Member",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ID_OF_ANOTHER_EXISTING_BUSINESS}}",
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
    Given I use DB fixture "channel"

  Scenario: Get channel by Id
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CHANNEL}}",
        "title": "Public-channel",
        "messages": []
      }
      """

  Scenario: Include member to channel
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members/{{ID_OF_USER_2}}/include"
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_1}}"
          },
          {
            "user": "{{ID_OF_USER_2}}"
          },
          {
            "user": "{{ID_OF_USER_3}}"
          }
        ]
      }
      """

  Scenario: Exclude member from channel
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members/{{ID_OF_USER_4}}/exclude" with json:
      """
      {
      }
      """
    Then print last response
    And the response code should be 403

  Scenario: Send invitation by email
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/{{CHANNEL_1_INVITE_ID}}/send-to-email/user@example.com"
    Then print last response
    And the response code should be 201

  Scenario: Set members permission by global permission
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_1}}",
        "email": "common-channel-member@example.com",
        "firstName": "Channel",
        "lastName": "Member",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ID_OF_ANOTHER_EXISTING_BUSINESS}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/permissions" with json:
      """
      {
        "sendMessages": false,
        "sendMedia": false
      }
      """
    Then the response code should be 200
    Then model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "members": [{
          "user": "{{ID_OF_USER_1}}",
          "permissions": {
            "sendMessages": false,
            "sendMedia": false
          }
        }, {
          "user": "{{ID_OF_USER_3}}",
          "permissions": {
            "sendMessages": false,
            "sendMedia": false
          }
        }]
      }
      """
  Scenario: Check member permission after add member
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_1}}",
        "email": "common-channel-member@example.com",
        "firstName": "Channel",
        "lastName": "Member",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ID_OF_ANOTHER_EXISTING_BUSINESS}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/permissions" with json:
      """
      {
        "sendMessages": false,
        "sendMedia": false
      }
      """
    Given model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
    """
    {
      "permissions":{
        "sendMessages": false,
        "sendMedia": false
      }
    }
    """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/{{CHANNEL_1_INVITE_ID}}/send-to-email/{{USER_5_EMAIL}}"
    Then print last response
    And the response code should be 201
    Given model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "members": [{
          "user": "{{ID_OF_USER_1}}",
          "permissions": {
            "sendMessages": false,
            "sendMedia": false
          }
        }, {
          "user": "{{ID_OF_USER_3}}",
          "permissions": {
            "sendMessages": false,
            "sendMedia": false
          }
        }, {
          "user": "{{ID_OF_USER_5}}",
          "permissions": {
            "sendMessages": false,
            "sendMedia": false
          }
        }]
      }
      """

