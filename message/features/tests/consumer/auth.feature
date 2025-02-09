Feature: Auth consumption
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "userId" following value:
      """
      "_id-of-existing-user"
      """

  Scenario: Consume business granted then revoked to user
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "business.event.permission.added",
        "payload": {
          "businessId": "{{businessId}}",
          "userId": "{{userId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And model "User" with id "{{userId}}" should contain json:
      """
      {
        "businesses": ["{{businessId}}"]
      }
      """
    
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "business.event.permission.deleted",
        "payload": {
          "businessId": "{{businessId}}",
          "userId": "{{userId}}"
        }
      }
      """
    And print RabbitMQ message list
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ message list
    And model "User" with id "{{userId}}" should not contain json:
      """
      {
        "businesses": ["{{businessId}}"]
      }
      """