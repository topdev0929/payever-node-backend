Feature: Http App Channel Http
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
    Given I use DB fixture "template"
    Given I use DB fixture "app-channel"
    Given I use DB fixture "user"
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

  Scenario: Get app channel by appName
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/app-channel/by-name/shop"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CHANNEL}}",
        "app": "shop",
        "messages": [],
        "title": "payever Shop Bot"
      }
      """
