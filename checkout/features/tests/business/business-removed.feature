Feature: Business API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "channelSetIdOne" following value:
      """
      "69864cec-341b-42a0-8221-37a248c28d38"
      """
    Given I remember as "channelSetIdTwo" following value:
      """
      "2e04582d-374f-4ea6-ae8d-ce83d9522f9f"
      """

  Scenario: Updating name and currency of existing business
    Given I use DB fixture "business/business-bus-message/business.removed/existing-business"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
            "_id": "{{checkoutId}}"
          }
         ],
        "result": {}
      }
      """
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should not exist
    Then model "Checkout" with id "{{checkoutId}}" should not exist
    Then model "Checkout" found by following JSON should not exist:
      """
      {
        "businessId": "{{businessId}}"
      }
      """
    Then model "ChannelSet" found by following JSON should not exist:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdOne}}" should not exist
    Then model "ChannelSet" with id "{{channelSetIdTwo}}" should not exist
    Then model "BusinessIntegrationSubscription" found by following JSON should not exist:
      """
      {
        "business": "{{businessId}}"
      }
      """
    Then model "CheckoutIntegrationSubscription" found by following JSON should not exist:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
