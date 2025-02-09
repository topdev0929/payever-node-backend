Feature: Owner creates a channel, should not include employees

  Background:
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "user"
    Given I use DB fixture "business"
    Given I use DB fixture "channel-set"
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
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """

  Scenario: Owner creates a channel, should not include employees
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ SOME_OWNER_ID }}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ OWNERS_BUSINESS_ID }}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{ OWNERS_BUSINESS_ID }}/messaging/channel" with json:
      """
      {
        "title": "COMPANY",
        "subType": "public",
        "photo": "photo.png",
        "contacts": [],
        "parentFolderId": "{{ ID_OF_ROOT_FOLDER_1 }}"
      }
      """
    Then print last response
    And response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "title": "COMPANY",
        "integrationName": "internal"
      }
      """
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "messages.event.channel.create",
        "payload": {
          "channel": {
            "_id": "{{ response._id }}",
            "business": "{{ OWNERS_BUSINESS_ID }}",
            "type": "channel",
            "members": [{
              "addMethod": "owner",
              "addedBy": "{{ SOME_OWNER_ID }}",
              "role": "admin",
              "user": "{{ SOME_OWNER_ID }}",
              "createdAt": "*",
              "updatedAt": "*"
            }],
            "removedMembers": []
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_message_micro" channel
    And I authenticate as a user with the following data:
      """
      {
        "id": "{{ SOME_EMPLOYEE_ID }}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ OWNERS_BUSINESS_ID }}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/business/{{ OWNERS_BUSINESS_ID }}/messaging"
    Then print last response
    And the response code should be 200
    And I store a response as "response"
    And the response should not contain json:
      """
      [
        {
          "members": [
            {
              "addMethod": "initial",
              "addedBy": "{{ SOME_OWNER_ID }}",
              "role": "member",
              "user": "{{ SOME_EMPLOYEE_ID }}",
              "createdAt": "*",
              "updatedAt": "*"
            }
          ]
        }
      ]
      """
      