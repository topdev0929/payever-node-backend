Feature: TPM messages consumption

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
    Given I remember as "messageId" following value:
      """
      "f60b9568-700c-4686-8c4b-badf5779c3c0"
      """
    Given I remember as "salt" following value:
      """
      "pba5LieAb/OmkRGpuEqrEM8u6LYFJeMChlU/vOffvY2jAM/nOv/gQVFicWdRHIo98eYHCOEsBSrU8JVlqYJkoOH+IOeiH/JyRogFtwBt/GZmY6S5BHAUMKXhC8Ow1kP2"
      """
    Given I remember as "encryptContent" following value:
      """
      "9771d46437f0e3061c125b01baaea95f"
      """
    Given I remember as "updatedEncryptedContent" following value:
      """
      "1a5be2ac3063b024b86f644d6045ae2f"
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

  Scenario: Consume message created
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "customer-chats"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.message.created",
        "payload": {
          "_id": "{{messageId}}",
          "attachments": [],
          "chat": "{{chatId}}",
          "content": "{{encryptContent}}",
          "contentType":"sample-content-type",
          "contentPayload":"sample-content-payload",
          "sender": "{{contactId}}",
          "sentAt": "2021-04-05T11:08:08.626Z",
          "status": "sent",

          "businessId": "{{businessId}}",
          "integrationName": "whatsapp"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{messageId}}",
            "status": "sent",
            "content": "{{encryptContent}}",
            "contentType":"sample-content-type",
            "contentPayload":"sample-content-payload"
          }
        }
      ]
      """

  Scenario: Consume message updated
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "messages"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.message.updated",
        "payload": {
          "_id": "{{messageId}}",
          "attachments": [],
          "chat": "{{chatId}}",
          "content": "{{updatedEncryptedContent}}",
          "sender": "{{contactId}}",
          "sentAt": "2021-04-13T10:48:54.621Z"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{messageId}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "attachments": [],
              "chat": "{{chatId}}",
              "content": "{{updatedEncryptedContent}}",
              "sender": "{{contactId}}",
              "sentAt": "2021-04-13T10:48:54.621Z",
              "editedAt": "*"
            }
          }
        }
      ]
      """

  Scenario: Consume message status updated
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "messages"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.message.updated",
        "payload": {
          "_id": "{{messageId}}",
          "status": "read",
          "businessId": null,
          "integrationName": null
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{messageId}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "status": "read",
              "editedAt": "*"
            }
          }
        }
      ]
      """

  Scenario: Consume message deleted
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "messages"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.message.deleted",
        "payload": {
          "_id": "{{messageId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{messageId}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "status": "deleted"
            }
          }
        }
      ]
      """

  Scenario: Consume Pin message
    Given I use DB fixture "messages"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.message.pin",
        "payload": {
          "messageId": "{{messageId}}",
          "sender": "{{contactId}}",
          "chat": "{{chatId}}",
          "forAllUsers": true,
          "notifyAllMembers": true,
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And I emit socket-io event "messages.ws-client.message.pinned" with json:
      """
      {
        "chat": {
            "_id" : "{{chatId}}"
        },
        "message" : {
          "_id" : {{messageId}}
          },
        "pinned" : 
          "messageId": "{{messageId}}",
          "sender": "{{contactId}}",
          "chat": "{{chatId}}",
          "forAllUsers": true,
          "notifyAllMembers": true,
        }
      }
      """
