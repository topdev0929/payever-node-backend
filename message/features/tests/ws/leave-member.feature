Feature: Handle exclude user
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
  
  Scenario: Force leave sockets on exclude user
    # 1- join user 1 to chat
    Given I connect to socket.io namespace "chat" as "user1_client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
   
    # 2- join user 2 to chat
    Given I connect to socket.io namespace "chat" as "user2_client" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    # 3- check online users
    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData"
    And print storage key "onlineMembersUpdateEventData"
    Then stored value "onlineMembersUpdateEventData" should contain json:
      """
      {
        "onlineMembers": [
          {
            "user": "{{ID_OF_USER_1}}"
          },
          {
            "user": "{{ID_OF_USER_2}}"
          }
        ],
        "onlineMembersCount": 2
      }
      """

    # 4- exclude user 1 from chat
    Then I emit socket-io event "messages.ws-client.chat.leave-member" from client "user1_client" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
   
    # 5- online members shoule be updated
    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData2"
    And print storage key "onlineMembersUpdateEventData2"
    Then stored value "onlineMembersUpdateEventData2" should contain json:
      """
      {
        "onlineMembers": [
          {
            "user": "{{ID_OF_USER_2}}"
          }
        ],
        "onlineMembersCount": 1
      }
      """

    # 6- left event should be emitted
    Then socket-io event "messages.ws-client.chat.member.excluded" should not be emitted
    Then I look for last socket-io event "messages.ws-client.room.left" and remember as "left_event_data"
    And print storage key "left_event_data"
    Then stored value "left_event_data" should contain json:
      """
      {
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "user": {
          "_id": "{{ID_OF_USER_1}}"
        }
      }
      """
    
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Prevent receiving chat messages after excluded
    # 1- connect user 1
    Given I connect to socket.io namespace "chat" as "user1_client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    # 2- connect user 2
    Given I connect to socket.io namespace "chat" as "user2_client" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    # 3- receive message from chat
    And I emit socket-io event "messages.ws-client.message.send" from client "user1_client" with json:
      """
      {
        "_id": "{{ID_OF_CONTACT_MESSAGE}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "content": "content-1",
        "sentAt": "{{now}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.message.posted" and remember as "message1_event_data"
    And print storage key "message1_event_data"
    Then stored value "message1_event_data" should contain json:
      """
      {
         "_id": "{{ID_OF_CONTACT_MESSAGE}}",
         "chat": "{{ID_OF_CUSTOMER_CHAT}}"
       }
      """
    
    # 4- exclude user 2 from chat
    Then I emit socket-io event "messages.ws-client.chat.leave-member" with:
      """
     {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 500 ms while socket-io event is processed

    # 5- client 2 should not receive message from chat
    And I emit socket-io event "messages.ws-client.message.send" from client "user1_client" with json:
      """
      {
        "_id": "{{ID_OF_CONTACT_MESSAGE_2}}",
        "chat": "{{ID_OF_CUSTOMER_CHAT}}",
        "content": "content-1",
        "sentAt": "{{now}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.message.posted" and remember as "message2_event_data"
    And print storage key "message2_event_data"
    Then stored value "message2_event_data" should not contain json:
      """
      {
        "_id": "{{ID_OF_CONTACT_MESSAGE_2}}"
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Remove member from chat    
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
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should contain json:
      """
      {
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "members":[
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """

    # 1- join user 1 to chat
    Given I connect to socket.io namespace "chat" as "user1_client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
   
    # 2- leave chat
    Then I emit socket-io event "messages.ws-client.chat.leave-member" from client "user1_client" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    # 3 - user 1 should not exist in chat members 
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should not contain json:
      """
      {
        "members": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """

    # 5 - chat should not appear in messaging list
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging"
    And print last response
    And the response should contain json:
      """
      [
        {
          "_id": "{{ID_OF_CUSTOMER_CHAT}}"
        }
      ]
      """
    Then I disconnect all socket.io clients and wait 100 ms

    # 6 - should send exclude event
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "messages.event.widget-data.member-excluded",
        "payload": {
          "chatId": "{{ID_OF_CUSTOMER_CHAT}}",          
          "member":{
            "user":"{{ID_OF_USER_1}}"
          }
        }
      }]
      """
