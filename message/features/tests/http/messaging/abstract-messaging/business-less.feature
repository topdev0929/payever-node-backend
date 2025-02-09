Feature: Business-less user access
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I send flushall command to Redis
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_6}}",
        "email": "john.smith@example.com",
        "firstName": "John",
        "lastName": "Smith",
        "roles": [
          {
            "permissions": [],
            "name": "user",
            "applications": []
          }
        ]
      }
      """
    Given I use DB fixture "business"
    Given I use DB fixture "user"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "channel"
    Given I use DB fixture "group"
    Given I use DB fixture "direct-chats"

    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": ["folder_chats"],
        "result": {
          "body": { "hits": {
            "hits": [
              {
                "_source": {
                  "mongoId": "68afc312-cca9-4459-bf6e-06f5ec7edbf5",
                  "serviceEntityId": "{{ID_OF_CUSTOMER_CHAT}}",
                  "parentFolderId": "{{ID_OF_FOLDER_1}}"
                }
              }, {
                "_source": {
                  "mongoId": "a513d871-514d-4c27-b956-0260817ec177",
                  "serviceEntityId": "{{ID_OF_DIRECT_CHAT_2}}",
                  "parentFolderId": "{{ID_OF_FOLDER_1}}"
                }
              }, {
                "_source": {
                  "mongoId": "d66d2f59-e814-4bc0-9533-0df379c43e8f",
                  "serviceEntityId": "{{ID_OF_CHANNEL}}",
                  "parentFolderId": "{{ID_OF_FOLDER_1}}"
                }
              }, {
                "_source": {
                  "mongoId": "fdb61112-e958-45ae-a5c4-c181fd002e21",
                  "serviceEntityId": "{{ID_OF_CHANNEL_2}}",
                  "parentFolderId": "{{ID_OF_FOLDER_1}}"
                }
              }, {
                "_source": {
                  "mongoId": "bf5aef89-9cfd-420b-856b-2894159587a6",
                  "serviceEntityId": "{{ID_OF_CHANNEL_3}}",
                  "parentFolderId": "{{ID_OF_FOLDER_1}}"
                }
              }, {
                "_source": {
                  "mongoId": "4ba9978a-e6fd-407e-b1a7-ecf9c6b304f5",
                  "serviceEntityId": "{{ID_OF_GROUP_1}}",
                  "parentFolderId": "{{ID_OF_FOLDER_1}}"
                }
              }, {
                "_source": {
                  "mongoId": "314ea6e3-bbe5-43e7-b0c7-ca94a1e9636b",
                  "serviceEntityId": "{{ID_OF_GROUP_2}}",
                  "parentFolderId": "{{ID_OF_FOLDER_1}}"
                }
              }
            ],
            "total": {

            }
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

  Scenario: Find all available messaging
    When I send a GET request to "/api/business/--any-value--/messaging"
    Then print last response
    And the response code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_DIRECT_CHAT_3}}",
          "type": "direct-chat",
          "members": [
            {
              "user": {
                "_id": "{{ID_OF_USER_6}}"
              }
            },
            {
              "user": {
                "_id": "{{ID_OF_USER_2}}"
              }
            }
          ],
          "createdAt": "*"
        },
        {
          "_id": "{{ID_OF_GROUP_2}}",
          "type": "group",
          "members": [
            {
              "user": {
                "_id": "{{ID_OF_USER_3}}"
              }
            },
            {
              "user": {
                "_id": "{{ID_OF_USER_6}}"
              }
            }
          ],
          "createdAt": "*"
        },
        {
          "_id": "{{ID_OF_CHANNEL}}",
          "type": "channel",
          "members": [
            {
              "user": {
                "_id": "{{ID_OF_USER_6}}"
              }
            }
          ],
          "messages": [
            {
              "_id": "{{ID_OF_CONTACT_MESSAGE}}",
              "sender": "*"
            }
          ],
          "createdAt": "*"
        }
      ]
      """