Feature: Handle channel bus message events
    
  Scenario: channel created
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "channelId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe0"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "channels.event.channel-set.created",
      "payload": {
          "id": "{{channelId}}",
        "business": { 
          "id": "{{businessId}}",
          "currency": "USD"
        },
        "channel": {
          "type": "facebook"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "ChannelSet" with id "{{channelId}}" should contain json:
    """
    {
      "_id": "{{channelId}}"
    }
    """
    
  Scenario: channel monolith.channel-set.migrate
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "channelId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe1"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "monolith.channel-set.migrate",
      "payload": {
        "uuid": "{{channelId}}",
        "business_uuid": "{{businessId}}",
        "channel_type": "facebook"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "ChannelSet" with id "{{channelId}}" and remember as "data"
    And print storage key "data"
    And model "ChannelSet" with id "{{channelId}}" should contain json:
    """
    {
      "_id": "{{channelId}}"
    }
    """
    
  Scenario: channel named
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "channelId" following value:
    """
    "9e9dd289-758c-44a2-9a24-8443b049aeef"
    """
    Given I use DB fixture "transactions-app/channel-set-transactions/get-last-daily"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "channels.event.channel-set.named",
      "payload": {
        "id": "{{channelId}}",
        "name": "string"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "ChannelSet" with id "{{channelId}}" should contain json:
    """
    {
      "_id": "{{channelId}}",
      "name": "string"
    }
    """
    
  Scenario: channel shop.event.shop-active.updated
    Given I remember as "businessId" following value:
    """
    "1ad81b43-174f-4549-b776-228cf4be9bd1"
    """
    Given I remember as "channelId" following value:
    """
    "9e9dd289-758c-44a2-9a24-8443b049aeef"
    """
    Given I use DB fixture "transactions-app/channel-set-transactions/get-last-daily"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "shop.event.shop-active.updated",
      "payload": {
        "channelSetId": "{{channelId}}",
        "businessId": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "ChannelSet" with id "{{channelId}}" and remember as "data"
    And print storage key "data"
    And model "ChannelSet" with id "{{channelId}}" should contain json:
    """
    {
      "_id": "{{channelId}}",
      "active": true
    }
    """
