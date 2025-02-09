Feature: Http Channel Http
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
      { "arguments": ["messages"], "result": [] }
      """

  Scenario: Create channel
    Given I use DB fixture "channel-set"
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel" with json:
      """
      {
        "title": "Channel-title",
        "subType": "public",
        "photo": "photo.png",
        "contacts": [],

        "parentFolderId": "{{ID_OF_FOLDER_1}}"
      }
      """
    Then print last response
    And response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*",
      "photo": "photo.png",
      "integrationName": "internal"
    }
    """
    And Stomp queue "message.event.chat.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "photo": "photo.png",
        "deleted": false,
        "salt": "*"
      }]
      """
    And event "folder-action-create-document" should be dispatched with following arguments:
      """
      [{
        "_id": "{{response._id}}",
        "parentFolderId": "{{ID_OF_FOLDER_1}}"
      }]
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "message_folders" should contain following messages:
      """
      [{
        "name": "message.folder-action-create-document",
        "payload": {
          "esFolderItemPrototype": {
            "_id": "{{response._id}}",
            "parentFolderId": "{{ID_OF_FOLDER_1}}"
          }
        }
      }]
      """

  Scenario: Get channel by Id
    Given I use DB fixture "channel"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CHANNEL}}",
        "title": "Public-channel",
        "messages": []
      }
      """

  Scenario: Find all channels of business
    Given I remember as "filter" following value:
      """
      "{\"type\": \"channel\"}"
      """
    Given I use DB fixture "channel"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging?filter={{filter}}"
    Then print last response
    And I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_CHANNEL}}",
        "title": "Public-channel",
        "messages": []
      }]
      """

  Scenario: Update channel
    Given I use DB fixture "channel"
    When I send a PATCH request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}" with json:
      """
      {
        "title": "New-Chat-title",
        "subType": "private",
        "signed": true
      }
      """
    Then the response code should be 200
    And the response should contain json:
      """
      {
        "title": "New-Chat-title",
        "subType": "private",
        "signed": true
      }
      """
    And Stomp queue "message.event.chat.updated" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CHANNEL}}",
        "title": "New-Chat-title",
        "subType": "private",
        "signed": true
      }]
      """

  Scenario: Delete channel
    Given I use DB fixture "channel"
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}" with json:
    """
    {
      "deleteForEveryone": true
    }
    """
    Then the response code should be 204
    And model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "deleted": true
      }
      """
    And Stomp queue "message.event.chat.deleted" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_CHANNEL}}",
        "deleted": true
      }]
      """

  Scenario: Join channel via inviteCode
    Given I use DB fixture "channel"
    When I send a POST request to "/api/invitations/XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT/join"
    Then print last response
    Then response status code should be 200
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*"
    }
    """

  Scenario: Invite and exclude member to channel
    Given I use DB fixture "channel"
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members/{{ID_OF_USER_2}}/include"
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_1}}"
          },
          {
            "user": "{{ID_OF_USER_2}}"
          }
        ]
      }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "messages.event.widget-data.member-included",
        "payload": {
          "chatId": "{{ID_OF_CHANNEL}}",
          "member":{
            "user":"{{ID_OF_USER_2}}"
          }
        }
      }]
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members/{{ID_OF_USER_1}}/exclude" with json:
      """
      {
      }
      """
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should not contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_2}}"
          }
        ],
        "removedMembers": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "messages.event.widget-data.member-excluded",
        "payload": {
          "chatId": "{{ID_OF_CHANNEL}}",
          "member":{
            "user":"{{ID_OF_USER_1}}"
          }
        }
      }]
      """
