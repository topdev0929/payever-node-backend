Feature: Handling user events
  Background:
    Given I remember as "userId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c0"
      """
  Scenario: Import user from auth
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "_id":"{{userId}}"
          }
         ],
        "result": {}
      }
      """
    Given I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "auth.event.users.export",
        "payload": {
          "_id":"{{userId}}",
          "email":"test@example.com",
          "firstName":"John",
          "lastName":"Johnson"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And model "User" with id "{{userId}}" should contain json:
      """
      {
        "_id":"{{userId}}"
      }
      """

  Scenario: Import user from auth when exist
    Given I use DB fixture "users"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "_id":"{{userId}}"
          }
         ],
        "result": {}
      }
      """
    Given I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "auth.event.users.export",
        "payload": {
          "_id":"{{userId}}",
          "email":"test@example.com",
          "firstName":"John",
          "lastName":"Johnson"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And model "User" with id "{{userId}}" should contain json:
      """
      {
        "_id":"{{userId}}"
      }
      """
