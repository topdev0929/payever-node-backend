Feature: Integration Link

  Background: constants
    Given I use DB fixture "integrationlinks"
    Given I load constants from "features/fixtures/const.ts"
    Given I remember as "chatId" following value:
      """
      "8413cc30-3dc7-4790-bc55-9bca22646566"
      """
    Given I remember as "businessId" following value:
      """
      "_id-of-business-2"
      """
    Given I remember as "integrationLinkId" following value:
      """
      "_id-of-integraion-link-1"
      """

  Scenario: Create an integraion link with null data
    And I authenticate as a user with the following data:
      """
      {
        "id": " any id ",
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
    When I send a POST request to "/api/business/{{businessId}}/chats/undefined/integration-link" with json:
      """
      {}
      """
    Then print last response
    Then the response code should be 404
    
   
  Scenario: Create an integraion link
    And I authenticate as a user with the following data:
      """
      {
        "id": " any id ",
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
    When I send a POST request to "/api/business/{{businessId}}/chats/{{chatId}}/integration-link" with json:
      """
      {}
      """
    Then print last response
    Then the response code should be 201
    And the response should contain json:
      """
      {
        "_id": "{{integrationLinkId}}",
        "business": "{{businessId}}",
        "chat": "{{chatId}}",
      }
      """

  Scenario: Get integraion link data
    When I send a GET request to "/api/business/undefined/chats/{{integrationLinkId}}"
    Then print last response
    Then the response code should be 201
    And the response should contain json:
      """
      {
        "_id": "{{integrationLinkId}}",
        "business": "{{businessId}}",
        "chat": "{{chatId}}",
      }
      """
