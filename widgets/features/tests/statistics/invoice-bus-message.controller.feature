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

  Scenario: Rabbit message create invoice
    Given I use DB fixture "statistics/invoice-message"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-1 hours" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "invoice.event.invoice.created",
      "payload": {
        "invoiceId": "invoiceId",
        "transactionId": "transactionId",
        "businessId": "{{BUSINESS_1_ID}}",
        "channelSet": [
          "{{CHANNELSET_1_ID}}"
        ],
        "currency": "EUR",
        "total": 20,
        "amountPaid": 20,
        "customer": {
          "email": "test@gmail.com",
          "name": "test"
        },
        "updatedAt": "{{last_updated}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    Then I look for model "Invoice" by following JSON and remember as "invoice":
    """
    {
      "_id": "invoiceId"
    }
    """
    And stored value "invoice" should contain json:
    """
    {
      "_id": "*",
      "amountPaid": 20,
      "currency": "EUR"
    }
    """
    When I send a GET request to "/invoice-app/business/{{BUSINESS_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 320,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
    When I send a GET request to "/invoice-app/business/{{BUSINESS_1_ID}}/last-daily?numDays=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 20,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """

  Scenario: Rabbit message export invoice
    Given I use DB fixture "statistics/invoice-message"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-1 hours" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "invoice.event.invoice.export",
      "payload": {
        "invoiceId": "invoiceId",
        "transactionId": "transactionId",
        "businessId": "{{BUSINESS_1_ID}}",
        "channelSet": [
          "{{CHANNELSET_1_ID}}"
        ],
        "currency": "EUR",
        "total": 20,
        "amountPaid": 20,
        "customer": {
          "email": "test@gmail.com",
          "name": "test"
        },
        "updatedAt": "{{last_updated}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    Then I look for model "Invoice" by following JSON and remember as "invoice":
    """
    {
      "_id": "invoiceId"
    }
    """
    And stored value "invoice" should contain json:
    """
    {
      "_id": "*",
      "amountPaid": 20,
      "currency": "EUR"
    }
    """
    When I send a GET request to "/invoice-app/business/{{BUSINESS_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 320,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
    When I send a GET request to "/invoice-app/business/{{BUSINESS_1_ID}}/last-daily?numDays=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 20,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """

  Scenario: Rabbit message delete invoice
    Given I use DB fixture "statistics/invoice-message"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-1 hours" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "invoice.event.invoice.updated",
      "payload": {
        "invoiceId": "invoiceId-1",
        "transactionId": "transactionId",
        "businessId": "{{BUSINESS_1_ID}}",
        "channelSet": [
          "{{CHANNELSET_1_ID}}"
        ],
        "currency": "EUR",
        "total": 50,
        "amountPaid": 50,
        "customer": {
          "email": "test@gmail.com",
          "name": "test"
        },
        "updatedAt": "{{last_updated}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    Then I look for model "Invoice" by following JSON and remember as "invoice":
    """
    {
      "_id": "invoiceId-1"
    }
    """
    And stored value "invoice" should contain json:
    """
    {
      "_id": "*",
      "amountPaid": 50,
      "currency": "EUR"
    }
    """
    When I send a GET request to "/invoice-app/business/{{BUSINESS_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 50,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """

  Scenario: Rabbit message delete invoice
    Given I use DB fixture "statistics/invoice-message"
    And I create date and remember it as "cur_date"
    And I create date and modify it with "-1 hours" and remember it as "last_updated"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "invoice.event.invoice.deleted",
      "payload": {
        "invoiceId": "invoiceId-1",
        "transactionId": "transactionId",
        "businessId": "{{BUSINESS_1_ID}}",
        "channelSet": [
          "{{CHANNELSET_1_ID}}"
        ],
        "currency": "EUR",
        "total": 300,
        "amountPaid": 300,
        "customer": {
          "email": "test@gmail.com",
          "name": "test"
        },
        "updatedAt": "{{last_updated}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "Invoice" with id "invoiceId-1" should not exist
    When I send a GET request to "/invoice-app/business/{{BUSINESS_1_ID}}/last-monthly?months=1"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 0,
        "currency": "EUR",
        "date": "*"
      }
    ]
    """
