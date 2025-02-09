Feature: Populate last messages objects
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

  Scenario: Find all chats of business    
    Given I use DB fixture "customer-chats"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging"
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_CUSTOMER_CHAT}}",
          "contact": {
            "_id": "{{ID_OF_CONTACT}}"
          },
          "title": "Title of chat",
          "messages": [
           {
              "_id": "{{ID_OF_EVENT_MESSAGE_1}}",
              "eventName": "include-member",
              "data": {
                "includedById": "{{ID_OF_USER_1}}",
                "includedBy": {
                  "user": "{{ID_OF_USER_1}}",
                  "userAccount": {
                    "email": "john@example.com",
                    "firstName": "John",
                    "lastName": "Doe",
                    "logo": "john.png",
                    "phone": "+394233123"
                  }
                },
                "includedUserId": "{{ID_OF_USER_4}}",
                "includedUser": {
                  "user": "{{ID_OF_USER_4}}",
                  "userAccount": {
                    "email": "reza@example.com",
                    "firstName": "Reza",
                    "lastName": "Gh",
                    "logo": "reza.png",
                    "phone": "+984342"
                  }
                }
              }
            },
            {
              "_id": "{{ID_OF_EVENT_MESSAGE_2}}",
              "eventName": "exclude-member",
              "data": {
                "excludedById": "{{ID_OF_USER_1}}",
                "excludedBy": {
                  "user": "{{ID_OF_USER_1}}",
                  "userAccount": {
                    "email": "john@example.com",
                    "firstName": "John",
                    "lastName": "Doe",
                    "logo": "john.png",
                    "phone": "+394233123"
                  }
                },
                "excludedUserId": "{{ID_OF_USER_2}}",
                "excludedUser": {
                  "user": "{{ID_OF_USER_2}}",
                  "userAccount": {
                    "email": "sam@example.com",
                    "firstName": "Sam",
                    "lastName": "Smith",
                    "logo": "sam.png",
                    "phone": "+15551234567"
                  }
                }
              }
            }
          ]
        }
      ]
      """
