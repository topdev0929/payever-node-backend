Feature: Messaging members
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
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "user"

  Scenario: Get members of direct chat
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}/members"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      [{
        "user": {
          "_id": "{{ID_OF_USER_1}}"
        }
      }, {
        "user": {
          "_id": "{{ID_OF_USER_2}}"
        }
      }]
      """

  Scenario: Get members of foreign group chat
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}/members"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      [
        {
          "user": {
            "_id": "{{ID_OF_USER_1}}"
          }
        },
        {
          "user": {
            "_id": "{{ID_OF_USER_2}}"
          }
        }
      ]
      """
