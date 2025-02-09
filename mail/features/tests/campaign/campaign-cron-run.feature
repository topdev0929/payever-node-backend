Feature: Run cron for send campaign data
  Scenario: Create save cron task after rabbit message
    When campaign data sending triggered with data:
    """
      {
        "id": "id_string",
        "business": "business_string",
        "channelSet": "channelSet_string",
        "theme": "theme_string",
        "name": "name_string",
        "preview": "preview_string",
        "date": "Date",
        "status": "status_string",
        "template": "template_string"
      }
    """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
      [{
        "name": "marketing.event.campaign.send",
        "payload": {
          "campaign": {
            "id": "id_string",
            "business": "business_string",
            "channelSet": "channelSet_string",
            "theme": "theme_string",
            "name": "name_string",
            "preview": "preview_string",
            "date": "Date",
            "status": "status_string",
            "template": "template_string"
          }
        }
      }]
    """
