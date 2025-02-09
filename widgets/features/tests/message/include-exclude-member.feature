Feature: Handle member include/exclude events
  Scenario: Member included
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "message/chats"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
      """
      {
        "name": "messages.event.widget-data.member-included",
        "payload": {
          "chatId": "{{CHAT_2_ID}}",
          "member": {
            "user": "{{USER_1_ID}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "Chat" with id "{{CHAT_2_ID}}" should contain json:
    """
    {
      "_id": "{{CHAT_2_ID}}",
      "members": [
        {
          "user": "{{USER_1_ID}}"
        }
      ]
    }
    """
    
    
  Scenario: Member excluded
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "message/chats"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
      """
      {
        "name": "messages.event.widget-data.member-excluded",
        "payload": {
          "chatId": "{{CHAT_1_ID}}",
          "member": {
            "user": "{{USER_1_ID}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "Chat" with id "{{CHAT_2_ID}}" should not contain json:
    """
    {
      "members": [
        {
          "user": "{{USER_1_ID}}"
        }
      ]
    }
    """
    