Feature: Users consumption
  Scenario: Consume new user created event
    Given I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "users.event.user.created",
        "payload": {
          "_id": "_id-of-new-user",
          "businesses": [{
            "_id": "_id-of-business1"
          }],
          "userAccount": {
            "firstName": "John",
            "lastName": "Doe",
            "phone": "+394233123",
            "email": "john@example.com",
            "logo": "john.png"
          },
          "createdAt": "2021-03-30T17:48:10.761Z"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_message_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And model "User" with id "_id-of-new-user" should contain json:
      """
      {
        "businesses": [
          "_id-of-business1"
        ],
        "userAccount": {
          "firstName": "John",
          "lastName": "Doe",
          "phone": "+394233123",
          "email": "john@example.com",
          "logo": "john.png"
        }
      }
      """

  Scenario: Consume existing user export event with update
    Given I use DB fixture "user"
    Given I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "users.event.user.export",
        "payload": {
          "_id": "_id-of-existing-user",
          "businesses": [
            { "_id": "_id-of-existing-business" },
            { "_id": "_id-of-another-existing-business" }
          ],
          "userAccount": {
            "firstName": "John",
            "lastName": "Doe",
            "phone": "+394233432",
            "email": "john@example.com",
            "logo": "john.png"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_message_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And model "User" with id "_id-of-existing-user" should contain json:
      """
      {
        "businesses": [
          "_id-of-existing-business",
          "_id-of-another-existing-business"
        ],
        "userAccount": {
          "phone": "+394233432"
        }
      }
      """

  Scenario: Consume existing user delete event
    Given I use DB fixture "user"
    Given I publish in RabbitMQ channel "async_events_message_micro" message with json:
    """
    {
      "name": "users.event.user.removed",
      "payload": {
        "_id": "_id-of-existing-user"
      }
    }
    """
    And I process messages from RabbitMQ "async_events_message_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And model "User" with id "_id-of-existing-user" should not exist

  Scenario: Remove users and related resources, if not provided in the event
    Given I use DB fixture "user"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "users.event.fix.difference",
        "payload": {
          "users": [
            "_id-of-existing-user"
          ]
        }
      }
      """
    And I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "User" with id "_id-of-user-3" should not exist
    Then model "User" found by following JSON should exist:
    """
    {
      "_id": "_id-of-existing-user"
    }
    """
