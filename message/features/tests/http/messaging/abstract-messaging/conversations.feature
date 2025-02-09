Feature: Http Conversations Http
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
    Given I use DB fixture "contacts" 
    Given I use DB fixture "user"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "channel"
    Given I use DB fixture "group"
    Given I use DB fixture "direct-chats"
    Given I use DB fixture "support-channel"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "folder_chats"
        ],
        "result": []
      }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "folder_chats"
        ],
        "result": {
          "body": {
            "hits": {
              "hits": [
                {
                  "_source": {
                    "mongoId": "68afc312-cca9-4459-bf6e-06f5ec7edbf5",
                    "serviceEntityId": "{{ID_OF_CUSTOMER_CHAT}}",
                    "parentFolderId": "{{ID_OF_FOLDER_1}}"
                  }
                },
                {
                  "_source": {
                    "mongoId": "a513d871-514d-4c27-b956-0260817ec177",
                    "serviceEntityId": "{{ID_OF_DIRECT_CHAT_2}}",
                    "parentFolderId": "{{ID_OF_FOLDER_1}}"
                  }
                },
                {
                  "_source": {
                    "mongoId": "d66d2f59-e814-4bc0-9533-0df379c43e8f",
                    "serviceEntityId": "{{ID_OF_CHANNEL}}",
                    "parentFolderId": "{{ID_OF_FOLDER_1}}"
                  }
                },
                {
                  "_source": {
                    "mongoId": "fdb61112-e958-45ae-a5c4-c181fd002e21",
                    "serviceEntityId": "{{ID_OF_CHANNEL_2}}",
                    "parentFolderId": "{{ID_OF_FOLDER_1}}"
                  }
                },
                {
                  "_source": {
                    "mongoId": "bf5aef89-9cfd-420b-856b-2894159587a6",
                    "serviceEntityId": "{{ID_OF_CHANNEL_3}}",
                    "parentFolderId": "{{ID_OF_FOLDER_1}}"
                  }
                },
                {
                  "_source": {
                    "mongoId": "4ba9978a-e6fd-407e-b1a7-ecf9c6b304f5",
                    "serviceEntityId": "{{ID_OF_GROUP_1}}",
                    "parentFolderId": "{{ID_OF_FOLDER_1}}"
                  }
                },
                {
                  "_source": {
                    "mongoId": "314ea6e3-bbe5-43e7-b0c7-ca94a1e9636b",
                    "serviceEntityId": "{{ID_OF_GROUP_2}}",
                    "parentFolderId": "{{ID_OF_FOLDER_1}}"
                  }
                }
              ],
              "total": {}
            }
          }
        }
      }
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

  Scenario: Find all conversations of business
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging"
    Then print last response
    And the response code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_CUSTOMER_CHAT}}",
          "contact":{
            "_id":  "{{ID_OF_CONTACT}}"
          },
          "integrationName": "whatsapp",
          "title": "Title of chat",
          "messages": [],
          "type": "chat"
        },
        {
          "_id": "{{ID_OF_CHANNEL}}",
          "subType": "public",
          "title": "Public-channel",
          "type": "channel"
        }
      ]
      """

  Scenario: Find all converstion of non-business

  Scenario: Find all conversations in folder
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging"
    Then print last response
    And the response code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_CUSTOMER_CHAT}}",
          "contact":{
            "_id":  "{{ID_OF_CONTACT}}"
          },
          "integrationName": "whatsapp",
          "title": "Title of chat",
          "messages": [],
          "type": "chat",
          "locations": [
            {
              "_id": "68afc312-cca9-4459-bf6e-06f5ec7edbf5",
              "folderId": "{{ID_OF_FOLDER_1}}"
            }
          ]
        },
        {
          "_id": "{{ID_OF_CHANNEL}}",
          "subType": "public",
          "title": "Public-channel",
          "type": "channel",
          "locations": [
            {
              "_id": "d66d2f59-e814-4bc0-9533-0df379c43e8f",
              "folderId": "{{ID_OF_FOLDER_1}}"
            }
          ]
        }
      ]
      """

  Scenario: Get conversation by Id
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/chat/{{ID_OF_CUSTOMER_CHAT}}"
    Then print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "contact":{
            "_id":  "{{ID_OF_CONTACT}}"
        },
        "title": "Title of chat",
        "messages": []
      }
      """

  Scenario: Invite and exclude member of conversation
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/conversations/{{ID_OF_GROUP_1}}/notification/disable" with json:
      """
      {
        "until": "2025-01-01T12:30:41.018Z"
      }
      """
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "members": [
          {
            "notificationDisabledUntil": "2025-01-01T12:30:41.018Z",
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/conversations/{{ID_OF_GROUP_1}}/notification/enable"
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "members": [
          {
            "notificationDisabledUntil": null,
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """

  Scenario: Invite and exclude member of conversation
    When I send a POST request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/conversations/{{ID_OF_GROUP_1}}/notification/disable" with json:
      """
      {
        "forever": true
      }
      """
    Then print last response
    And the response code should be 200
    And model "AbstractMessaging" with id "{{ID_OF_GROUP_1}}" should contain json:
      """
      {
        "members": [
          {
            "notificationDisabledUntil": "+275760-09-13T00:00:00.000Z",
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """

  Scenario: Find all conversations of all available business
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
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging?allBusiness=true"
    And the response code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_CUSTOMER_CHAT}}"
        },
        {
          "_id": "{{ID_OF_CUSTOMER_CHAT_2}}"
        },
        {
          "_id": "{{ID_OF_CUSTOMER_CHAT_3}}"
        },
        {
          "_id": "{{ID_OF_CUSTOMER_CHAT_4}}"
        },
        {
          "_id": "{{ID_OF_CHANNEL_2}}"
        },
        {
          "_id": "{{ID_OF_DIRECT_CHAT}}"
        },
        {
          "_id": "{{ID_OF_DIRECT_CHAT_4}}"
        },
        {
          "_id": "{{ID_OF_GROUP_1}}"
        },
        {
          "_id": "{{ID_OF_GROUP_3}}"
        },
        {
          "_id": "{{ID_OF_SUPPORT_CHANNEL_1}}"
        }
      ]
      """

    And the response should not contain json:
      """
      [
        {
          "_id": "{{ID_OF_CHANNEL}}"
        },
        {
          "_id": "{{ID_OF_CHANNEL_3}}"
        },
        {
          "_id": "{{ID_OF_DIRECT_CHAT_3}}"
        },
        {
          "_id": "{{ID_OF_DIRECT_CHAT_2}}"
        },
        {
          "_id": "{{ID_OF_CHANNEL}}"
        },
        {
          "_id": "{{ID_OF_GROUP_2}}"
        }
      ]
      """

  Scenario: Find all messagings of all businesses (business count = 1000)
    Given I use DB fixture "user-with-many-businesses"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging?allBusiness=true&limit=10&page=1"
    And the response code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "chat-for-business-999"
        },
        {
          "_id": "chat-for-business-998"
        },
        {
          "_id": "chat-for-business-997"
        },
        {
          "_id": "chat-for-business-996"
        }
      ]
      """

    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging?allBusiness=true&limit=10&page=100"
    And the response code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "chat-for-business-2"
        },
        {
          "_id": "chat-for-business-1"
        },
        {
          "_id": "chat-for-business-0"
        }
      ]
      """
