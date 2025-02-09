Feature: Channel set API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "channelSetId" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
          }
         ],
        "result": {}
      }
      """

  Scenario: Create new, shop type (not creating by default channel type) no any checkout
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.exported",
        "payload": {
          "businessId": "{{businessId}}",
          "customPolicy": false,
          "enabledByDefault": false,
          "type": "pos",
          "id": "{{channelSetId}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "pos"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
