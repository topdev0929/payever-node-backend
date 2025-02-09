Feature: Ws typing members feature
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
    Given I am watching for socket-io event "messages.ws-client.chat.typing-members-updated"
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

  Scenario: Update typing members
    Given I connect to socket.io namespace "chat" as "s1-first-client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    # connect another socket to send typing events
    Then I connect to socket.io namespace "chat" as "s1-second-client" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.chat-room.typing-stopped" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.chat.typing-members-updated" for client "s1-first-client" and remember as "typingMembersUpdateEventData"
    And print storage key "typingMembersUpdateEventData"
    Then stored value "typingMembersUpdateEventData" should contain json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "typingMembers": [
          {
            "user": "{{ID_OF_USER_2}}",
            "userAccount": {
              "email": "sam@example.com",
              "firstName": "Sam",
              "lastName": "Smith",
              "logo": "sam.png",
              "phone": "+15551234567"
            }
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms
    
  Scenario: Update typing members handle typing stopped event
    Then I connect to socket.io namespace "chat" as "first-client" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    # connect another socket to send typing events
    Then I connect to socket.io namespace "chat" as "second-client" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.chat-room.typing-stopped" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """

    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.chat.typing-members-updated" for client "first-client" and remember as "typingMembersUpdateEventData_1"
    And print storage key "typingMembersUpdateEventData_1"
    Then stored value "typingMembersUpdateEventData_1" should contain json:
      """
      {
        "typingMembers": [
          {
            "user": "{{ID_OF_USER_2}}"
          }
        ]
      }
      """

    When I emit socket-io event "messages.ws-client.chat-room.typing-stopped" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.chat.typing-members-updated" for client "first-client" and remember as "typingMembersUpdateEventData"
    And print storage key "typingMembersUpdateEventData"
    Then stored value "typingMembersUpdateEventData" should not contain json:
      """
      {
        "typingMembers": [
          {
            "user": "{{ID_OF_USER_2}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Update typing members multiple sessions
    # connect first session
    Given I connect to socket.io namespace "chat" as "s3-first-client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    # connect second session
    Given I connect to socket.io namespace "chat" as "s3-second-client" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed


    # check typing members
    When I emit socket-io event "messages.ws-client.chat-room.typing-stopped" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed


    Then I look for last socket-io event "messages.ws-client.chat.typing-members-updated" for client "s3-first-client" and remember as "typingMembersUpdateEventData"
    And print storage key "typingMembersUpdateEventData"
    Then stored value "typingMembersUpdateEventData" should contain json:
      """
      {
        "typingMembers": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """

    # start typing for second session
    When I emit socket-io event "messages.ws-client.chat-room.typing-stopped" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.chat.typing-members-updated" for client "s3-first-client" and remember as "typingMembersUpdateEventData"
    And print storage key "typingMembersUpdateEventData"
    Then stored value "typingMembersUpdateEventData" should not contain json:
      """
      {
        "typingMembers": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """

    # stop typing for first session
    Given I switch to socket-io client "s3-first-client"
    When I emit socket-io event "messages.ws-client.chat-room.typing-stopped" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    Then I look for last socket-io event "messages.ws-client.chat.typing-members-updated" for client "s3-second-client" and remember as "typingMembersUpdateEventData"
    And print storage key "typingMembersUpdateEventData"
    Then stored value "typingMembersUpdateEventData" should not contain json:
      """
      {
        "typingMembers": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms
