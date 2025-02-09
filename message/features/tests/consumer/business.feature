Feature: Business consumption
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["folder_chats", []], "result": [] }
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
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """

  Scenario: Consume new business created event
    Given I use DB fixture "channel-set"
    Given I use DB fixture "template"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{ID_OF_EXISTING_BUSINESS}}",
          "name": "Some business",
          "userAccountId": "{{ID_OF_USER_1}}",
          "owner": "{{ID_OF_USER_1}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{ID_OF_EXISTING_BUSINESS}}" should contain json:
      """
      {
        "name": "Some business"
      }
      """
    When I look for model "AbstractMessaging" by following JSON and remember as "appChannel1":
      """
      {
        "app": "shop",
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "type": "app-channel"
      }
      """
    And print storage key "appChannel1"
    Then stored value "appChannel1" should contain json:
      """
      {
        "_id": "*"
      }
      """
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{appChannel1._id}}",
            "template": "ef5ff954-8f0d-40e0-8ff6-ff9d6e8d61e6",
            "type": "text"
          }
        }
      ]
      """
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{appChannel1._id}}",
            "template": "2eb85037-faf3-4ada-997c-75545734e979",
            "type": "box"
          }
        }
      ]
      """


    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{appChannel1._id}}",
            "template": "ef5ff954-8f0d-40e0-8ff6-ff9d6e8d61e6",            
            "type": "text"
          }
        }
      ]
      """

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "*",
            "chat": "{{appChannel1._id}}",
            "template": "2eb85037-faf3-4ada-997c-75545734e979",
            "type": "box"
          }
        }
      ]
      """

    When I look for model "AbstractMessaging" by following JSON and remember as "businessSupportChannel":
      """
      {
        "business": "{{ID_OF_EXISTING_BUSINESS}}",
        "title": "Some business / Support Channel",
        "type": "group"
      }
      """
    And print storage key "businessSupportChannel"
    Then stored value "businessSupportChannel" should contain json:
      """
      {
        "_id": "*",
        "title": "Some business / Support Channel",
        "subType": "support",
        "template": "*",
        "members": [
          {
            "user": "{{ID_OF_USER_1}}"
          }
        ]        
      }
      """

      And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "chat": "{{businessSupportChannel._id}}",
             "type": "box",
            "template": "*"
          }
        }
      ]
      """

  Scenario: Consume business deleted event (hard delete chats & messages)
    Given I use DB fixture "business"
    Given I use DB fixture "channel"
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "messages"

    Given model "AbstractMessaging" found by following JSON should exist:
      """
      {
        "_id": "{{ID_OF_CHANNEL}}"
      }
      """

    Given model "AbstractMessaging" found by following JSON should exist:
      """
      {
        "_id": "{{ID_OF_CUSTOMER_CHAT}}"
      }
      """
    Given model "AbstractChatMessage" found by following JSON should exist:
      """
      {
        "_id": "{{ID_OF_CONTACT_MESSAGE}}"
      }
      """
        Given model "AbstractChatMessage" found by following JSON should exist:
      """
      {
        "_id": "{{ID_OF_USER_MESSAGE}}"
      }
      """

    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{ID_OF_EXISTING_BUSINESS}}",
          "userAccount": { },
          "userAccountId": ""
        }
      }
      """
    And I process messages from RabbitMQ "async_events_message_micro" channel
    Then model "AbstractMessaging" with id "{{ID_OF_CHANNEL}}" should not exist      
    And model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should not exist
    And model "AbstractChatMessage" with id "{{ID_OF_CONTACT_MESSAGE}}" should not exist
    And model "AbstractChatMessage" with id "{{ID_OF_USER_MESSAGE}}" should not exist
    
