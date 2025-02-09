Feature: Event message
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I create date and remember it as "now"
    Given I am watching for socket-io event "messages.ws-client.room.left"
    Given I am watching for socket-io event "messages.ws-client.chat.online-members-updated"
    Given I am watching for socket-io event "messages.ws-client.message.posted"
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

  Scenario: Include user event
    # 1- join user 1 to chat
    Given I connect to socket.io namespace "chat" as "user1_client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed


    # 2- include user 4 in chat
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
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}/members/{{ID_OF_USER_4}}/include"
    Then print last response
    And the response code should be 200

    # 3- check message in db
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "type": "event",
            "eventName": "include-member",
            "data": {
              "includedById": "{{ID_OF_USER_1}}",
              "includedUserId": "{{ID_OF_USER_4}}"
            },
            "sender": "{{ID_OF_USER_1}}"
          }
        }
      ]
      """

    # 4- check socket-io message
    Then I wait 100 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.message.posted" and remember as "message1_event_data"
    And print storage key "message1_event_data"
    Then stored value "message1_event_data" should contain json:
      """
      {
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "type": "event",
        "eventName": "include-member",
        "data": {
          "includedById": "{{ID_OF_USER_1}}",
          "includedBy":{
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
          "includedUser":{
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
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Exclude user event
    # 1- join user 1 to chat
    Given I connect to socket.io namespace "chat" as "user1_client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed


    # 2- include user 4 in chat
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
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}/members/{{ID_OF_USER_2}}/exclude"
    Then print last response
    And the response code should be 200

    # 3- check message is created
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "type": "event",
            "eventName": "exclude-member",
            "data": {
              "excludedById": "{{ID_OF_USER_1}}",
              "excludedUserId": "{{ID_OF_USER_2}}"
            },
            "sender": "{{ID_OF_USER_1}}"
          }
        }
      ]
      """

    # 4- check socket-io message
    Then I wait 100 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.message.posted" and remember as "message1_event_data"
    And print storage key "message1_event_data"
    Then stored value "message1_event_data" should contain json:
      """
      {
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "type": "event",
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
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Leave member
    # 1- join user 1 to chat
    Given I connect to socket.io namespace "chat" as "user1_client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed


    # 2- include user 4 in chat
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
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}/members/{{ID_OF_USER_2}}/exclude"
    Then print last response
    And the response code should be 200

    # 3- check message is created
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "type": "event",
            "eventName": "exclude-member",
            "data": {
              "excludedById": "{{ID_OF_USER_1}}",
              "excludedUserId": "{{ID_OF_USER_2}}"
            },
            "sender": "{{ID_OF_USER_1}}"
          }
        }
      ]
      """

    # 4- check socket-io message
    Then I wait 100 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.message.posted" and remember as "message1_event_data"
    And print storage key "message1_event_data"
    Then stored value "message1_event_data" should contain json:
      """
      {
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "type": "event",
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
      """
    Then I disconnect all socket.io clients and wait 100 ms
