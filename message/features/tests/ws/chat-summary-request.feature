Feature: Ws chat summary request feature
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I am watching for socket-io event "messages.ws-client.chat-summary.response"
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

  Scenario: Respone chat summary (online members, typing members)
    Given I connect to socket.io namespace "chat" as "first-client" with following query:
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

    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.chat-summary.request" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 10 ms while socket-io event is processed


    Then I look for last socket-io event "messages.ws-client.chat-summary.response" and remember as "summaryResponse"
    And print storage key "summaryResponse"
    Then stored value "summaryResponse" should contain json:
      """
      {
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "onlineMembers":[
          {
            "user": "{{ID_OF_USER_1}}"
          },
          {
            "user": "{{ID_OF_USER_2}}"
          }
        ],
        "onlineMembersCount": 2,
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
