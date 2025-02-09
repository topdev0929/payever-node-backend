Feature: Messages management
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I send flushall command to Redis
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
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
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

  Scenario: Find messages
    Given I use DB fixture "messages"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages"
    Then print last response
    Then the response code should be 200
    And the response should contain json:
    """
    [{
      "_id": "{{ID_OF_CONTACT_MESSAGE}}",
      "chat": "{{ID_OF_CUSTOMER_CHAT}}",
      "sender": "{{ID_OF_CONTACT}}",
      "content": "321"
    }]
    """

  Scenario: Create message
    Given I use DB fixture "messages"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages" with json:
      """
      {
        "content": "Hello",
        "sentAt": "2021-01-01T12:30:41.018Z"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*",
      "chat": "{{ID_OF_CUSTOMER_CHAT}}",
      "sender": "{{ID_OF_USER_1}}",
      "content": "1abc41287865d927f48dabea2e8486d1"
    }
    """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "1abc41287865d927f48dabea2e8486d1"
      }]
      """
    And Elasticsearch calls stack should contain following ordered messages:
      """
      [[
        "bulkIndex",
        [
          "messages",
          [{
            "_id": "{{response._id}}",
            "chat": "{{ID_OF_CUSTOMER_CHAT}}"
          }]
        ]
      ]]
      """

  Scenario: Create message with interactive buttons
    Given I use DB fixture "messages"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages" with json:
      """
      {
        "interactive": {
          "translations": {
            "en": "First action"
          }
        },
        "type": "box",
        "sentAt": "2021-01-01T12:30:41.018Z"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*",
      "chat": "{{ID_OF_CUSTOMER_CHAT}}",
      "interactive": {
        "defaultLanguage": "en",
        "translations": {
          "en": "First action"
        }
      }
    }
    """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "interactive": {
          "defaultLanguage": "en",
          "translations": {
            "en": "First action"
          }
        }
      }]
      """

  Scenario: Create message template
    Given I use DB fixture "messages"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages" with json:
      """
      {
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "text",
                "text": "Hello",
                "action": "wa:+9812345678"
              }
            ]
          }
        ],
        "sentAt": "2021-01-01T12:30:41.018Z",
        "type": "template"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*",
      "chat": "{{ID_OF_CUSTOMER_CHAT}}",
      "components": [
        {
          "type": "header",
          "parameters": [
            {
              "type": "text",
              "text": "Hello",
              "action": "wa:+9812345678"
            }
          ]
        }
      ]
    }
    """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "text",
                "text": "Hello",
                "action": "wa:+9812345678"
              }
            ]
          }
        ]
      }]
      """

  Scenario: Create message with mention
    Given I use DB fixture "messages"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages" with json:
      """
      {
        "content": "Hello <@12345>",
        "sentAt": "2021-01-01T12:30:41.018Z"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*",
      "chat": "{{ID_OF_CUSTOMER_CHAT}}",
      "sender": "{{ID_OF_USER_1}}",
      "mentions": [
        "12345"
      ]
    }
    """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "mentions": [
          "12345"
        ]
      }]
      """

  Scenario: Create message with action
    Given I use DB fixture "messages"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages" with json:
      """
      {
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "text",
                "text": "Hello"
              }
            ]
          }
        ],
        "sentAt": "2021-01-01T12:30:41.018Z",
        "type": "template"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*",
      "chat": "{{ID_OF_CUSTOMER_CHAT}}",
      "components": [
        {
          "type": "header",
          "parameters": [
            {
              "type": "text",
              "text": "Hello"
            }
          ]
        }
      ]
    }
    """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "text",
                "text": "Hello"
              }
            ]
          }
        ]
      }]
      """

  Scenario: Create message for group without access
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_3}}",
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
    Given I use DB fixture "group"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_GROUP_1}}/messages" with json:
      """
      {
        "content": "Hello",
        "sentAt": "2021-01-01T12:30:41.018Z"
      }
      """
    Then print last response
    Then response status code should be 403
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "statusCode": "403",
      "message": "*",
      "error": "Forbidden"
    }
    """

  Scenario: Delete messages
    Given I use DB fixture "messages"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages/{{ID_OF_USER_MESSAGE}}" with json:
      """
      {
        "deleteForEveryone": true
      }
      """
    Then print last response
    Then response status code should be 204
    And Stomp queue "message.event.message.deleted" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "deletedForUsers": [],
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "{{ENCRYPTED_CONTENT}}",
        "status": "deleted"
      }]
      """
    And Elasticsearch calls stack should contain following ordered messages:
      """
      [[
        "deleteByQuery",
        [
          "messages",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{ID_OF_USER_MESSAGE}}"
              }
            }
          }
        ]
      ]]
      """

  Scenario: Delete messages only for myself
    Given I use DB fixture "messages"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages/{{ID_OF_USER_MESSAGE}}" with json:
      """
      {
        "deleteForEveryone": false
      }
      """
    Then print last response
    Then response status code should be 204
    And Stomp queue "message.event.message.updated" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "deletedForUsers": ["{{ID_OF_USER_1}}"],
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "9771d46437f0e3061c125b01baaea95f",
        "status": "sent"
      }]
      """

  Scenario: Clear chat history
    Given I use DB fixture "messages"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/clear-history"
    Then print last response
    Then response status code should be 204
    And Stomp queue "message.event.message.deleted" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_CONTACT}}",
        "content": "9771d46437f0e3061c125b01baaea95f",
        "status": "deleted"
      }]
      """
    And Elasticsearch calls stack should contain following ordered messages:
      """
      [[
        "deleteByQuery",
        [
          "messages",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{ID_OF_CONTACT_MESSAGE}}"
              }
            }
          }
        ]
      ]]
      """

  Scenario: Create message with reply
    Given I use DB fixture "messages"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages" with json:
      """
      {
        "content": "Hello",
        "sentAt": "2021-01-01T12:30:41.018Z",
        "replyTo": "{{ID_OF_CONTACT_MESSAGE}}"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "1abc41287865d927f48dabea2e8486d1",
        "replyTo": "{{ID_OF_CONTACT_MESSAGE}}",
        "replyToContent":"*"
      }
      """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "1abc41287865d927f48dabea2e8486d1",
        "replyTo": "{{ID_OF_CONTACT_MESSAGE}}",
        "replyToContent":"{{ENCRYPTED_CONTENT}}"
      }]
      """

  Scenario: Forward messages
    Given I use DB fixture "messages"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/forward-messages" with json:
      """
      {
        "ids": [
          "{{ID_OF_USER_MESSAGE}}"
        ]
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    [
      {
        "_id": "*",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "9771d46437f0e3061c125b01baaea95f",
        "forwardFrom": {
          "_id": "{{ID_OF_USER_MESSAGE}}",
          "sender": "_id-of-existing-user"
        }
      }
    ]
    """
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "_id": "*",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "9771d46437f0e3061c125b01baaea95f",
        "forwardFrom": {
          "_id": "{{ID_OF_USER_MESSAGE}}",
          "sender": "_id-of-existing-user"
        }
      }]
      """

  Scenario: Delete multiple messages
    Given I use DB fixture "messages"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/delete-messages" with json:
      """
      {
        "ids": [
          "{{ID_OF_CONTACT_MESSAGE}}"
        ],
        "deleteForEveryone": true
      }
      """
    Then print last response
    Then response status code should be 204
    And Stomp queue "message.event.message.deleted" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "deletedForUsers": [],
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_CONTACT}}",
        "content": "9771d46437f0e3061c125b01baaea95f",
        "status": "deleted"
      }]
      """
    And Elasticsearch calls stack should contain following ordered messages:
      """
      [[
        "deleteByQuery",
        [
          "messages",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{ID_OF_CONTACT_MESSAGE}}"
              }
            }
          }
        ]
      ]]
      """

  Scenario: Delete multiple messages only for me
    Given I use DB fixture "messages"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/delete-messages" with json:
      """
      {
        "ids": [
          "{{ID_OF_CONTACT_MESSAGE}}"
        ]
      }
      """
    Then print last response
    Then response status code should be 204
    And Stomp queue "message.event.message.updated" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "deletedForUsers": ["{{ID_OF_USER_1}}"],
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_CONTACT}}",
        "content": "9771d46437f0e3061c125b01baaea95f",
        "status": "sent"
      }]
      """

  Scenario: Search messages
    Given I use DB fixture "messages"
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["messages"], "result": {
        "body": {
          "hits": {
            "hits": [{
              "_id": "{{ID_OF_USER_MESSAGE}}",
              "_source": { }
            }]
          }
        }
      }}
      """
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/search?query=abc"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "{{DECRYPTED_CONTENT}}"
      }]
      """

  Scenario: Find pinned messages pagination
    Given I use DB fixture "messages"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/pinned-messages?page=1&limit=1"
    Then print last response
    Then the response code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_USER_MESSAGE}}",
          "pinId": "{{ID_OF_PIN_3}}",
          "chat": "{{ID_OF_CUSTOMER_CHAT}}",
          "forAllUsers": true
        }
      ]
      """
