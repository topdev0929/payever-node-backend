Feature: Ws online members
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"

    Given I create date and remember it as "now"
    Given I create date and remember it as "then"
    Given I am watching for socket-io event "messages.ws-client.chat.online-members-updated"
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
    Given I generate an access token using the following data and remember it as "token_for_user_2":
      """
      {
        "id": "_id-of-another-existing-user",
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
      { "arguments": ["messages"], "result": [] }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["messages"], "result": [] }
      """

  Scenario: Update online members on join chat
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData"
    And print storage key "onlineMembersUpdateEventData"
    Then stored value "onlineMembersUpdateEventData" should contain json:
      """
      {
        "onlineMembers": [
          {
            "user": "{{ID_OF_USER_1}}",
            "userAccount": {
              "email": "john@example.com",
              "firstName": "John",
              "lastName": "Doe",
              "logo": "john.png",
              "phone": "+394233123"
            }
          }
        ],
        "onlineMembersCount": 1
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Update online status on join chat (handle duplicate event)
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 1000 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 1000 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 1000 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 1000 ms while socket-io event is processed
    
    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData"
    And print storage key "onlineMembersUpdateEventData"
    Then stored value "onlineMembersUpdateEventData" should contain json:
      """
      {
        "onlineMembers": [
          {
            "user": "{{ID_OF_USER_1}}",
            "userAccount": {
              "email": "john@example.com",
              "firstName": "John",
              "lastName": "Doe",
              "logo": "john.png",
              "phone": "+394233123"
            }
          }
        ],
        "onlineMembersCount": 1
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Update online status on leave chat
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.chat-room.leave" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData"
    And print storage key "onlineMembersUpdateEventData"
    Then stored value "onlineMembersUpdateEventData" should contain json:
      """
      {
        "onlineMembers": [],
        "onlineMembersCount": 0
      }
      """
    Then stored value "onlineMembersUpdateEventData" should not contain json:
      """
      {
        "onlineMembers": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Update online status on disconnect chat
    Given I connect to socket.io namespace "chat" as "s4-first-client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed
        
    # connect another client to receive online member update
    Then I connect to socket.io namespace "chat" as "second-session" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

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

    When I disconnect client "s4-first-client" from socket-io 
    Then I wait 100 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData"
    And print storage key "onlineMembersUpdateEventData"
    Then stored value "onlineMembersUpdateEventData" should contain json:
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
    Then stored value "onlineMembersUpdateEventData" should not contain json:
      """
      {
        "onlineMembers": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Join chat from multiple locations 
    # connect first session
    Then I connect to socket.io namespace "chat" as "first-session" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

  
    # connect second session
    Then I connect to socket.io namespace "chat" as "second-session" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed


    # connect third session
    Then I connect to socket.io namespace "chat" as "third-session" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed


    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData"
    And print storage key "onlineMembersUpdateEventData"
    Then stored value "onlineMembersUpdateEventData" should contain json:
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

    When I disconnect client "second-session" from socket-io 
    Then I wait 100 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData"
    And print storage key "onlineMembersUpdateEventData"
    Then stored value "onlineMembersUpdateEventData" should contain json:
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
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Update online members with different users
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    Given I connect to socket.io namespace "chat" as "second-user" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    Then I wait 1000 ms while socket-io event is processed
    Then I switch to socket-io client "second-user"
    Then I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.chat.online-members-updated" and remember as "onlineMembersUpdateEventData"
    And print storage key "onlineMembersUpdateEventData"
    Then stored value "onlineMembersUpdateEventData" should contain json:
      """
      {
        "onlineMembers": [
          {
            "user": "{{ID_OF_USER_1}}",
            "userAccount": {
              "email": "john@example.com",
              "firstName": "John",
              "lastName": "Doe",
              "logo": "john.png",
              "phone": "+394233123"
            }
          }
        ],
        "onlineMembersCount": 2
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Offline user wher removed
    Then I disconnect all socket.io clients and wait 100 ms
