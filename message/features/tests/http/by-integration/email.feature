Feature: Email integration
  Background: constants
    Given I create date and remember it as "NOW"
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
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "count" with:
      """
      {
        "arguments": [
          "folder_chats"
        ],
        "result": {
          "body": {
            "count": 50
          }
        }
      }
      """

  Scenario: Create email channel then post message
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel" with json:
      """
      {
        "integrationName": "email",
        "contacts": [
          "{{ID_OF_CONTACT}}"
        ],
        "title": "Mailing-chat#1",
        "description": "Description #1"
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "_id": "*",
        "integrationName": "email",
        "contacts": ["{{ID_OF_CONTACT}}"]
      }
      """
    And I store a response as "channel"
    And Stomp queue "message.event.chat.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{channel._id}}",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "deleted": false,
        "salt": "*",
        "contacts": ["{{ID_OF_CONTACT}}"],
        "members": [{
          "user": "{{ID_OF_USER_1}}",
          "role": "admin"
        }]
      }]
      """

    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{channel._id}}/messages" with json:
      """
      {
        "content": "<h1>Html text</h1>",
        "type": "text",
        "sentAt": "{{NOW}}"
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "_id": "*"
      }
      """
    And I store a response as "message"
    And Stomp queue "message.event.message.created" should contain message with json body containing json:
      """
      [{
        "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
        "integrationName": "email",

        "_id": "{{message._id}}",
        "chat": "{{channel._id}}",
        "sender": "{{ID_OF_USER_1}}",
        "content": "*"
      }]
      """


    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{channel._id}}"
    And print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "messages": [
          {
            "_id": "{{message._id}}"
          }
        ]
      }
      """

  Scenario: Forbid to create channel with not allowed integration
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel" with json:
      """
      {
        "integrationName": "whatsapp",
        "contacts": [],
        "title": "Channel-with-not-implemented-integration"
      }
      """
    Then print last response
    And response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "error": "Bad Request",
        "message": "Integration \"whatsapp\" not allowed for \"channel\""
      }
      """
