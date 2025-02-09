Feature: Http Chat Http
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
    Given I use DB fixture "user"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
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

  Scenario: Create chat
    When I send a POST request to "/api/messaging/direct-chat" with json:
      """
      {
        "peer": "{{ID_OF_USER_2}}"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "members": [{
          "role": "admin",
          "user": "{{ID_OF_USER_1}}"
        }, {
          "role": "member",
          "user": "{{ID_OF_USER_2}}"
        }]
      }
      """
    And Stomp queue "message.event.chat.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "deleted": false,
        "salt": "*"
      }]
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "messages.event.widget-data.created",
        "payload": {
          "id": "{{response._id}}",
          "type": "direct-chat"
        }
      }]
      """

  Scenario: Create chat by simple user
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_2}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [],
            "tags": [],
            "name": "user"
          }
        ]
      }
      """
    When I send a POST request to "/api/messaging/direct-chat" with json:
      """
      {
        "peer": "{{ID_OF_USER_1}}"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "members": [{
          "role": "admin",
          "user": "{{ID_OF_USER_2}}"
        }, {
          "role": "member",
          "user": "{{ID_OF_USER_1}}"
        }]
      }
      """
    And Stomp queue "message.event.chat.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "deleted": false,
        "salt": "*"
      }]
      """

  Scenario: Get chat by Id
    Given I use DB fixture "direct-chats"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/direct-chat/{{ID_OF_DIRECT_CHAT}}"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_DIRECT_CHAT}}",
        "title": "Title of chat",
        "messages": []
      }
      """

  Scenario: Find all chats of business
    Given I remember as "filter" following value:
      """
      "{\"type\": \"direct-chat\"}"
      """
    Given I use DB fixture "direct-chats"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging?filter={{filter}}"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_DIRECT_CHAT}}",
        "title": "Title of chat",
        "messages": []
      }]
      """

  Scenario: Delete chat
    Given I use DB fixture "direct-chats"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/direct-chat/{{ID_OF_DIRECT_CHAT}}"
    Then print last response
    Then the response code should be 204
    And model "AbstractMessaging" with id "{{ID_OF_DIRECT_CHAT}}" should contain json:
      """
      {
        "deleted": true
      }
      """
    And Stomp queue "message.event.chat.deleted" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_DIRECT_CHAT}}",
        "deleted": true
      }]
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "messages.event.widget-data.deleted",
        "payload": {
          "id": "{{ID_OF_DIRECT_CHAT}}"
        }
      }]
      """
    
