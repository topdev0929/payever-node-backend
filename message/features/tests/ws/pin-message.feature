Feature: Ws pin message
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I create date and remember it as "now"
    Given I am watching for socket-io event "messages.ws-client.message.unpinned"
    Given I am watching for socket-io event "messages.ws-client.message.pinned"
    Given I remember as "user_1_payload" following value:
      """
      {
        "id": "_id-of-existing-user",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "_id-of-existing-business",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    Given I generate an access token using the following data and remember it as "token_for_user_1":
      """
      {{user_1_payload}}
      """
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
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
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """

  Scenario: Pin message and notify all members
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.message.pin" with json:
      """
      {
        "messageId": "{{ID_OF_CONTACT_MESSAGE_2}}",
        "forAllUsers": true,
        "notifyAllMembers": true
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should contain json:
      """
      {
        "pinned": [
          {
            "_id": "*",
            "messageId": "{{ID_OF_CONTACT_MESSAGE_2}}",
            "forAllUsers": true
          }
        ]
      }
      """

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "type": "event",
            "eventName": "pin-message",
            "data": {
              "forAllUsers": "true",
              "messageId": "{{ID_OF_CONTACT_MESSAGE_2}}",
              "pinner": "_id-of-existing-user"
            }
          }
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Pin message without notify members
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.message.pin" with json:
      """
      {
        "messageId": "{{ID_OF_CONTACT_MESSAGE_2}}",
        "forAllUsers": true,
        "notifyAllMembers": false
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should not contain any messages
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Pin message for single user
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.message.pin" with json:
      """
      {
        "messageId": "{{ID_OF_CONTACT_MESSAGE}}",
        "forAllUsers": false
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should contain json:
      """
      {
        "pinned": [
          {
            "_id": "*",
            "messageId": "{{ID_OF_CONTACT_MESSAGE}}",
            "forAllUsers": true
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Unpin message
    Given I use DB fixture "messages"
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
    Then I emit socket-io event "messages.ws-client.message.unpin" with json:
      """
      {
        "pinId": "{{ID_OF_PIN}}",
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}"
      }
      """
    Then I wait 200 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.message.unpinned" and remember as "unpinned_event"
    And print storage key "unpinned_event"
    Then stored value "unpinned_event" should contain json:
      """
      {
        "chat": {
          "_id": "{{ID_OF_CUSTOMER_CHAT}}"
        },
        "pinned": {
          "_id": "{{ID_OF_PIN}}",
          "forAllUsers": true,
          "messageId": "{{ID_OF_CONTACT_MESSAGE}}"
        }
      }
      """

    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should not contain json:
      """
      {
        "pinned": [
          {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Message is pinned and then deleted for everyone (should be removed from pinned messages)
    Given I use DB fixture "messages"
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.message.delete" with json:
      """
      {
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "deleteForEveryone": true
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should not contain json:
      """
      {
        "pinned": [
          {
            "_id": "{{ID_OF_PIN_2}}"
          }
        ]
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should not contain json:
      """
      {
        "pinned": [
          {
            "_id": "{{ID_OF_PIN_3}}"
          }
        ]
      }
      """

    Then I look for last socket-io event "messages.ws-client.message.unpinned" and remember as "unpinned_event"
    And print storage key "unpinned_event"
    Then stored value "unpinned_event" should contain json:
      """
      {
        "chat": {
          "_id": "{{ID_OF_CUSTOMER_CHAT}}"
        },
        "pinned": {
          "_id": "{{ID_OF_PIN_3}}",
          "forAllUsers": true,
          "messageId": "{{ID_OF_USER_MESSAGE}}"
        }
      }
      """

    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Message is pinned and then deleted only for me
    Given I use DB fixture "messages"
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.message.delete" with json:
      """
      {
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "deleteForEveryone": false
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should contain json:
      """
      {
        "pinned": [
          {
            "_id": "{{ID_OF_PIN_2}}"
          }
        ]
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should contain json:
      """
      {
        "pinned": [
          {
            "_id": "{{ID_OF_PIN_3}}"
          }
        ]
      }
      """

    Then I disconnect all socket.io clients and wait 100 ms
