Feature: Business
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario Outline: Create business
    Given I remember as "userId" following value:
    """
    "5fad5396-9119-11e9-bbe3-7200004fe4c0"
    """
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
    """
      {
        "name": "users.event.user.created",
        "payload": {
          "_id": "{{userId}}",
          "userAccount": {
            "firstName": "firstname",
            "lastName": "lastname",
            "email": "newuser@email.com"
          }
        }
      }
    """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And model "User" with id "{{userId}}" should contain json:
    """
      {
        "userAccount": {
          "firstName": "firstname",
          "lastName": "lastname",
          "email": "newuser@email.com"
        }
      }
    """
  Examples:
    | event_name                   |
    | users.event.user.created |
    | users.event.user.updated |
    | users.event.user.export  |

  Scenario: Remove business
    Given I use DB fixture "users"
    Given I remember as "userId" following value:
    """
    "2b8d46a1-f296-4ad9-8bcf-ed7348ed216a"
    """
    Given I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name":"users.event.user.removed",
        "uuid":"7ee31df2-e6eb-4467-8e8d-522988f426b8",
        "version":0,
        "encryption":"none",
        "createdAt":"2019-08-28T12:32:26+00:00",
        "metadata":{
          "locale":"de",
          "client_ip":"176.198.69.86"
        },
        "payload":{
          "_id":"{{userId}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_mailer_micro" channel
    Then model "User" with id "{{userId}}" should not exist

  Scenario: Remove users and realted resources, if not provided in the event
    Given I use DB fixture "users"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "users.event.fix.difference",
        "payload": {
          "users": [
            "2b8d46a1-f296-4ad9-8bcf-ed7348ed216a"
          ]
        }
      }
      """
    And I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "User" with id "1b8d46a1-f296-4ad9-8bcf-ed7348ed216a" should not exist
    Then model "User" found by following JSON should exist:
    """
    {
      "_id": "2b8d46a1-f296-4ad9-8bcf-ed7348ed216a"
    }
    """
