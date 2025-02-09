Feature: Pinned messages feature
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
    Given I use DB fixture "contacts"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "messages"

  Scenario: Get pinned messages
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/chats/{{ID_OF_CUSTOMER_CHAT}}/pinned-messages"
    Then print last response
    And the response code should be 200
    And I store a response as "response"
    And the response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_CONTACT_MESSAGE}}",
          "attachments": [],
          "chat": "{{ID_OF_CUSTOMER_CHAT}}",
          "content": "{{DECRYPTED_CONTENT}}",
          "deletedForUsers": [],
          "mentions": [],
          "readBy": [],
          "sender": "{{ID_OF_CONTACT}}",
          "status": "sent",
          "type": "text",
          "pinId": "{{ID_OF_PIN}}"
        }
      ]
      """
    And the response should not contain json:
      """
      [
        {
          "_id": "id-of-user-message-deleted-for-user-1"
        }
      ]
      """
