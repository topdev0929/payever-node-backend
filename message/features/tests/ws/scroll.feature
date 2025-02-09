Feature: Scroll messages
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I load constants from "src/ws/enums/message-events.enum.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I am watching for socket-io event "messages.ws-client.scroll.response"
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

  Scenario: Scroll messages
    Given I use DB fixture "messages-more"
    When I emit socket-io event "messages.ws-client.message.scroll.request" with json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "limit": 3
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And I look for last socket-io event "messages.ws-client.scroll.response" and remember as "scroll_response_1"
    And stored value "scroll_response_1" should contain json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "hasNext": true,
        "messages": [
          {
            "_id": "message-id-99"
          },
          {
            "_id": "message-id-98"
          },
          {
            "_id": "message-id-97"
          }
        ]
      }
      """

    When I emit socket-io event "messages.ws-client.message.scroll.request" with json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "limit": 3
      }
      """

    Then I wait 100 ms while socket-io event is processed
    And I look for last socket-io event "messages.ws-client.scroll.response" and remember as "scroll_response_2"
    And stored value "scroll_response_2" should contain json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "hasNext": true,
        "messages": [
          {
            "_id": "message-id-96"
          },
          {
            "_id": "message-id-95"
          },
          {
            "_id": "message-id-94"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Scroll messages with skip
    Given I use DB fixture "messages-more"
    When I emit socket-io event "messages.ws-client.message.scroll.request" with json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "limit": 3,
        "skip": 2
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And I look for last socket-io event "messages.ws-client.scroll.response" and remember as "scroll_response"
    And stored value "scroll_response" should contain json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "hasNext": true,
        "messages": [
          {
            "_id": "message-id-97"
          },
          {
            "_id": "message-id-96"
          },
          {
            "_id": "message-id-95"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Scroll messages all
    Given I use DB fixture "messages-more"
    When I emit socket-io event "messages.ws-client.message.scroll.request" with json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "limit": 10,
        "skip": 98
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And I look for last socket-io event "messages.ws-client.scroll.response" and remember as "scroll_response"
    And stored value "scroll_response" should contain json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "hasNext": false,
        "messages": [
          {
            "_id": "message-id-1"
          },
          {
            "_id": "message-id-0"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Populate messages object on scroll
    Given I use DB fixture "event-messages"
    When I emit socket-io event "messages.ws-client.message.scroll.request" with json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "limit": 2
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And I look for last socket-io event "messages.ws-client.scroll.response" and remember as "scroll_response"
    And stored value "scroll_response" should contain json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "hasNext": true,
        "messages": [
          {
            "_id": "{{ID_OF_EVENT_MESSAGE_1}}",
            "eventName": "include-member",
            "data": {
              "includedById": "{{ID_OF_USER_1}}",
              "includedBy": {
                "user": "{{ID_OF_USER_1}}",
                "userAccount": {
                  "email": "john@example.com",
                  "firstName": "John",
                  "lastName": "Doe",
                  "logo": "john.png",
                  "phone": "+394233123"
                }
              },
              "includedUserId": "{{ID_OF_USER_4}}",
              "includedUser": {
                "user": "{{ID_OF_USER_4}}",
                "userAccount": {
                  "email": "reza@example.com",
                  "firstName": "Reza",
                  "lastName": "Gh",
                  "logo": "reza.png",
                  "phone": "+984342"
                }
              }
            }
          },
          {
            "_id": "{{ID_OF_EVENT_MESSAGE_2}}",
            "eventName": "exclude-member",
            "data": {
              "excludedById": "{{ID_OF_USER_1}}",
              "excludedBy": {
                "user": "{{ID_OF_USER_1}}",
                "userAccount": {
                  "email": "john@example.com",
                  "firstName": "John",
                  "lastName": "Doe",
                  "logo": "john.png",
                  "phone": "+394233123"
                }
              },
              "excludedUserId": "{{ID_OF_USER_2}}",
              "excludedUser": {
                "user": "{{ID_OF_USER_2}}",
                "userAccount": {
                  "email": "sam@example.com",
                  "firstName": "Sam",
                  "lastName": "Smith",
                  "logo": "sam.png",
                  "phone": "+15551234567"
                }
              }
            }
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Populate messages object on scroll
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.message.scroll.request" with json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "limit": 2
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And I look for last socket-io event "messages.ws-client.scroll.response" and remember as "scroll_response"
    And stored value "scroll_response" should contain json:
      """
      {
        "_id": "{{SCROLL_1_ID}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "hasNext": true,
        "messages": [
          {
            "_id": "{{ID_OF_USER_MESSAGE_3}}",
            "content": "321",
            "replyTo": "{{ID_OF_CONTACT_MESSAGE}}",
            "replyToContent": "321"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

