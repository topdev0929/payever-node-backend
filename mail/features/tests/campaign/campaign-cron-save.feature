Feature: Campaign cron event
  Scenario: Create save cron task after rabbit message with period 'once'
    When I publish in RabbitMQ channel "async_events_marketing_micro" message with json:
    """
      {
        "name": "marketing.event.cron.add",
        "payload": {
          "period": "once",
          "campaign": {
              "id": "id_string",
              "business": "business_string",
              "channelSet": "channelSet_string",
              "theme": "theme_string",
              "name": "name_string",
              "preview": "preview_string",
              "date": "2020-08-05 14:00:00",
              "status": "status_string",
              "template": "template_string"
          },
          "date": "2020-08-06T07:12:00.000Z"
        }
      }
    """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel
    Then I look for model "CronTask" by following JSON and remember as "cronTask1":
      """
      {
        "period": "once"
      }
      """
    And stored value "cronTask1" should contain json:
      """
      {
        "period": "once",
        "input": {
          "id": "id_string",
          "business": "business_string",
          "channelSet": "channelSet_string",
          "theme": "theme_string",
          "name": "name_string",
          "preview": "preview_string",
          "date": "2020-08-05 14:00:00",
          "status": "status_string",
          "template": "template_string"
        },
        "date": "2020-08-06T07:12:00.000Z"
      }
      """

  Scenario: Create save cron task after rabbit message with period 'hour'
    When I publish in RabbitMQ channel "async_events_marketing_micro" message with json:
    """
      {
        "name": "marketing.event.cron.add",
        "payload": {
          "period": "hour",
          "campaign": {
              "id": "id_string",
              "business": "business_string",
              "channelSet": "channelSet_string",
              "theme": "theme_string",
              "name": "name_string",
              "preview": "preview_string",
              "date": "2020-08-05 14:00:00",
              "status": "status_string",
              "template": "template_string"
          },
          "minutes": 23
        }
      }
    """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel
    Then I look for model "CronTask" by following JSON and remember as "cronTask1":
      """
      {
        "period": "hour"
      }
      """
    And stored value "cronTask1" should contain json:
      """
      {
        "period": "hour",
        "input": {
          "id": "id_string",
          "business": "business_string",
          "channelSet": "channelSet_string",
          "theme": "theme_string",
          "name": "name_string",
          "preview": "preview_string",
          "date": "2020-08-05 14:00:00",
          "status": "status_string",
          "template": "template_string"
          },
          "minutes": 23
      }
      """

  Scenario: Create save cron task after rabbit message with period 'week'
    When I publish in RabbitMQ channel "async_events_marketing_micro" message with json:
    """
      {
        "name": "marketing.event.cron.add",
        "payload": {
          "period": "week",
          "campaign": {
              "id": "id_string",
              "business": "business_string",
              "channelSet": "channelSet_string",
              "theme": "theme_string",
              "name": "name_string",
              "preview": "preview_string",
              "date": "2020-08-05 14:00:00",
              "status": "status_string",
              "template": "template_string"
          },
          "hours": 11,
          "minutes": 23,
          "dayOfWeek": "monday"
        }
      }
    """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel
    Then I look for model "CronTask" by following JSON and remember as "cronTask1":
      """
      {
        "period": "week"
      }
      """
    And stored value "cronTask1" should contain json:
      """
      {
        "period": "week",
        "input": {
          "id": "id_string",
          "business": "business_string",
          "channelSet": "channelSet_string",
          "theme": "theme_string",
          "name": "name_string",
          "preview": "preview_string",
          "date": "2020-08-05 14:00:00",
          "status": "status_string",
          "template": "template_string"
          },
          "hours": 11,
          "minutes": 23,
          "dayOfWeek": "monday"
      }
      """

  Scenario: Create save cron task after rabbit message with period 'month'
    When I publish in RabbitMQ channel "async_events_marketing_micro" message with json:
    """
      {
        "name": "marketing.event.cron.add",
        "payload": {
          "period": "month",
          "campaign": {
              "id": "id_string",
              "business": "business_string",
              "channelSet": "channelSet_string",
              "theme": "theme_string",
              "name": "name_string",
              "preview": "preview_string",
              "date": "2020-08-05 14:00:00",
              "status": "status_string",
              "template": "template_string"
          },
          "hours": 11,
          "minutes": 23,
          "day": "2"
        }
      }
    """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel
    Then I look for model "CronTask" by following JSON and remember as "cronTask1":
      """
      {
        "period": "month"
      }
      """
    And stored value "cronTask1" should contain json:
      """
      {
        "period": "month",
        "input": {
          "id": "id_string",
          "business": "business_string",
          "channelSet": "channelSet_string",
          "theme": "theme_string",
          "name": "name_string",
          "preview": "preview_string",
          "date": "2020-08-05 14:00:00",
          "status": "status_string",
          "template": "template_string"
          },
          "hours": 11,
          "minutes": 23,
          "day": "2"
      }
      """
