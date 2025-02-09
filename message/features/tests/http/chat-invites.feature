Feature: Last messages filler
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
    Given I use DB fixture "chat-invite"
    Given I create date and remember it as "now"

  Scenario: Add chat invite
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites" with json:
      """
      {}
      """
    Then the response code should be 201
    And print last response
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "code": "*"
      }
      """

  Scenario: Delete chat invite
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/{{CHANNEL_1_INVITE_ID}}"
    Then the response code should be 204
    And print last response

    Then I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/{{CHANNEL_1_INVITE_ID}}"
    And print last response
    Then the response code should be 404
    


  Scenario: Prevent invite contact with duplicated email address
    Given I mock RPC request with:
      """
      {
        "request": {
          "channel": "contacts.rpc.readonly.find-one",
          "name": "contacts.rpc.readonly.find-one",
          "exchange": "rpc_calls",
          "payload": {
            "filter": {
              "_id": "contact-id",
              "businessId": "_id-of-existing-business"
            },
            "options": {
              "populate": {
                "path": "fields",
                "populate": {
                  "path": "field"
                }
              }
            }
          }
        },
        "response": [
          {
            "fields": [
              {
                "field": {
                  "name": "email"
                },
                "value": "email-1@payever.org"
              }
            ]
          }
        ]
      }
      """

    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/{{CHANNEL_1_INVITE_ID}}/send-to-contact/contact-id"
    Then print last response
    And the response code should be 409
    And the response should contain json:
      """
      {
        "message": "contact by email 'email-1@payever.org' is already invited."
      }
      """

  Scenario: Get invited members
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/invited-members"
    Then the response code should be 200
    And print last response
    And the response should contain json:
      """
      [
        {
          "_id": "chat-invite-member-1",
          "contactId": "{{CONTACT_ID}}",
          "email": "email-1@payever.org",
          "name": "contact 1"
        }
      ]
      """

  Scenario: Delete invited members
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/invited-members/chat-invite-member-1"
    Then the response code should be 200

    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CHANNEL}}/invites/invited-members"
    And print last response
    And the response should not contain json:
      """
      [
        {
          "_id": "chat-invite-member-1",
          "contactId": "{{CONTACT_ID}}",
          "email": "email-1@payever.org",
          "name": "contact 1"
        }
      ]
      """
    Then model "AbstractChatMessage" with id "{{ID_OF_CHANNEL}}" should not contain json:
      """
      {
        "invitedMembers": [
          {
            "_id": "chat-invite-member-1"
          }
        ]
      }
      """
