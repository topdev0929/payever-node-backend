@folders
Feature: Chat folders
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
    
    Given I use DB fixture "user"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "customer-chats"
    Given I mock Elasticsearch method "singleIndex" with:
    """
     { "arguments": ["folder_chats"], "result": [] }
    """

  Scenario: Get chats folder tree
    Given I use DB fixture "folders"
    When I send a GET request to "/api/folders/business/{{ID_OF_EXISTING_BUSINESS}}/tree"
    Then print last response
    And response status code should be 200
    And response should contain json:
      """
      [
        {
          "_id": "c6e1daeb-fce5-449f-9279-ffac45dbf5ff",
          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "children": [],
          "scope": "business",
          "image": "whatsapp.png",
          "isFolder": true,
          "isHeadline": false,
          "isProtected": false,
          "name": "Whatsapp",
          "parentFolderId": "{{ID_OF_ROOT_FOLDER_1}}",
          "position": 0
        },
        {
          "_id": "{{ID_OF_FOLDER_2}}",
          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "children": [],
          "scope": "business",
          "image": "whatsapp.png",
          "isFolder": true,
          "isHeadline": false,
          "isProtected": false,
          "name": "Livechat",
          "parentFolderId": "{{ID_OF_ROOT_FOLDER_1}}",
          "position": 0
        }
      ]
      """

  Scenario: Get chats in folder    
    Given I use DB fixture "folders"
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "folder_chats"
        ]
      }
      """
    And I mock Elasticsearch method "count" with:
      """
      {
        "arguments": [
          "folder_chats"
         ]
      }
      """
    When I send a GET request to "/api/folders/business/{{ID_OF_EXISTING_BUSINESS}}/folder/{{ID_OF_FOLDER_1}}/documents"
    Then print last response
    And response status code should be 200
    And response should contain json:
      """
      {
        "collection": [],
        "filters": {},
        "pagination_data": {
          "page": 1,
          "total": 0
        },
        "usage": {}
      }
      """

  Scenario: Get tree structure for all available folders in all business & personal
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_7}}",
        "email": "user-7@payever.de",
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
    Given I use DB fixture "folders"
    When I send a GET request to "/api/message-folders/tree-all"
    Then print last response
    And response status code should be 200
    And response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_ROOT_FOLDER_FOR_USER_7}}",
          "name": "Personal",
          "isFolder": true,
          "scope": "user",
          "parentFolderId": null,
          "children": [
            {
              "_id": "{{ID_OF_FOLDER_7}}",
              "businessId": null,
              "children": [],
              "image": "facebook.png",
              "isFolder": true,
              "isHeadline": false,
              "isProtected": false,
              "name": "my folder",
              "parentFolderId": "{{ID_OF_ROOT_FOLDER_FOR_USER_7}}",
              "scope": "user"
            }
          ]
        },
        {
          "_id": "{{ID_OF_ROOT_FOLDER_1}}",
          "name": "business-number-one",
          "isFolder": true,
          "scope": "business",
          "parentFolderId": null,
          "position": 0,
          "children": [
            {
              "_id": "c6e1daeb-fce5-449f-9279-ffac45dbf5ff",
              "businessId": "_id-of-existing-business",
              "children": [],
              "image": "whatsapp.png",
              "isFolder": true,
              "isHeadline": false,
              "isProtected": false,
              "name": "Whatsapp",
              "parentFolderId": "{{ID_OF_ROOT_FOLDER_1}}",
              "position": 0,
              "scope": "business"
            },
            {
              "_id": "{{ID_OF_FOLDER_2}}",
              "businessId": "_id-of-existing-business",
              "children": [],
              "image": "whatsapp.png",
              "isFolder": true,
              "isHeadline": false,
              "isProtected": false,
              "name": "Livechat",
              "parentFolderId": "{{ID_OF_ROOT_FOLDER_1}}",
              "position": 0,
              "scope": "business"
            }
          ]
        },
        {
          "_id": "{{ID_OF_ROOT_FOLDER_2}}",
          "name": "business-2",
          "isFolder": true,
          "scope": "business",
          "parentFolderId": null,
          "position": 0,
          "children": [
            {
              "_id": "{{ID_OF_FOLDER_3}}",
              "businessId": "_id-of-business-2",
              "children": [],
              "image": "whatsapp.png",
              "isFolder": true,
              "isHeadline": false,
              "isProtected": false,
              "name": "business2-facebook",
              "parentFolderId": "{{ID_OF_ROOT_FOLDER_2}}",
              "scope": "business"
            },
            {
              "_id": "{{ID_OF_FOLDER_4}}",
              "businessId": "_id-of-business-2",
              "children": [],
              "image": "whatsapp.png",
              "isFolder": true,
              "isHeadline": false,
              "isProtected": false,
              "name": "business2-livechat",
              "parentFolderId": "{{ID_OF_ROOT_FOLDER_2}}",
              "scope": "business"
            }
          ]
        }
      ]
      """
    And response should not contain json:
      """
      [
        {
          "_id": "{{ID_OF_ROOT_FOLDER_3}}"
        }
      ]
      """
