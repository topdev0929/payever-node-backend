Feature: Ws Send Message
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

  Scenario: Send message without showSender permission
    Given I use DB fixture "channel"
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_type":
      """
      test.type
      """
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_payload":
      """
      {"test-payload":true}
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CHANNEL}}
      """
    Then I wait 10 ms while socket-io event is processed
    And I emit socket-io event "messages.ws-client.message.send" with json:
      """
      {
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "chat": "{{ID_OF_CHANNEL}}",
        "content": "321",
        "contentType": "test.type",
        "contentPayload": {"test-payload":true},
        "sentAt": "{{now}}"
      }
      """
    And I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "sender": "_id-of-existing-user",
            "chat": "{{ID_OF_CHANNEL}}",
            "content": "9771d46437f0e3061c125b01baaea95f",
            "contentType": "{{encrypted_type}}",
            "contentPayload": "{{encrypted_payload}}",
            "sentAt": "{{now}}",
            "type": "text"
          }
        }
      ]
      """

    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "status": "sent",
        "sender": "_id-of-existing-user",
        "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
        "integrationName": "internal"
      }]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Send message
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_type":
      """
      test.type
      """
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_payload":
      """
      {"test-payload":true}
      """
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
        "contentType": "test.type",
        "contentPayload": {"test-payload":true},
        "sentAt": "{{now}}"
      }
      """
    And I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "content": "9771d46437f0e3061c125b01baaea95f",
            "contentType": "{{encrypted_type}}",
            "contentPayload": "{{encrypted_payload}}",
            "sentAt": "{{now}}",
            "type": "text"
          }
        }
      ]
      """

    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "status": "sent",

        "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
        "integrationName": "whatsapp"
      }]
      """
    Then I disconnect all socket.io clients and wait 100 ms
  
  Scenario: Send message with reqId
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_type":
      """
      test.type
      """
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_payload":
      """
      {"test-payload":true}
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed
    And I emit socket-io event "messages.ws-client.message.send" with json:
      """
      {
        "reqId":"10000",
        "param":{
          "_id": "{{ID_OF_CONTACT_MESSAGE}}",
          "chat": "{{ID_OF_CUSTOMER_CHAT}}",
          "content": "321",
          "contentType": "test.type",
          "contentPayload": {"test-payload":true},
          "sentAt": "{{now}}"
        }
      }
      """
    And I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "content": "9771d46437f0e3061c125b01baaea95f",
            "contentType": "{{encrypted_type}}",
            "contentPayload": "{{encrypted_payload}}",
            "sentAt": "{{now}}",
            "type": "text"
          }
        }
      ]
      """

    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "status": "sent",

        "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
        "integrationName": "whatsapp"
      }]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Send message with interactive buttons
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
        "interactive": {
          "translations": {
            "en": "First action"
          }
        },
        "sentAt": "{{now}}",
        "type": "box"
      }
      """
    And I wait 10 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "interactive": {
              "defaultLanguage": "en",
              "translations": {
                "en": "First action"
              }
            }
          }
        }
      ]
      """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [
        {
          "_id": "{{ID_OF_CONTACT_MESSAGE}}",
          "status": "sent",
          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "integrationName": "whatsapp"
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Send message template
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
        "components": [
          {
            "type": "body",
            "parameters": [
              {
                "type": "image",
                "image": {
                  "link": "https://cdn.x.com"
                },
                "action": "wa:+9812345678"
              }
            ]
          }
        ],
        "sentAt": "{{now}}",
        "type": "template"
      }
      """
    And I wait 10 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "components": [
              {
                "type": "body",
                "parameters": [
                  {
                    "type": "image",
                    "image": {
                      "link": "https://cdn.x.com"
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
      """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [
        {
          "_id": "{{ID_OF_CONTACT_MESSAGE}}",
          "status": "sent",
          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "integrationName": "whatsapp"
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Send message with mentions
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
        "content": "Hello <@123456>, and see you <@987654321>",
        "sentAt": "{{now}}"
      }
      """
    And I wait 10 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "mentions": [
              "123456",
              "987654321"
            ]
          }
        }
      ]
      """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [
        {
          "_id": "{{ID_OF_CONTACT_MESSAGE}}",
          "status": "sent",
          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "integrationName": "whatsapp"
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Send message with reply
    Given I use DB fixture "messages"
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
        "replyTo": "{{ID_OF_CONTACT_MESSAGE}}",
        "sentAt": "{{now}}"
      }
      """
    And I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "content": "9771d46437f0e3061c125b01baaea95f",
            "replyTo": "{{ID_OF_CONTACT_MESSAGE}}",
            "replyToContent": "{{ENCRYPTED_CONTENT}}",
            "sentAt": "{{now}}",
            "type": "text"
          }
        }
      ]
      """

    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [
        {
          "_id": "{{ID_OF_CONTACT_MESSAGE}}",
          "status": "sent",
          "replyTo": "{{ID_OF_CONTACT_MESSAGE}}",
          "replyToContent": "{{ENCRYPTED_CONTENT}}",
          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "integrationName": "whatsapp"
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms
  Scenario: Send message forward
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_type":
      """
      test.type
      """
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_payload":
      """
      {"test-payload":true}
      """
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
        "contentType": "test.type",
        "contentPayload": {"test-payload":true},
        "sentAt": "{{now}}"
      }
      """
    And I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}",
            "content": "9771d46437f0e3061c125b01baaea95f",
            "contentType": "{{encrypted_type}}",
            "contentPayload": "{{encrypted_payload}}",
            "sentAt": "{{now}}",
            "type": "text"
          }
        }
      ]
      """
    And I emit socket-io event "messages.ws-client.message.forward" with json:
      """
      {
        "chat": "{{ID_OF_CUSTOMER_CHAT_2}}",
        "ids": [
          "{{ID_OF_CONTACT_MESSAGE}}"
        ],
        "withSender": true
      }
      """
    And I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [
        {
          "_id": "{{ID_OF_CONTACT_MESSAGE}}",
          "status": "sent",
          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "integrationName": "whatsapp"
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms
