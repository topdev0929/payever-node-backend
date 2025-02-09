Feature: Unread message count
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I send flushall command to Redis
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "unread-messages-count"
    Given I use DB fixture "subscriptions"
    Given I create date and remember it as "now"
    Given I am watching for socket-io event "messages.ws-client.unread-messages-count.response"
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

  Scenario: Get unread message count
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    And I emit socket-io event "messages.ws-client.unread-messages-count.request" with json:
      """
      {
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "from": "2022-01-01 01:01:02"
      }
      """
    Then I wait 5 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.unread-messages-count.response" and remember as "response"
    And print storage key "response"
    Then stored value "response" should contain json:
      """
      {
        "userId": "_id-of-existing-user",
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "from": "2022-01-01 01:01:02",
        "unread": "3"
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Get unread message count: ignore not text message types
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    And I emit socket-io event "messages.ws-client.unread-messages-count.request" with json:
      """
      {
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "from": "2022-01-01 00:00:00"
      }
      """
    Then I wait 5 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.unread-messages-count.response" and remember as "response"
    And print storage key "response"
    Then stored value "response" should contain json:
      """
      {
        "userId": "{{ID_OF_USER_2}}",
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "from": "2022-01-01 00:00:00",
        "unread": "3"
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms


Scenario: Get unread message count for all times (from should be undefined)
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    And I emit socket-io event "messages.ws-client.unread-messages-count.request" with json:
      """
      {
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}"        
      }
      """
    Then I wait 5 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.unread-messages-count.response" and remember as "response"
    And print storage key "response"
    Then stored value "response" should contain json:
      """
      {
        "userId": "{{ID_OF_USER_2}}",
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "unread": "3"
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms    
   

Scenario: Get unread message count: shouldn't count event messages    
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_2}}"
      }
      """
    And I emit socket-io event "messages.ws-client.unread-messages-count.request" with json:
      """
      {
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}"        
      }
      """
    Then I wait 5 ms while socket-io event is processed
    Then I look for last socket-io event "messages.ws-client.unread-messages-count.response" and remember as "response"
    And print storage key "response"
    Then stored value "response" should contain json:
      """
      {
        "userId": "{{ID_OF_USER_2}}",
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "unread": "3"
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms    
   