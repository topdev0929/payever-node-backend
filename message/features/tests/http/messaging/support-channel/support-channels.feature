Feature: Http Support Channel
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I load constants from "src/common/enums/internal-events.enum.ts"
    Given I load constants from "node_modules/@pe/folders-plugin/dist/src/enums/folders-events.enum.js"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_SUPPORT_USER_1}}",
        "email": "support@payever.de",
        "firstName": "Merchant",
        "lastName": "Support",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Create new support channel
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    When I send a POST request to "/api/admin/support-channels" with json:
      """
      {
        "title": "Merchant onboarding support channel"
      }
      """
    Then print last response
    And response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "business": null,
        "description": "",
        "messages": [],
        "photo": "",
        "signed": false,
        "title": "Merchant onboarding support channel"
      }
      """
    And model "AbstractMessaging" with id "{{response._id}}" should contain json:
      """
      {
        "_id": "{{response._id}}",
        "title": "Merchant onboarding support channel"
      }
      """

  Scenario: Update existing support channel
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [ "folder_chats" ],
        "result": { "body": { "hits": { "hits": [ {
          "_source": {
            "mongoId": "68afc312-cca9-4459-bf6e-06f5ec7edbf5",
            "serviceEntityId": "{{ID_OF_SUPPORT_CHANNEL_1}}",
            "parentFolderId": "{{ID_OF_FOLDER_1}}"
          }
        }]}}}
      }
      """
    Given I use DB fixture "support-channel"
    When I send a PATCH request to "/api/admin/support-channels/{{ID_OF_SUPPORT_CHANNEL_1}}" with json:
      """
      {
        "title": "Merchant sales channel"
      }
      """
    And print last response
    And response status code should be 200
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "title": "Merchant sales channel"
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_SUPPORT_CHANNEL_1}}" should contain json:
      """
      {
        "_id": "{{response._id}}",
        "title": "Merchant sales channel"
      }
      """
