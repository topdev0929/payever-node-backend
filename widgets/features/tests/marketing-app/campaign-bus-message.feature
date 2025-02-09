Feature: Handle campaign bus message events
    
  Scenario: campaign created
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "campaignId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe0"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "marketing.event.campaign-creation.done",
      "payload": {
        "id": "{{campaignId}}",
        "channelSet": "string",
        "business": "{{businessId}}",
        "name": "string",
        "contactsCount": 3
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "Campaign" with id "{{campaignId}}" should contain json:
    """
    {
      "_id": "{{campaignId}}",
      "name": "string",
      "contactsCount": 3
    }
    """
