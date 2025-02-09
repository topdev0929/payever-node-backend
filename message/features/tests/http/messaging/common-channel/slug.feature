Feature: Public channel slug
  Background: constants
    Given I use DB fixture "business"
    Given I use DB fixture "user"
    Given I use DB fixture "integrations"
    Given I use DB fixture "channel"
    Given I use DB fixture "channel-set"
    Given I load constants from "features/fixtures/const.ts"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_6}}",
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
    Given I mock Elasticsearch method "count" with:
      """
      {
        "arguments": [
          "folder_chats"
        ],
        "result": {
          "body": {
            "count": 50
          }
        }
      }
      """

  Scenario: Create new channel with slug
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel" with json:
      """
      {
        "title": "Channel-title",
        "subType": "public",
        "photo": "photo.png",
        "contacts": [],
        "slug": "new-slug-value",

        "parentFolderId": "{{ID_OF_FOLDER_1}}"
      }
      """
    Then print last response
    And response status code should be 201
    And response should contain json:
      """
      {
        "slug": "new-slug-value"
      }
      """

  Scenario: Update channel slug
    When I send a PATCH request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}" with json:
      """
      {
        "slug": "new-slug-value"
      }
      """
    Then print last response
    And response status code should be 200
    And response should contain json:
      """
      {
        "slug": "new-slug-value"
      }
      """
    And model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "slug": "new-slug-value"
      }
      """

  Scenario: Prevent creation with existing slug
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel" with json:
      """
      {
        "title": "Channel-title",
        "subType": "public",
        "photo": "photo.png",
        "contacts": [],
        "slug": "shop-sales-4",

        "parentFolderId": "{{ID_OF_FOLDER_1}}"
      }
      """
    Then print last response
    And response status code should be 400
    And response should contain json:
      """
      {
        "statusCode": 400,
        "message": "Channel with slug \"shop-sales-4\" exists"
      }
      """

  Scenario: Get public channel by slug
    When I send a GET request to "/api/public-channels/by-slug/shop-sales-4"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CHANNEL}}",
        "photo": "",
        "slug": "shop-sales-4",
        "title": "Public-channel"
      }
      """

  Scenario: Join to public channel using slug
    When I send a POST request to "/api/public-channels/by-slug/shop-sales-4/join"
    Then print last response
    And response status code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should contain json:
      """
      {
        "members": [{
          "user": "{{ID_OF_USER_6}}",
          "role": "member"
        }]
      }
      """
