Feature: Business bus

  Scenario: On business created event
    Given I use DB fixture "businesses"
    And I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["terminals"] }
      """
    And I publish in RabbitMQ channel "async_events_pos_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "3f19f5c3-d786-4cf9-b712-7806b820d9ec",
          "logo": "picture.png",
          "name": "Business 1"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_pos_micro" channel
    And model "Business" with id "3f19f5c3-d786-4cf9-b712-7806b820d9ec" should contain json:
      """
      {
        "_id": "3f19f5c3-d786-4cf9-b712-7806b820d9ec",
        "logo": "picture.png",
        "name": "Business 1"
      }
      """
    And model "Terminal" found by following JSON should exist:
      """
      {
        "businessId": "3f19f5c3-d786-4cf9-b712-7806b820d9ec",
        "logo": "picture.png"
      }
      """

