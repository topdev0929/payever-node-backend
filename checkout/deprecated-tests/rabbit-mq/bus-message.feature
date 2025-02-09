Feature: BusMessageController messages check

  Scenario: Mail report event
    Given I use DB fixture "rabbit-mq/bus-message/mail-report"
    Given I remember as "businessId" following value:
      """
      "businessAndChannelDefaultId"
      """

    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "mailer-report.event.report-data.requested",
      "payload":{
        "businessIds":["{{businessId}}"]
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel

    Then print RabbitMQ exchange "async_events" message list

    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
       [
         {
           "name": "checkout.event.report-data.prepared",
           "payload": [
             {
               "business": "{{businessId}}",
               "posPaymentOptions": [
                 {
                   "icon": "#icon-payment-option-santander1",
                   "title": "integrations.payments.santander_pos_installment.title1"
                 }
               ]
             }
           ]
         }
       ]
      """
