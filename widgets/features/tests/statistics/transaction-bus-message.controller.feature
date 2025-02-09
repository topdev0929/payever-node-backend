Feature: Transaction bus message controller
  Background:
    Given I load constants from "features/fixtures/const.ts"
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "{{USER_1_ID}}",
      "roles": [{
        "name": "merchant",
        "permissions": [
          {
            "businessId": "{{BUSINESS_1_ID}}",
            "acls": []
          }
        ]
      }]
    }
    """

  Scenario: Rabbit message export.monthly-business-transaction
    Given I use DB fixture "statistics/transaction-message-paid"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-1 days" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "transactions.event.export.monthly-business-transaction",
      "payload": {
        "_id": "{{BUSINESS_1_ID}}",
        "transactions": [{
          "id": "{{BUSINESS_1_ID}}",
          "currency": "EUR"
        }],
        "amount": 300,
        "date": "{{cur_date}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 300,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """

  Scenario: Rabbit message export.monthly-user-per-business-transaction
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
      """
      {
        "name": "transactions.event.export.monthly-user-per-business-transaction",
        "payload": {
          "date": "2021-05",
          "userId": "6582c33d-d8aa-4140-9b4c-a30ea111777d",
          "businessId": "{{BUSINESS_1_ID}}",
          "currency": "USD",
          "totalSpent": 5233.23
        }
      }
      """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    Then model "UserPerBusinessMonthAmount" found by following JSON should exist:
      """
      {
        "date": "2021-05",
        "userId": "6582c33d-d8aa-4140-9b4c-a30ea111777d",
        "businessId": "{{BUSINESS_1_ID}}",
        "currency": "USD"
      }
      """

  Scenario: Rabbit message paid transaction
    Given I use DB fixture "statistics/transaction-message-paid"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-1 days" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "transactions.event.payment.paid",
      "payload": {
        "id": "{{USER_1_ID}}",
        "business": {
          "id": "{{BUSINESS_1_ID}}"
        },
        "user": {
          "id": "{{USER_2_ID}}"
        },
        "channel_set": {
          "id": "{{CHANNELSET_1_ID}}"
        },
        "amount": 200,
        "date": "{{cur_date}}",
        "items": [],
        "last_updated": "{{last_updated}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 500,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/channel-set/{{CHANNELSET_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 500,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/user/{{USER_2_ID}}/last-daily"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "amount": 450,
          "currency": "EUR",
          "date": "*"
        }
      ]
      """
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/user/{{USER_2_ID}}/last-monthly"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "amount": 250,
          "currency": "EUR",
          "date": "*"
        }
      ]
      """

  Scenario: Rabbit message refund transaction
    Given I use DB fixture "statistics/transaction-message-refund"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-1 days" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "transactions.event.payment.refund",
      "payload": {
        "id": "e0a808f4-af26-48e5-bb17-8fe083d94dd8",
        "business": {
          "id": "{{BUSINESS_1_ID}}"
        },
        "channel_set": {
          "id": "{{CHANNELSET_1_ID}}"
        },
        "amount": 200,
        "date": "{{cur_date}}",
        "last_updated": "{{last_updated}}",
        "history": [
          {
            "action": "refund",
            "amount": 200
          }
        ]
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/channel-set/{{CHANNELSET_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 100,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/channel-set/{{CHANNELSET_1_ID}}/last-monthly?months=2"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 100,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
  Scenario: Rabbit message refund transaction last updated > 30 days
    Given I use DB fixture "statistics/transaction-message-refund"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-35 days" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "transactions.event.payment.refund",
      "payload": {
        "id": "e0a808f4-af26-48e5-bb17-8fe083d94dd8",
        "business": {
          "id": "{{BUSINESS_1_ID}}"
        },
        "channel_set": {
          "id": "{{CHANNELSET_1_ID}}"
        },
        "amount": 200,
        "date": "{{cur_date}}",
        "last_updated": "{{last_updated}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/channel-set/{{CHANNELSET_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 300,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/channel-set/{{CHANNELSET_1_ID}}/last-monthly?months=2"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 300,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """

  Scenario: Rabbit message removed transaction
    Given I use DB fixture "statistics/transaction-message-refund"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-1 days" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "transactions.event.payment.removed",
      "payload": {
        "id": "e0a808f4-af26-48e5-bb17-8fe083d94dd8",
        "business": {
          "id": "{{BUSINESS_1_ID}}"
        },
        "channel_set": {
          "id": "{{CHANNELSET_1_ID}}"
        },
        "amount": 200,
        "date": "{{cur_date}}",
        "last_updated": "{{last_updated}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    When I send a GET request to "/transactions-app/business/{{BUSINESS_1_ID}}/channel-set/{{CHANNELSET_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 100,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
