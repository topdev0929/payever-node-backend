Feature: Filter messaging according to type & user access
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
    Given I use DB fixture "messaging-filter"
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "folder_chats"
        ],
        "result": []
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "folder_chats"
        ],
        "result": []
      }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "folder_chats"
        ],
        "result": {
          "body": {
            "hits": {
              "hits": []
            }
          }
        }
      }
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
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """

  Scenario: Chat with integration is visible to all business member (user in same business)
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/id_01"
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should contain json:
      """
      {
        "_id": "id_01"
      }
      """

  Scenario: Chat with integration is visible to all business member (user in other business)
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/id_02"
    Then I store a response as "response"
    And the response code should be 404

  Scenario: Chat with integration is visible to all business member (integration is empty)
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/id_03"
    Then I store a response as "response"
    And the response code should be 404

  Scenario: Public channel (member left)
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/channel_01"
    And the response code should be 404

  Scenario: Private channel (member left)
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/channel_02"
    And the response code should be 404

  Scenario: Public channel (member exist)
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/channel_03"
    And the response code should be 200
    And print last response
    And the response should contain json:
      """
      {
        "_id": "channel_03"
      }
      """

  Scenario: Private channel (member exist)
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/channel_04"
    And the response code should be 200
    And print last response
    And the response should contain json:
      """
      {
        "_id": "channel_04"
      }
      """

  Scenario: Public channel (member invited)
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_2}}",
        "email": "user2@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ID_OF_ANOTHER_EXISTING_BUSINESS}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/business/{{ID_OF_ANOTHER_EXISTING_BUSINESS}}/messaging/channel/channel_05"
    And print last response
    And the response code should be 200

    When I send a GET request to "/api/business/{{ID_OF_ANOTHER_EXISTING_BUSINESS}}/messaging/channel/channel_05/members"
    Then response status code should be 200
    And the response should contain json:
      """
      [
        {
          "user": {
            "_id": "_id-of-another-existing-user"
          }
        }
      ]
      """

  Scenario: Chat with livechat integration is visible to all business member (user in same business)
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/live-chat-01"
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should contain json:
      """
      {
        "_id": "live-chat-01"
      }
      """