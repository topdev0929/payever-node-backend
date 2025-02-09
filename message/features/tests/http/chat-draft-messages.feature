Feature: Draft Messages management
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "contactId" following value:
      """
      "3bddb299-8bb0-41e5-beeb-d23c1fd5ef37"
      """
    Given I remember as "chatId" following value:
      """
      "2ccbe226-f626-4f5c-8389-1710b71dba7a"
      """
    Given I remember as "contactDraftMessageId" following value:
      """
      "514ba77f-0325-46b6-86ac-536790701ca0"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{contactId}}",
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
          }
        ]
      }
      """
    Given I use DB fixture "business"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "draft-messages"

  Scenario: Create new draft message
    When I send a POST request to "/api/business/{{businessId}}/chats/{{chatId}}/messages/drafts" with json:
      """
      {
        "attachments": [],
        "content": "Draft text"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "chat": "{{chatId}}",
        "sender": "{{contactId}}",
        "content": "Draft text",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """
    And model "ChatDraftMessage" with id "{{response._id}}" should contain json:
      """
      {
        "attachments": []
      }
      """

  Scenario: Get drafts message for chat
    When I send a GET request to "/api/business/{{businessId}}/chats/{{chatId}}/messages/drafts"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{contactDraftMessageId}}"
      }]
      """

  Scenario: Update draft message
    When I send a PATCH request to "/api/business/{{businessId}}/chats/{{chatId}}/messages/drafts/{{contactDraftMessageId}}" with json:
      """
      {
        "content": "new draft message text"
      }
      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "content": "new draft message text"
      }
      """
    And model "ChatDraftMessage" with id "{{contactDraftMessageId}}" should contain json:
      """
      {
        "content": "new draft message text"
      }
      """

  Scenario: Delete draft message
    When I send a DELETE request to "/api/business/{{businessId}}/chats/{{chatId}}/messages/drafts/{{contactDraftMessageId}}"
    Then print last response
    And response status code should be 200
    And model "ChatDraftMessage" with id "{{contactDraftMessageId}}" should not exist
