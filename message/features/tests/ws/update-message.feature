Feature: Ws: update message
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I send flushall command to Redis
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I create date and remember it as "now"
    Given I generate an access token using the following data and remember it as "token_for_user_1":
      """
      {
        "id": "_id-of-existing-user",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "_id-of-existing-business",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
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

  Scenario: Update message
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_type":
      """
      test.type
      """
    Given I encrypt following value with salt "{{SALT}}" and remember as "encrypted_payload":
      """
      {"test-payload":true}
      """
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.message.update" with json:
      """
      {
        "content": "replaced-message-content",
        "contentType": "test.type",
        "contentPayload": {"test-payload":true},
        "_id": "{{ID_OF_USER_MESSAGE}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "content": "2f3ab41772cfbb81857899c21dbe030b3dc1e4e22af00290c67bc5292c053f18",
              "contentType": "{{encrypted_type}}",
              "contentPayload": "{{encrypted_payload}}",
              "editedAt": "*"
            }
          }
        }
      ]
      """

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-many",
          "filter": {
            "replyTo": "{{ID_OF_USER_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "replyToContent": "2f3ab41772cfbb81857899c21dbe030b3dc1e4e22af00290c67bc5292c053f18"
            }
          }
        }
      ]
      """
    
    And Stomp queue "message.event.message.updated" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "status": "sent",
        "content": "2f3ab41772cfbb81857899c21dbe030b3dc1e4e22af00290c67bc5292c053f18",

        "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
        "integrationName": "whatsapp"
      }]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Update message with mentions
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.message.update" with json:
      """
      {
        "content": "<@12345>, <@67890>",
        "_id": "{{ID_OF_USER_MESSAGE}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed
    
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "mentions": [
                "12345",
                "67890"
              ],
              "editedAt": "*"
            }
          }
        }
      ]
      """
      
    And Stomp queue "message.event.message.updated" should contain message with json body containing json:
      """
      [{
        "_id": "{{ID_OF_USER_MESSAGE}}",
        "status": "sent",
        "mentions": [
          "12345",
          "67890"
        ],

        "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
        "integrationName": "whatsapp"
      }]
      """
    Then I disconnect all socket.io clients and wait 100 ms
