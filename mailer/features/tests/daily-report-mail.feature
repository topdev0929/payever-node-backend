Feature: Send daily report transactions
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send daily report transactions
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "cc": ["report@payever.org", "daily@payever.org"],
          "params": {
            "report": { 
              "date": "2020-03-25", 
              "report_items": [
                {
                  "currency": "EUR",
                  "exchangeRate": 1,
                  "overallTotal": 20000,
                  "paymentOption": [
                    {
                      "overallTotal": 10000,
                      "paymentOption": "stripe",
                      "todayTotal": 500,
                      "total": 10500
                    },
                    {
                      "overallTotal": 10000,
                      "paymentOption": "santander_pos_invoice_de",
                      "todayTotal": 0,
                      "total": 10000
                    }
                  ],
                  "todayTotal": 500,
                  "total": 20500
                },
                {
                  "currency": "SEK",
                  "exchangeRate": 11.1523,
                  "overallTotal": 200000,
                  "paymentOption": [
                    {
                      "overallTotal": 100000,
                      "paymentOption": "stripe",
                      "todayTotal": 50000,
                      "total": 150000
                    },
                    {
                      "overallTotal": 100000,
                      "paymentOption": "paymill_creditcard",
                      "todayTotal": 0,
                      "total": 100000
                    }
                  ],
                  "todayTotal": 50000,
                  "total": 250000
                }
              ], 
              "report_items_exchanged": [
                {
                  "currency": "EUR",
                  "overallTotal": 42416.90,
                  "todayTotal": 4983.38,
                  "total": 47400.28
                }
              ]
            }
          },
          "to": "report.daily@payever.org",
          "type": "daily_report_transactions"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Daily Transactions Report"
    }
    """
    And a mail with the following data should not be sent:
    """
    {
      "from": "bill@gates.com"
    }
    """
