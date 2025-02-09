Feature: Onboarding events controller
  Background:
    Given I remember as "businessId" following value:
      """
      "32061e24-2ce2-45b0-a431-da36457a0887"
      """
  Scenario: Payment created event
    Given I use DB fixture "businesses"

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "onboarding.event.setup.device-payments",
      "payload": {
        "settingsData": {
          "secondFactor": true,
          "verificationType": 1,
          "autoresponderEnabled": false
        },
        "businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "Business" by following JSON and remember as "business":
    """
    {
      "_id": "21e67ee2-d516-42e6-9645-46765eadd0ac"
    }
    """
    And stored value "business" should contain json:
    """
    {
      "settings": {
        "secondFactor": true,
        "verificationType": 1,
        "autoresponderEnabled": false
      }
    }
    """