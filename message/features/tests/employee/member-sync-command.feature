Feature: Owner with a channel have an employee registered and employee doesnt have access to the channel, we call the members:sync command

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
  Scenario: Owner with a channel invites an employee, after confirmation, employee must have not access to owner's channels
    And I authenticate as a user with the following data:
      """
      {
        "id": "{{ SOME_EMPLOYEE_ID }}",
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
    When I send a GET request to "/api/business/{{ OWNERS_BUSINESS_ID }}/messaging"
    Then print last response
    And the response code should be 200
    And I store a response as "response"
    And the response should not contain json:
      """
      [
        {
          "members": [
            {
              "addMethod": "initial",
              "addedBy": "{{ SOME_OWNER_ID }}",
              "role": "member",
              "user": "{{ SOME_EMPLOYEE_ID }}",
              "createdAt": "*",
              "updatedAt": "*"
            }
          ]
        }
      ]
      """
      