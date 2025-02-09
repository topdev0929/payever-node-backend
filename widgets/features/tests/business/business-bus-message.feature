Feature: Handle business bus message events
  Scenario: Business created
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "users.event.business.created",
      "payload": {
        "_id": "{{businessId}}",
        "currency": "EUR",
        "createdAt": "2019-05-07 06:49:48",
        "userAccount": {
          "email": "test@test.com"
        },
        "userAccountId": "12345"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "Business" with id "{{businessId}}" should contain json:
    """
    {
      "_id": "{{businessId}}",
      "currency": "EUR"
    }
    """
    Then I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "merchant",
        "permissions": [{ "businessId": "{{businessId}}", "acls": [] }]
      }]
    }
    """
    Then I send a GET request to "/business/{{businessId}}/widget"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "installed": false,
        "default": false,
        "installByDefault": false,
        "_id": "25e394f9-a596-4410-9403-4d111420b1c8",
        "title": "Checkout",
        "type": "checkout"
      },
      {
        "installed": false,
        "default": false,
        "installByDefault": false,
        "_id": "358ada94-6559-4f92-9cdc-077ea46bc3d7",
        "title": "Point Of Sale",
        "type": "pos"
      },
      {
        "installed": false,
        "default": false,
        "installByDefault": false,
        "_id": "e62b4849-b946-49ce-b863-7bcb7e8b978b",
        "title": "Connect",
        "type": "connect"
      },
      {
        "installed": true,
        "default": false,
        "installByDefault": true,
        "_id": "00e42593-2b79-4f29-82e0-9175c80b263f",
        "title": "Apps",
        "type": "apps"
      }
    ]
    """

  Scenario: Business updated
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "users.event.business.updated",
      "payload": {
        "_id": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99",
        "currency": "USD",
        "createdAt": "2019-05-07 06:49:48",
        "userAccount": {
          "email": "test@test.com"
        },
        "userAccountId": "12345"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "Business" with id "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99" should contain json:
    """
    {
      "_id": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99",
      "currency": "USD"
    }
    """

  Scenario: Business exported
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "users.event.business.export",
      "payload": {
        "_id": "{{businessId}}",
        "currency": "USD",
        "createdAt": "2019-05-07 06:49:48",
        "userAccount": {
          "email": "test@test.com"
        },
        "userAccountId": "12345"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "Business" with id "{{businessId}}" should contain json:
    """
    {
      "_id": "{{businessId}}",
      "currency": "USD"
    }
    """

  Scenario: Business removed
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "users.event.business.removed",
      "payload": {
        "_id": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "Business" with id "{{businessId}}" should not contain json:
    """
    {
      "_id": "{{businessId}}"
    }
    """

  Scenario: Business mailer-report.event.report-data.requested
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "mailer-report.event.report-data.requested",
      "payload": {
        "businessIds": ["3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"]
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
      """
      [
          {
             "name": "widgets.event.report-data.prepared",
              "payload":[{
                 "business": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99",
                 "posPopularProductsWeek": [],
                 "posRevenuesAmountWeek": 0,
                 "shopPopularProductsWeek": [],
                 "shopRevenuesAmountWeek": 0,
                 "transactionsDailyData": [
                   {
                     "amount": 0,
                     "currency": "EUR",
                     "date": "*"
                   }
                 ]
              }]
          }
      ]
      """

  Scenario: Business mailer-report.event.report-data.requested
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "mailer-report.event.report-data.requested",
      "payload": {
        "businessIds": ["3b8e9196-ccaa-4863-8f1e-19c18f2e4b91"]
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
      """
      [
          {
             "name": "widgets.event.report-data.prepared",
              "payload":[{
                 "business": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b91"
              }]
          }
      ]
      """
