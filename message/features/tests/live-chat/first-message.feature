Feature: On first message user can see chats

  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I send flushall command to Redis
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

  Scenario: Join business room    
    Given I am watching for socket-io event "messages.ws-client.room.joined";
    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I wait 10 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.business-room.join" with:
      """
      {{ID_OF_EXISTING_BUSINESS}}
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for socket-io events "messages.ws-client.room.joined" and remember as "join_events"
    And print storage key "join_events"
    Then stored value "join_events" should contain json:
    """
    ["service:business:_id-of-existing-business"]
    """
    Then I disconnect all socket.io clients and wait 100 ms

  Scenario: emit socket events for firts message from live-chat
    Given I am watching for socket-io event "messages.ws-client.chat.created"
    Given I am watching for socket-io event "messages.ws-client.contact.created"
    Given I am watching for socket-io event "messages.ws-client.message.posted"

    Given I connect to socket.io namespace "chat" with following query:
      """
      {
        "token": "{{token_for_user_1}}"
      }
      """
    Then I wait 10 ms while socket-io event is processed
    When I emit socket-io event "messages.ws-client.business-room.join" with:
      """
      {{ID_OF_EXISTING_BUSINESS}}
      """
    Then I wait 100 ms while socket-io event is processed

    When I publish in Stomp queue "/queue/third-party-messenger.event.first-message.created" message with json:
      """
      {
        "contact": {
          "_id": "new-contact-id",
          "avatar": "john-doe.png",
          "business": "{{ID_OF_EXISTING_BUSINESS}}",
          "communications": [
            {
              "identifier": "waId8123498172938",
              "integrationName": "live-chat"
            }
          ],
          "status": "online",
          "name": "John Doe",
          "email": "contact@payever.org"
        },
        "chat": {
          "_id": "new-chat-id",
          "business": "{{ID_OF_EXISTING_BUSINESS}}",
          "integrationName": "live-chat",
          "salt": "{{SALT}}",
          "title": "new-live-chat-name",
          "contact": "new-contact-id"
        },
        "message": {
          "_id": "new-message-id",
          "attachments": [],
          "chat": "new-chat-id",
          "content": "{{ENCRYPTED_CONTENT}}",
          "sender": "new-contact-id",
          "sentAt": "2021-04-05T11:08:08.626Z",
          "status": "sent",
          "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
          "integrationName": "live-chat"
        }
      }
      """
    Then I process messages from Stomp queue "/queue/third-party-messenger.event.first-message.created"

    Then I look for last socket-io event "messages.ws-client.chat.created" and remember as "chat_event_payload"
    And print storage key "chat_event_payload"
    Then stored value "chat_event_payload" should contain json:
      """
      {
        "_id": "new-chat-id",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "contact": {
          "_id": "new-contact-id",
          "avatar": "john-doe.png",
          "business": "{{ID_OF_EXISTING_BUSINESS}}",
          "communications": [
            {
              "identifier": "waId8123498172938",
              "integrationName": "live-chat"
            }
          ],
          "status": "online",
          "name": "John Doe",
          "email": "contact@payever.org"
        },
        "integrationName": "live-chat",
        "members": [
          
        ],
        "messages": [],
        "pinned": [],
        "title": "new-live-chat-name",
        "type": "chat"
      }
      """

    Then I look for last socket-io event "messages.ws-client.contact.created" and remember as "contact_event_payload"
    And print storage key "contact_event_payload"
    Then stored value "contact_event_payload" should contain json:
      """
      {
        "_id": "new-contact-id",
        "avatar": "john-doe.png",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "communications": [
          {
            "identifier": "waId8123498172938",
            "integrationName": "live-chat"
          }
        ],
        "status": "online",
        "name": "John Doe"
      }
      """

    Then I look for last socket-io event "messages.ws-client.message.posted" and remember as "message_event_payload"
    And print storage key "message_event_payload"
    Then stored value "message_event_payload" should contain json:
      """
      {
        "_id": "new-message-id",
        "attachments": [],
        "chat": "new-chat-id",
        "content": "{{DECRYPTED_CONTENT}}",
        "sender": "new-contact-id",
        "sentAt": "2021-04-05T11:08:08.626Z",
        "status": "sent"
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms
