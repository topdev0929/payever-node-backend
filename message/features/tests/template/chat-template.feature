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
    Given I use DB fixture "channel-set"
    Given I create date and remember it as "now"
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """

  Scenario: Add chat template
    When I send a POST request to "/api/admin/chat-templates" with json:
      """
      {
        "app": "{{appName}}",
        "title": "payever Shop Bot"
      }
      """
    Then the response code should be 201
    And print last response
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "app": "{{appName}}",
        "title": "payever Shop Bot"
      }
      """
    And I look for model "AbstractMessaging" by following JSON and remember as "chat":
      """
      {
        "app": "{{appName}}",
        "template": "{{response._id}}"
      }
      """
    And print storage key "chat"
    And stored value "chat" should contain json:
      """
      {
        "_id": "*",
        "app": "{{appName}}",
        "template": "{{response._id}}",
        "title": "payever Shop Bot"
      }
      """

  Scenario: Update chat template
    When I send a PATCH request to "/api/admin/chat-templates/{{chatTemplateId}}" with json:
      """
      {
        "title": "payever Shop Bot 2"
      }
      """
    Then the response code should be 200
    And print last response
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "{{chatTemplateId}}",
        "title": "payever Shop Bot 2"
      }
      """
    And I look for model "AbstractMessaging" by following JSON and remember as "chat":
      """
      {
        "_id": "{{chatId}}",
        "template": "{{response._id}}"
      }
      """
    And print storage key "chat"
    And stored value "chat" should contain json:
      """
      {
        "_id": "{{chatId}}",
        "template": "{{response._id}}",
        "title": "payever Shop Bot 2"
      }
      """

  Scenario: Delete chat template
    When I send a DELETE request to "/api/admin/chat-templates/{{chatTemplateId}}"
    Then the response code should be 204
    And print last response
    And I look for model "AbstractMessaging" by following JSON and remember as "chat":
      """
      {
        "_id": "{{chatId}}",
        "template": "{{chatTemplateId}}"
      }
      """
    And print storage key "chat"
    And stored value "chat" should contain json:
      """
      {
        "_id": "{{chatId}}",
        "deleted": true,
        "template": "{{chatTemplateId}}",
        "title": "payever Shop Bot"
      }
      """
