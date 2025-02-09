Feature: Create business
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Send created business message
    When I publish in RabbitMQ channel "async_events_media_micro" message with json:
    """
      {
        "name": "users.event.business.created",
        "payload":{
          "_id": "{{businessId}}"
        }
      }
    """
    When I process messages from RabbitMQ "async_events_media_micro" channel
    Then I look for model "Business" by following JSON and remember as "businessB":
    """
      {
        "_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      }
    """
    And stored value "businessB" should contain json:
    """
      {
        "_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      }
    """
