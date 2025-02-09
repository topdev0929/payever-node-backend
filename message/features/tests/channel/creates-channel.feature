Feature: Creates a channel

  Background:
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "user"
    Given I use DB fixture "business"
    Given I use DB fixture "channel-set"
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
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """

  Scenario: Creates a channel
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ SOME_OWNER_ID }}",
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
    When I send a POST request to "/api/business/{{ OWNERS_BUSINESS_ID }}/messaging/channel" with json:
      """
      {
        "title": "COMPANY",
        "subType": "public",
        "photo": "photo.png",
        "contacts": [],
        "parentFolderId": "{{ ID_OF_ROOT_FOLDER_1 }}"
      }
      """
    Then print last response
    And response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "title": "COMPANY",
        "integrationName": "internal"
      }
      """
  Scenario: Creates a channel - channel name with space
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ SOME_OWNER_ID }}",
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
    When I send a POST request to "/api/business/{{ OWNERS_BUSINESS_ID }}/messaging/channel" with json:
      """
      {
        "title": "COMPANY TEST",
        "subType": "public",
        "photo": "photo.png",
        "contacts": [],
        "parentFolderId": "{{ ID_OF_ROOT_FOLDER_1 }}"
      }
      """
    Then print last response
    And response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "title": "COMPANY TEST",
        "integrationName": "internal"
      }
      """
  Scenario: Creates a channel - channel name with last and first space
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ SOME_OWNER_ID }}",
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
    When I send a POST request to "/api/business/{{ OWNERS_BUSINESS_ID }}/messaging/channel" with json:
      """
      {
        "title": "  COMPANY TEST  ",
        "subType": "public",
        "photo": "photo.png",
        "contacts": [],
        "parentFolderId": "{{ ID_OF_ROOT_FOLDER_1 }}"
      }
      """
    Then print last response
    And response status code should be 201
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "_id": "*",
        "title": "COMPANY TEST",
        "integrationName": "internal"
      }
      """
  Scenario: Creates a channel - channel name just space
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ SOME_OWNER_ID }}",
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
    When I send a POST request to "/api/business/{{ OWNERS_BUSINESS_ID }}/messaging/channel" with json:
      """
      {
        "title": "   ",
        "subType": "public",
        "photo": "photo.png",
        "contacts": [],
        "parentFolderId": "{{ ID_OF_ROOT_FOLDER_1 }}"
      }
      """
    Then print last response
    And response status code should be 400
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "message": "Title should not have white spaces",
        "error": "Bad Request"
      }
      """
   