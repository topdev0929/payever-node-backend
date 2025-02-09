Feature: Last messages filler
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I send flushall command to Redis
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_CONTACT}}",
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
    Given I use DB fixture "contacts"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "messages"
    Given I use DB fixture "user"
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

  Scenario: Add last message
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_type":
      """
      test.type
      """
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_payload":
      """
      {"test-payload":true}
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages" with json:
      """
      {
        "content": "new-message-content",
        "contentType": "test.type",
        "contentPayload": {"test-payload":true},
        "type": "text",
        "sentAt": "{{now}}"
      }
      """
    Then print last response
    And the response code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "content": "*",
        "sender": "{{ID_OF_CONTACT}}"
      }
      """

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
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    And print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "messages": [
          {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "sender": "{{ID_OF_CONTACT}}"
          },
          {
            "_id": "{{response._id}}",
            "content": "new-message-content",
            "contentType": "test.type",
            "contentPayload": {"test-payload":true},
            "sender": "{{ID_OF_CONTACT}}"
          }
        ]
      }
      """

  Scenario: Replace last mesage
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_type":
      """
      test.type
      """
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_payload":
      """
      {"test-payload":true}
      """
    When I send a PATCH request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages/{{ID_OF_CONTACT_MESSAGE}}" with json:
      """
      {
        "content": "replaced-message-content",
        "contentType": "test.type",
        "contentPayload": {"test-payload": true}
      }
      """
    Then the response code should be 200
    And print last response
    And I store a response as "response"

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "content": "2f3ab41772cfbb81857899c21dbe030b3dc1e4e22af00290c67bc5292c053f18",
              "editedAt": "*"
            }
          }
        }
      ]
      """

  Scenario: Delete last message
    When I send a DELETE request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/messages/{{ID_OF_CONTACT_MESSAGE}}" with json:
      """
      {
        "deleteForEveryone": true
      }
      """
    Then the response code should be 204
    And print last response
    And I store a response as "response"

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
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    Then I store a response as "response"
    And the response code should be 200
    And print last response
    And the response should not contain json:
      """
      {
        "messages": [
          {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}"
          }
        ]
      }
      """
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_CONTACT_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "status": "deleted"
            }
          }
        }
      ]
      """
