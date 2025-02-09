Feature: Ws message cache feature
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
    Given I send flushall command to Redis
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I create date and remember it as "now"
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
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed
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

  Scenario: Send message
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should not contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_CONTACT_MESSAGE_2}}"
          }
        ]
      }
      """

    And I emit socket-io event "messages.ws-client.message.send" with json:
      """
      {
        "_id": "{{ID_OF_CONTACT_MESSAGE_2}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "content": "321",
        "sentAt": "{{now}}"
      }
      """
    And I wait 10 ms while socket-io event is processed

    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "messages": [
          {
            "_id": "{{ID_OF_CONTACT_MESSAGE_2}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "content": "321",
            "sentAt": "{{now}}",
            "type": "text"

          },
          {
            "_id":"{{ID_OF_CONTACT_MESSAGE}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Update message
    Given I use DB fixture "messages"
    # check last messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "content": "321"
          }
        ]
      }
      """

    # update message
    When I emit socket-io event "messages.ws-client.message.update" with json:
      """
      {
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "content": "replaced-message-content"
      }
      """
    Then I wait 1 ms while socket-io event is processed

    # check last messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "content": "replaced-message-content"
          }
        ]
      }
      """
    And the response should not contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "content": "321"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Update message should not affect last messages
    Given I use DB fixture "messages"
    # check last messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should not contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE_3}}"
          }
        ]
      }
      """

    # update message
    When I emit socket-io event "messages.ws-client.message.update" with json:
      """
      {
        "_id": "{{ID_OF_USER_MESSAGE_3}}",
        "content": "replaced-message-content"
      }
      """
    Then I wait 1 ms while socket-io event is processed

    # check last messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should not contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE_3}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Delete message only for me
    Given I use DB fixture "messages"

    # check message exist in last messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "content": "321",
            "type": "text"
          }
        ]
      }
      """

    When I emit socket-io event "messages.ws-client.message.delete" with json:
      """
      {
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "deleteForEveryone": false
      }
      """
    Then I wait 100 ms while socket-io event is processed
    # message should not exist in last-messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should not contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Delete message for all
    Given I use DB fixture "messages"

    # check message exist in last messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "content": "321",
            "type": "text"
          }
        ]
      }
      """

    When I emit socket-io event "messages.ws-client.message.delete" with json:
      """
      {
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "deleteForEveryone": true
      }
      """
    Then I wait 10 ms while socket-io event is processed
    # message should not exist in last-messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should not contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Mark read message
    Given I use DB fixture "messages"
    # check last messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should not contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "readBy": [
              "{{ID_OF_USER_1}}"
            ]
          }
        ]
      }
      """
    When I emit socket-io event "messages.ws-client.message.mark-read" with:
      """
      {{ID_OF_CONTACT_MESSAGE}}
      """
    Then I wait 10 ms while socket-io event is processed

    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "readBy": [
              "{{ID_OF_USER_1}}"
            ]
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms
