Feature: Ws delete list message
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I send flushall command to Redis
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I am watching for socket-io event "error"
    Given I am watching for socket-io event "exception"
    Given I create date and remember it as "now"
    Given I generate an access token using the following data and remember it as "token_for_user_1":
      """
      {
        "id": "_id-of-existing-user",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "_id-of-existing-business",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """

  Scenario: Delete one message in list only for me
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.list.message.delete" with json:
      """
      {
        "_ids": [
          "{{ID_OF_USER_MESSAGE}}"
        ]
      }
      """
    Then I wait 10 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$push": {
              "deletedForUsers": "_id-of-existing-user"
            }
          }
        }
      ]
      """
    And Stomp queue "message.event.message.list.deleted" should contain message with json body containing json:
      """
      [
        [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "deletedForUsers": [
              "_id-of-existing-user"
            ],
            "status": "sent",
            "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
            "integrationName": "whatsapp"
          }
        ]
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Delete message list only for me
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.list.message.delete" with json:
      """
      {
        "_ids": [
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE_3}}"
        ]
      }
      """
    Then I wait 10 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$push": {
              "deletedForUsers": "_id-of-existing-user"
            }
          }
        }
      ]
      """
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_USER_MESSAGE_3}}",
            "type": "text"
          },
          "updateQuery": {
            "$push": {
              "deletedForUsers": "_id-of-existing-user"
            }
          }
        }
      ]
      """
    And Stomp queue "message.event.message.list.deleted" should contain message with json body containing json:
      """
      [
        [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "deletedForUsers": [
              "_id-of-existing-user"
            ],
            "status": "sent",
            "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
            "integrationName": "whatsapp"
          },
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "deletedForUsers": [
              "_id-of-existing-user"
            ],
            "status": "sent",
            "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
            "integrationName": "whatsapp"
          }
        ]
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Delete one message list only for me alerdy deleted
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.list.message.delete" with json:
      """
      {
        "_ids": [
          "{{ID_OF_USER_MESSAGE_2}}"
        ]
      }
      """
    Then I wait 10 ms while socket-io event is processed
    Then I look for last socket-io event "exception" and remember as "delete_event"
    And print storage key "delete_event"
    Then stored value "delete_event" should contain json:
      """
      {
        "status": 400
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Delete list message for everyone
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.list.message.delete" with json:
      """
      {
        "_ids": [
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE_3}}"
        ],
        "deleteForEveryone": true
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "status": "deleted"
            }
          }
        }
      ]
      """
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{ID_OF_USER_MESSAGE_3}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "status": "deleted"
            }
          }
        }
      ]
      """
    And Stomp queue "message.event.message.list.deleted" should contain message with json body containing json:
      """
      [
        [
          {
            "_id": "{{ID_OF_USER_MESSAGE}}",
            "status": "deleted",
            "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
            "integrationName": "whatsapp"
          },
          {
            "_id": "{{ID_OF_USER_MESSAGE_3}}",
            "status": "deleted",
            "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
            "integrationName": "whatsapp"
          }
        ]
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms
  Scenario: Delete list more than 30 messages.
    Given I use DB fixture "messages"
    When I emit socket-io event "messages.ws-client.list.message.delete" with json:
      """
      {
        "_ids": [
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}",
          "{{ID_OF_USER_MESSAGE}}"
        ],
        "deleteForEveryone": true
      }
      """
    Then I wait 100 ms while socket-io event is processed
    Then I look for last socket-io event "exception" and remember as "delete_event"
    And print storage key "delete_event"
    Then stored value "delete_event" should contain json:
      """
      {
        "status": 400
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms
