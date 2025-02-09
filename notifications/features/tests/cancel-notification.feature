Feature: Notifications cancellation
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "appName" following value:
      """
      "shop"
      """

  Scenario: Remove cancelled notification
    Given I use DB fixture "cancel-notification"
    And I publish in RabbitMQ channel "async_events_notifications_micro" message with json:
    """
      {
        "name": "notifications.event.notification.cancel",
        "payload": {
          "kind": "business",
          "entity": "{{businessId}}",
          "app": "{{appName}}",
          "message": "some_test_message"
        }
      }

    """
    When I process messages from RabbitMQ "async_events_notifications_micro" channel
    And print RabbitMQ message list
    Then model "Notification" found by following JSON should not exist:

      """
      {
        "kind": "business",
        "entity": "{{businessId}}",
        "app": "{{appName}}",
        "message": "some_test_message"
      }
      """
