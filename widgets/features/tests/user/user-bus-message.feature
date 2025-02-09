Feature: Handle user bus message events    

  Scenario: user created
    Given I remember as "userId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe0"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "users.event.user.created",
      "payload": {
        "_id": "{{userId}}",
        "userAccount": {
          "_id": "{{userId}}",
          "currency": "USD"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "User" with id "{{userId}}" should contain json:
    """
    {
      "_id": "{{userId}}"
    }
    """
    
  Scenario: user exported
    Given I remember as "userId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe1"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "users.event.user.export",
      "payload": {
        "_id": "{{userId}}",
        "userAccount": {
          "_id": "{{userId}}",
          "currency": "USD"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "User" with id "{{userId}}" and remember as "data"
    And print storage key "data"
    And model "User" with id "{{userId}}" should contain json:
    """
    {
      "_id": "{{userId}}"
    }
    """

  Scenario: Remove users and realted resources, if not provided in the event
    Given I use DB fixture "users"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
      """
      {
        "name": "users.event.fix.difference",
        "payload": {
          "users": [
            "00000000-0000-0000-0000-000000000000"
          ]
        }
      }
      """
    And I process messages from RabbitMQ "async_events_widgets_micro" channel
    Then model "User" with id "11111111-1111-1111-1111-111111111111" should not exist
     Then model "User" found by following JSON should exist:
      """
    {
      "_id": "00000000-0000-0000-0000-000000000000"
    }
    """

  Scenario: Merge Duplicate Users
    Given I use DB fixture "statistics/transaction-message-paid"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
      """
        {
          "name": "user.event.merge.duplicate",
          "payload": {
             "targetUser": {
                "_id": "333cc7fc-eb5e-47b6-8e1a-0bfa7b9fb8fe",
                "businesses": [
                  "74b58859-3a62-4b63-83d6-cc492b2c8e29"
                ],
                "userAccount": {
                  "email": "johnTheMerchant2@example.com",
                  "firstName": "alpha"
                }
              },
              "usersToMerge": [
                {
                  "_id": "7d6d23b0-7ec3-4236-a29b-d59f147c6cc9",
                  "businesses": [
                    "84b58859-3a62-4b63-83d6-cc492b2c8e29"
                  ],
                  "userAccount": {
                    "email": "aldin.ugljanin@payever.org",
                    "firstName": "Aldin"
                  }
                },
                {
                  "_id": "778054ce-ac89-4a80-b503-de6f9aecd288",
                  "businesses": [
                    "74b58859-3a62-4b63-83d6-cc492b2c8e30"
                  ],
                  "userAccount": {
                    "email": "testmy12@gmail.com",
                    "firstName": "alpha"
                  }
                }
              ]
          }
        }
      """
    And I process messages from RabbitMQ "async_events_widgets_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "UserPerBusinessDayAmount" found by following JSON should exist:
    """
    {
      "userId": "333cc7fc-eb5e-47b6-8e1a-0bfa7b9fb8fe"
    }
    """
    Then model "UserPerBusinessMonthAmount" found by following JSON should exist:
    """
    {
      "userId": "333cc7fc-eb5e-47b6-8e1a-0bfa7b9fb8fe"
    }
    """



