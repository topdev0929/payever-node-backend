@bpo-migrate
Feature: Migrate BPO

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "integrationId" following value:
      """
      "bce8ef2c-e88c-4066-acb0-1154bb995efc"
      """
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "connectionId" following value:
      """
      "4ca57652-6881-4b54-9c11-ce00c79fcb45"
      """
    Given I remember as "connectionName" following value:
      """
      "Connection One"
      """

  Scenario: Update business payment option custom limits
    Given I remember as "completed" following value:
      """
      "true"
      """
    Given I remember as "status" following value:
      """
      "enabled"
      """
    Given I remember as "checkoutIdOne" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutIdTwo" following value:
      """
      "184a8e77-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I use DB fixture "connection/bpo-bus-message/bpo-created/integration-of-payments-installed"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "checkout.event.business-payment-option.migrate",
        "payload": {
          "business_payment_option": {
            "uuid": "{{connectionId}}",
            "name": "{{connectionName}}",
            "business_uuid": "{{businessId}}",
            "payment_method": "{{integrationName}}",
            "completed": {{completed}},
            "status": "{{status}}",
            "vendor_min_amount": 20,
            "vendor_max_amount": 1500,
            "default": "1"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    And I look for model "Connection" by following JSON and remember as "migratedConnection":
      """
      {
        "_id": "{{connectionId}}"
      }
      """
    And stored value "migratedConnection" should contain json:
    """
      {
        "_id": "{{connectionId}}",
        "name": "{{connectionName}}",
        "options": {
          "default": true,
          "minAmount": 20,
          "maxAmount": 1500
        }
      }
    """
