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
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """

  Scenario: Create chat
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat" with json:
      """
      {
        "title": "Chat title",
        "contact": "{{ID_OF_CONTACT}}",
        "integrationName": "whatsapp"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*"
    }
    """
    And Stomp queue "message.event.chat.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "deleted": false,
        "salt": "*",
        "contact": {
          "_id": "{{ID_OF_CONTACT}}"
        }
      }]
      """

  Scenario: Get chat by Id
    Given I use DB fixture "customer-chats"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "contact": {
          "_id": "{{ID_OF_CONTACT}}"
        },
        "title": "Title of chat",
        "messages": []
      }
      """

  Scenario: Find all chats of business
    Given I remember as "filter" following value:
      """
      "{\"type\": \"chat\"}"
      """
    Given I use DB fixture "customer-chats"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging?filter={{filter}}"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "contact": {
          "_id": "{{ID_OF_CONTACT}}"
        },
        "title": "Title of chat",
        "messages": []
      }]
      """
  
  Scenario: Find all messaging of business with pagination
    Given I use DB fixture "customer-chats"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging?limit=1&page=2"
    And print last response
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "contact": {
          "_id": "{{ID_OF_CONTACT}}"
        },
        "title": "Title of chat",
        "messages": []
      }]
      """

  Scenario: Update Chat
    Given I use DB fixture "customer-chats"
    When I send a PATCH request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}" with json:
      """
      {
        "title": "New Chat title"
      }
      """
    Then print last response
    Then the response code should be 200
    And the response should contain json:
      """
      {
        "title": "New Chat title"
      }
      """
    And Stomp queue "message.event.chat.updated" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "title": "New Chat title"
      }]
      """

  Scenario: Delete chat
    Given I use DB fixture "customer-chats"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    Then the response code should be 204
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should contain json:
      """
      {
        "deleted": true
      }
      """
    And Stomp queue "message.event.chat.deleted" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "deleted": true
      }]
      """

  Scenario: Forbid to create chat with same business / contact / integration
    Given I use DB fixture "customer-chats"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat" with json:
      """
      {
        "contact": "{{ID_OF_CONTACT}}",
        "title": "new chat with {{ID_OF_CONTACT}}",
        "integrationName": "whatsapp"
      }
      """
    Then print last response
    And the response code should be 409
    And the response should contain json:
      """
      {
        "message": "Chat with contact '{{ID_OF_CONTACT}}' using 'whatsapp' already exists: id = '{{ID_OF_CUSTOMER_CHAT}}', deleted = false"
      }
      """

  Scenario: Allow to create chat with same business / contact / integration if existing was deleted
    Given I use DB fixture "customer-chats"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat" with json:
      """
      {
        "contact": "{{ID_OF_CONTACT}}",
        "title": "new chat with {{ID_OF_CONTACT}}",
        "integrationName": "whatsapp"
      }
      """
    Then print last response
    And the response code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*",
      "contact": {
        "_id": "3bddb299-8bb0-41e5-beeb-d23c1fd5ef37"
      },
      "integrationName": "whatsapp",
      "title": "new chat with 3bddb299-8bb0-41e5-beeb-d23c1fd5ef37",
      "messages": [],
      "members": [
        {
          "role": "admin",
          "user": "{{ID_OF_USER_1}}"
        }
      ]
    }
    """
    And Stomp queue "message.event.chat.deleted" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "deleted": true
      }]
      """
    And Stomp queue "message.event.chat.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "deleted": false,
        "salt": "*"
      }]
      """

  Scenario: Invite ad exclude member to chat
    Given I use DB fixture "customer-chats"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}/members/{{ID_OF_USER_4}}/include" with json:
      """
      {
      }
      """
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_4}}"
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}/members/{{ID_OF_USER_4}}/exclude"
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should not contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_4}}"
          }
        ]
      }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "messages.event.widget-data.member-included",
        "payload": {
          "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
          "member":{
            "user":"{{ID_OF_USER_4}}"
          }
        }
      }]
      """
