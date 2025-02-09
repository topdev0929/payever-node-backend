Feature: TPM chats consumption
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "contactId" following value:
      """
      "44e6958e-6dc9-47fb-924b-c3e09ab64621"
      """
    Given I remember as "chatId" following value:
      """
      "2ccbe226-f626-4f5c-8389-1710b71dba7a"
      """
    Given I remember as "salt" following value:
      """
      "pba5LieAb/OmkRGpuEqrEM8u6LYFJeMChlU/vOffvY2jAM/nOv/gQVFicWdRHIo98eYHCOEsBSrU8JVlqYJkoOH+IOeiH/JyRogFtwBt/GZmY6S5BHAUMKXhC8Ow1kP2"
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """

  Scenario: Consume chat created
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.chat.created",
        "payload": {
          "_id": "{{chatId}}",
          "business": "{{businessId}}",
          "integrationName": "whatsapp",
          "salt": "{{salt}}",
          "title": "new-chat-name",
          "contact": "{{contactId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "AbstractMessaging" with id "{{chatId}}" should contain json:
      """
      {
        "title": "new-chat-name",
        "contact": "{{contactId}}"
      }
      """

  Scenario: Consume chat created over stomp
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    When I publish in Stomp queue "/queue/third-party-messenger.event.chat.created" message with json:
      """
      {
        "_id": "{{chatId}}",
        "business": "{{businessId}}",
        "integrationName": "whatsapp",
        "salt": "{{salt}}",
        "title": "new-chat-name",
        "contact": "{{contactId}}"
      }
      """
    Then I process messages from Stomp queue "/queue/third-party-messenger.event.chat.created"
    Then model "AbstractMessaging" with id "{{chatId}}" should contain json:
      """
      {
        "title": "new-chat-name",
        "contact": "{{contactId}}"
      }
      """

  Scenario: Consume chat updated
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "customer-chats"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.chat.updated",
        "payload": {
          "_id": "{{chatId}}",
          "business": "{{businessId}}",
          "integrationName": "whatsapp",
          "salt": "{{salt}}",
          "title": "new-value-of-title",
          "contact": "{{contactId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "AbstractMessaging" with id "{{chatId}}" should contain json:
      """
      {
        "title": "new-value-of-title"
      }
      """

  Scenario: Consume chat deleted
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "customer-chats"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.chat.deleted",
        "payload": {
          "_id": "{{chatId}}",
          "business": "{{businessId}}",
          "integrationName": "whatsapp",
          "salt": "{{salt}}",
          "title": "Title of chat",
          "contact": "{{contactId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "AbstractMessaging" with id "{{chatId}}" should contain json:
      """
      {
        "deleted": true
      }
      """

  Scenario: Consume client typing
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.chat.typing",
          "payload": {
              "_id": {{chatId}},
              "isTyping": true,
              "typingMembers": [
                {
                  "contactId": {{contactId}},
                  "user": {{contactId}}
                },
              ],
          }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And I emit socket-io event "messages.ws-client.chat.typing-members-updated" with json:
      """
      {
       "_id": {{chatId}},
       "isTyping": true,
       "typingMembers": [
         {
           "contactId": {{contactId}},
           "user": {{contactId}}
         },
       ],
      }
      """
