Feature: App message db operation consumer (handle last message)
  Background: constants
    Given I load constants from "features/fixtures/messages-db-writer/const.ts"
    Given I send flushall command to Redis
    Given I use DB fixture "customer-chats"

  Scenario: create message: handle last messages
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
      "name": "message.event.message-model.db-operation",
      "payload": {
       "operation": "create",
        "createModel": {{TEXT_MESSAGE_JSON}}
       }
      }
      """

    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "AbstractChatMessage" with id "{{TEXT_MESSAGE_ID}}" should contain json:
      """
      {{TEXT_MESSAGE_JSON}}
      """

    And model "AbstractMessaging" with id "{{CHAT_ID}}" should contain json:
      """
      {
        "lastMessages": [
          {{TEXT_MESSAGE_JSON}}
        ]
      }
      """

  Scenario: update message: handle last messages
    Given I use DB fixture "messages-db-writer/messages"
    Given model "AbstractMessaging" with id "{{CHAT_ID}}" should contain json:
      """
      {
        "lastMessages": [
          {
            "_id": "chat4-message1",
            "sender": "3bddb299-8bb0-41e5-beeb-d23c1fd5ef37"
          }
        ]
      }
      """
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "message.event.message-model.db-operation",
        "payload": {
          "operation": "update-one",    
          "filter": {
            "_id": "chat4-message1",
            "type": "text"            
          },
          "updateQuery": {
            "$set": {
              "content": "encrypted-edited-content"
            }
          }
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "AbstractMessaging" with id "{{CHAT_ID}}" should contain json:
      """
      {
        "lastMessages": [
          {
            "_id": "chat4-message1",
            "type": "text",
            "content": "encrypted-edited-content"
          }
        ]
      }
      """

     And model "AbstractMessaging" with id "{{CHAT_ID}}" should not contain json:
      """
      {
        "lastMessages": [
          {
            "sender": "3bddb299-8bb0-41e5-beeb-d23c1fd5ef37"
          }
        ]
      }
      """
