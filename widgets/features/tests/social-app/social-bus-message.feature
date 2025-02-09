Feature: Handle social bus message events

  Scenario: social post created
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "social.event.post.created",
      "payload": {
        "title": "title",
        "content": "content",
        "type": "media",
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "SocialPost" by following JSON and remember as "data":
    """
    {
      "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "title": "title",
      "content": "content",
      "type": "media",
      "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    }
    """

  Scenario: social post updated
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "social.event.post.updated",
      "payload": {
        "title": "title",
        "content": "content",
        "type": "media",
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "SocialPost" by following JSON and remember as "data":
    """
    {
      "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "title": "title",
      "content": "content",
      "type": "media",
      "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    }
    """

  Scenario: social post deleted
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "social.event.post.deleted",
      "payload": {
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "SocialPost" with id "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" should not exist

  Scenario: social post exported
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "social.event.post.export",
      "payload": {
        "title": "title",
        "content": "content",
        "type": "media",
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "SocialPost" by following JSON and remember as "data":
    """
    {
      "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "title": "title",
      "content": "content",
      "type": "media",
      "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    }
    """
