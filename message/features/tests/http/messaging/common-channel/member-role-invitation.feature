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
    Given I use DB fixture "contacts"
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

  Scenario: Send invitation by email
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/{{CHANNEL_1_INVITE_ID}}/send-to-email/user@example.com"
    Then print last response
    And the response code should be 201

  Scenario: Send invitation by email: user has payever account
    Given model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should not contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_5}}"
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/{{CHANNEL_1_INVITE_ID}}/send-to-email/{{USER_5_EMAIL}}"
    Then print last response
    And the response code should be 201
    Given model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_5}}"
          }
        ]
      }
      """
