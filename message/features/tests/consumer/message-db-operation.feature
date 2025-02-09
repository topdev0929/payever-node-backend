Feature: App message db operation consumer (db writer)
  Background: constants
    Given I load constants from "features/fixtures/messages-db-writer/const.ts"
    Given I send flushall command to Redis    

  Scenario: created message: handle different types
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
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "message.event.message-model.db-operation",
        "payload": {
          "operation": "create",
          "createModel": {{EVENT_MESSAGE_JSON}}
        }
      }
      """
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "message.event.message-model.db-operation",
        "payload": {
          "operation": "create",
          "createModel": {{TEMPLATE_MESSAGE_JSON}}
        }
      }
      """
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "message.event.message-model.db-operation",
        "payload": {
          "operation": "create",
          "createModel": {{BOX_MESSAGE_JSON}}
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "AbstractChatMessage" with id "{{TEXT_MESSAGE_ID}}" should contain json:
      """
      {{TEXT_MESSAGE_JSON}}
      """
    Then model "AbstractChatMessage" with id "{{EVENT_MESSAGE_ID}}" should contain json:
      """
      {{EVENT_MESSAGE_JSON}}
      """
    Then model "AbstractChatMessage" with id "{{TEMPLATE_MESSAGE_ID}}" should contain json:
      """
      {{TEMPLATE_MESSAGE_JSON}}
      """
    Then model "AbstractChatMessage" with id "{{BOX_MESSAGE_ID}}" should contain json:
      """
      {{BOX_MESSAGE_JSON}}
      """
    
  Scenario: created message handle duplicate
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

    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "message.event.message-model.db-operation",
        "payload": {
          "operation": "create",
          "createModel": {{TEXT_MESSAGE_EDITED_JSON}}
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "AbstractChatMessage" with id "{{TEXT_MESSAGE_ID}}" should contain json:
      """
      {{TEXT_MESSAGE_EDITED_JSON}}
      """

  Scenario: update one message
    Given I use DB fixture "messages-db-writer/messages"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "message.event.message-model.db-operation",
        "payload": {
          "operation": "update-one",    
          "filter": {
            "_id": "{{TEXT_MESSAGE_ID}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "content": "NEW_CONTENT",
              "contentType":"NEW_CONTENT_TYPE",
              "contentPayload":"NEW_CONTENT_PAYLOAD"
            }
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    Then model "AbstractChatMessage" with id "{{TEXT_MESSAGE_ID}}" should contain json:
      """
      {
        "content": "NEW_CONTENT",
        "contentType":"NEW_CONTENT_TYPE",
        "contentPayload":"NEW_CONTENT_PAYLOAD"
      }
      """
    Then model "AbstractChatMessage" with id "{{TEXT_MESSAGE_ID_2}}" should contain json:
      """
      {{TEXT_MESSAGE_JSON_2}}
      """

  Scenario: update one message: mark-unread
    Given I use DB fixture "messages-db-writer/messages"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "message.event.message-model.db-operation",
        "payload": {
          "operation": "update-one",    
          "filter": {
            "_id": "{{TEXT_MESSAGE_ID}}",
            "type": "text"
          },
          "updateQuery": {
            "$pull": {
              "readBy": "user-1"
            }
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    Then model "AbstractChatMessage" with id "{{TEXT_MESSAGE_ID}}" should not contain json:
      """
      {
        "readBy": "user-1"
      }
      """
  
  Scenario: update multiple messages by replyTo
    Given I use DB fixture "messages-db-writer/messages"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "message.event.message-model.db-operation",
        "payload": {
          "operation": "update-many",    
          "filter": {
            "replyTo": "{{TEXT_MESSAGE_ID}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "replyToContent": "UPDATED_CONTENT"
            }
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    Then model "AbstractChatMessage" with id "{{REPLY_TO_TEXT_MESSAGE_ID_1}}" should contain json:
      """
      {
        "replyTo": "{{TEXT_MESSAGE_ID}}",
        "replyToContent":"UPDATED_CONTENT"
      }
      """
    Then model "AbstractChatMessage" with id "{{REPLY_TO_TEXT_MESSAGE_ID_2}}" should contain json:
      """
      {
        "replyTo": "{{TEXT_MESSAGE_ID}}",
        "replyToContent": "UPDATED_CONTENT"
      }
      """
    Then model "AbstractChatMessage" with id "{{REPLY_TO_TEXT_MESSAGE_ID_3}}" should contain json:
      """
      {
        "replyTo": "{{TEXT_MESSAGE_ID_2}}",
        "replyToContent": "{{REPLY_TO_TEXT_MESSAGE_3.replyToContent}}"
      }
      """
