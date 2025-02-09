Feature: Mark unread
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I send flushall command to Redis
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I create date and remember it as "now"
    Given I create date and remember it as "then"
    Given I generate an access token using the following data and remember it as "token_for_user_1":
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
    Given I generate an access token using the following data and remember it as "token_for_user_2":
      """
      {
        "id": "_id-of-another-existing-user",
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
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["messages"], "result": [] }
      """

  Scenario: Mark message unread
    Given I use DB fixture "mark-unread-messages"
    When I emit socket-io event "messages.ws-client.message.mark-unread" with:
      """
      {{ID_OF_CONTACT_MESSAGE}}
      """
    Then I wait 100 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$pull": {
              "readBy": "{{ID_OF_USER_1}}"
            }
          }
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms
  
  Scenario: Mark message read (message in cache)
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed
    And I emit socket-io event "messages.ws-client.message.send" with json:
      """
      {
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "content": "321",
        "sentAt": "{{now}}"
      }
      """
    And I wait 10 ms while socket-io event is processed


    When I switch to socket-io client "client-b"


    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    Then I wait 10 ms while socket-io event is processed
  
    When I emit socket-io event "messages.ws-client.message.mark-read" with:
      """
      {{ID_OF_CONTACT_MESSAGE}}
      """
    Then I wait 100 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.message.mark-unread" with:
      """
      {{ID_OF_CONTACT_MESSAGE}}
      """
    Then I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$pull": {
              "readBy": "{{ID_OF_USER_2}}"
            }
          }
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Mark read for sender user (should not change status nor readBy)
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.message.mark-read" with:
      """
      {{ID_OF_USER_MESSAGE}}
      """
    Then I wait 100 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should not contain any messages
    Then I disconnect all socket.io clients and wait 100 ms
