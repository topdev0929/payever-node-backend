Feature: Http Channel Http
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "user"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "channel-set"
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
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

  Scenario: Create new integration channel
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/integration-channel" with json:
      """
      {
        "title": "Integration channel",
        "subType": "public",
        "description": "integration channel description",
        "photo": "logo.png"
      }
      """
    Then print last response
    And response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "title": "Integration channel",
        "description": "integration channel description",
        "photo": "logo.png",
        "messages": []
      }
      """

  Scenario: Update integration channel
    Given I use DB fixture "integration-channels"
    When I send a PATCH request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/integration-channel/{{ID_OF_INTEGRATION_CHANNEL_1}}" with json:
      """
      {
        "usedInWidget": true
      }
      """
    Then print last response
    And I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "usedInWidget": true
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_INTEGRATION_CHANNEL_1}}" should contain json:
      """
      {
        "usedInWidget": true
      }
      """

  Scenario: Get integration channel by Id
    Given I am not authenticated
    Given I use DB fixture "integration-channels"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/integration-channels/{{ID_OF_INTEGRATION_CHANNEL_1}}"
    Then print last response
    And I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_INTEGRATION_CHANNEL_1}}",
        "title": "Public integration channel",
        "description": "",
        "messages": []
      }
      """
