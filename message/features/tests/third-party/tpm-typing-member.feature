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

  Scenario: Send stomp message on member typing
    Given I connect to socket.io namespace "chat" with following query:
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
    When I emit socket-io event "messages.ws-client.chat-room.typing" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    Then I wait 100 ms while socket-io event is processed

    And Stomp queue "message.event.user.activity" should contain message with json body containing json:
      """
      [{
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "businessId":"{{ID_OF_EXISTING_BUSINESS}}",
        "typingActivity":{
          "isTyping":true
        }
      }]
      """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Process typing event from third-party
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    When I emit socket-io event "messages.ws-client.chat-room.join" with:
      """
      {{ID_OF_CUSTOMER_CHAT}}
      """
    And I wait 100 ms while socket-io event is processed


    When I publish in Stomp queue "/queue/third-party-messenger.event.user.activity" message with json:
      """
      {
        "chatId": "{{ID_OF_CUSTOMER_CHAT}}",
        "contactId":"external-contact-id",
        "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
        "typingActivity": {
          "isTyping": true
        }
      }
      """
    And I process messages from Stomp queue "/queue/third-party-messenger.event.user.activity"

    Then I look for last socket-io event "messages.ws-client.chat.typing-members-updated" and remember as "typingMembersUpdateEventData"
    And print storage key "typingMembersUpdateEventData"
    Then stored value "typingMembersUpdateEventData" should contain json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "isTyping": true,
        "member": {
          "contact": null,
          "contactId": "external-contact-id",
          "lastActivity": "*",
          "user": null,
          "userAccount": {}
        },
        "typingMembers": [
          {
            "contact": null,
            "contactId": "external-contact-id",
            "user": null,
            "userAccount": {}
          }
        ]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms
