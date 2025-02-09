Feature: Handle join user
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I create date and remember it as "now"
    Given I am watching for socket-io event "messages.ws-client.room.left"
    Given I am watching for socket-io event "messages.ws-client.room.joined"
    Given I am watching for socket-io event "messages.ws-client.chat.member.excluded"    
    Given I am watching for socket-io event "messages.ws-client.chat.online-members-updated"
    Given I am watching for socket-io event "messages.ws-client.message.posted"
    Given I generate an access token using the following data and remember it as "token_for_user_1":
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
    Given I generate an access token using the following data and remember it as "token_for_user_2":
      """
      {
        "id": "{{ID_OF_USER_2}}",
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
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "folder_chats"
        ],
        "result": []
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
            "count": 0
          }
        }
      }
      """
  
  Scenario: join user sockets with array chatIds
    # 1- join user 1 to chat
    Given I connect to socket.io namespace "chat" as "user1_client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with json:
      """
      ["{{ID_OF_CUSTOMER_CHAT}}","{{ID_OF_CUSTOMER_CHAT_2}}"]
      """
    Then I wait 100 ms while socket-io event is processed
   
    # 2- join user 2 to chat
    Given I connect to socket.io namespace "chat" as "user2_client" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with json:
      """
      ["{{ID_OF_CUSTOMER_CHAT}}","{{ID_OF_CUSTOMER_CHAT_2}}"]
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.room.joined" and remember as "memberJoined"
    And print storage key "memberJoined"
    Then stored value "memberJoined" should be equal to:
      """
      service:user:_id-of-another-existing-user
      """
    Then I disconnect all socket.io clients and wait 100 ms
  
  Scenario: join user sockets with one chatId
    # 1- join user 1 to chat
    Given I connect to socket.io namespace "chat" as "user1_client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with json:
      """
      "{{ID_OF_CUSTOMER_CHAT}}"
      """
    Then I wait 100 ms while socket-io event is processed
   
    # 2- join user 2 to chat
    Given I connect to socket.io namespace "chat" as "user2_client" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with json:
      """
      "{{ID_OF_CUSTOMER_CHAT}}"
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.room.joined" and remember as "memberJoined"
    And print storage key "memberJoined"
    Then stored value "memberJoined" should be equal to:
      """
      service:user:_id-of-another-existing-user
      """