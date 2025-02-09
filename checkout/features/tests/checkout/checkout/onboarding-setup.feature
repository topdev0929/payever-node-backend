Feature: Checkout onboarding 

  Scenario: On onboarding setup checkout
    Given I use DB fixture "checkout/checkout-integration-subscription/install/on-installed-and-enabled-in-business"
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
    And I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.checkout",
        "payload": {
          "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integrationsToInstall": ["qr"],
          "updateData": {
            "name": "test"
          }
        }
      }
      """
    When I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    And print RabbitMQ message list
    And look for model "Checkout" with id "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054" and remember as "checkout"
    And print storage key "checkout"
    And stored value "checkout" should contain json:
      """
      {
        "_id": "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054",
        "name": "test"
      }
      """

  Scenario: On onboarding setup checkout - add to pending pending installation
    And I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.checkout",
        "payload": {
          "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integrationsToInstall": ["qr"],
          "updateData": {
            "name": "test"
          }
        }
      }
      """
    When I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    And print RabbitMQ message list
    And look for model "PendingInstallation" by following JSON and remember as "pendingInstallation":
      """
      { "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f" }
      """
    And print storage key "pendingInstallation"
    And stored value "pendingInstallation" should contain json:
      """
      {
        "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
        "payload": {
          "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integrationsToInstall": ["qr"],
          "updateData": {
            "name": "test"
          }
        }
      }
      """
