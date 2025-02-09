Feature: Ws
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"
    Given I use DB fixture "contacts"
    Given I use DB fixture "user"
    Given I use DB fixture "customer-chats"    
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

  Scenario: New contact, chat, message was pushed
    Given I emit socket-io event "messages.ws-client.business-room.join" with:
      """
      {{ID_OF_EXISTING_BUSINESS}}
      """
    And I wait 100 ms while socket-io event is processed
    When I publish in Stomp queue "/queue/third-party-messenger.event.contact.created" message with json:
      """
      {
        "_id": "{{ID_OF_CONTACT}}",
        "avatar": "jane-doe.png",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
          "communications": [
            {
              "identifier": "waId8123498172938",
              "integrationName": "whatsapp"
            }
          ],
          "status": "online",
          "name": "Jane Doe"
      }
      """
    And I publish in Stomp queue "/queue/third-party-messenger.event.chat.created" message with json:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "integrationName": "whatsapp",
        "salt": "{{salt}}",
        "title": "new-chat-title",
        "contact": "{{ID_OF_CONTACT}}"
      }
      """
    And I publish in Stomp queue "/queue/third-party-messenger.event.message.created" message with json:
      """
      {
          "_id": "{{ID_OF_CONTACT_MESSAGE}}",
          "attachments": [],
          "chat": "{{ID_OF_CUSTOMER_CHAT}}",
          "content": "{{encryptContent}}",
          "sender": "{{ID_OF_CONTACT}}",
          "sentAt": "2021-04-05T11:08:08.626Z",
          "status": "sent",

          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "integrationName": "whatsapp"
      }
      """
    And I process messages from Stomp queue "/queue/third-party-messenger.event.contact.created"
    And I process messages from Stomp queue "/queue/third-party-messenger.event.contact.created"
    And I process messages from Stomp queue "/queue/third-party-messenger.event.contact.created"
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: Set profile status
    When I emit socket-io event "messages.ws-client.member.update" with json:
      """
      {
        "status": "busy"
      }
      """
    Then I wait 100 ms while socket-io event is processed
    And model "Profile" with id "{{ID_OF_USER_1}}" should contain json:
      """
      {
        "status": "busy"
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms
