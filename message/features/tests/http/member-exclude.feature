Feature: Leave messaging
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I create date and remember it as "now"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
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
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """

  Scenario: exclude member
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
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}/members/{{ID_OF_USER_1}}/exclude"
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should not contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """

