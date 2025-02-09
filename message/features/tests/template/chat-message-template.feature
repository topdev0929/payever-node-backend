Feature: Last messages filler
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "chatTemplateId" following value:
      """
      "e4022ee5-ec85-411c-84d5-a2e2e3403572"
      """
    Given I remember as "chatId" following value:
      """
      "8413cc30-3dc7-4790-bc55-9bca22646566"
      """
    Given I remember as "chatMessageTemplateId" following value:
      """
      "ef5ff954-8f0d-40e0-8ff6-ff9d6e8d61e6"
      """
    Given I remember as "chatMessageId" following value:
      """
      "d3936e74-8dad-404d-b5be-3ae7c075582c"
      """
    Given I remember as "userId" following value:
      """
      "_id-of-existing-user"
      """
    Given I remember as "appName" following value:
      """
      "mail"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          },
          {
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "admin"
          }
        ]
      }
      """
    Given I use DB fixture "business"
    Given I use DB fixture "template"
    Given I use DB fixture "app-channel"
    Given I create date and remember it as "now"
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

  Scenario: Add chat message template
    When I send a POST request to "/api/admin/chat-templates/{{chatTemplateId}}/messages" with json:
      """
      {
        "content": "321",
        "type": "text"
      }
      """
    Then the response code should be 201
    And print last response
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "content": "321",
        "chatTemplate": "{{chatTemplateId}}",
        "sender": "{{userId}}",
        "type": "text"
      }
      """
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{chatId}}",
            "template": "{{response._id}}",
            "content": "9771d46437f0e3061c125b01baaea95f"
          }
        }
      ]
      """

  Scenario: Update chat message template
    When I send a PATCH request to "/api/admin/chat-templates/{{chatTemplateId}}/messages/{{chatMessageTemplateId}}" with json:
      """
      {
        "content": "321"
      }
      """
    Then the response code should be 200
    And print last response
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "{{chatMessageTemplateId}}",
        "content": "321"
      }
      """
    And I look for model "AbstractChatMessage" by following JSON and remember as "message":
      """
      {
        "_id": "{{chatMessageId}}",
        "template": "{{response._id}}"
      }
      """
    And print storage key "message"
    And stored value "message" should contain json:
      """
      {
        "_id": "{{chatMessageId}}",
        "chat": "{{chatId}}",
        "content": "9771d46437f0e3061c125b01baaea95f",
        "template": "{{response._id}}"
      }
      """

  Scenario: Delete chat message template
    When I send a DELETE request to "/api/admin/chat-templates/{{chatTemplateId}}/messages/{{chatMessageTemplateId}}"
    Then the response code should be 204
    And print last response
    And I look for model "AbstractChatMessage" by following JSON and remember as "message":
      """
      {
        "_id": "{{chatMessageId}}",
        "template": "{{chatMessageTemplateId}}"
      }
      """
    And print storage key "message"
    And stored value "message" should contain json:
      """
      {
        "_id": "{{chatMessageId}}",
        "content": "9771d46437f0e3061c125b01baaea95f",
        "template": "{{chatMessageTemplateId}}"
      }
      """
