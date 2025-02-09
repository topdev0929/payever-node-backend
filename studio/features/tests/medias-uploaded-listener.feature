Feature: Bulk media upload listener

  Background:
    Given I remember as "businessId" following value:
      """
      "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://payevertesting.blob.core.windows.net/builder/fc45b28c-9fca-4c18-9d4c-f5e977a41ca8-eci1.jpg"
      },
      "response": {
        "status": 200
      }
    }
    """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://payevertesting.blob.core.windows.net/miscellaneous/6ee957e2-1077-49ec-9b40-ed54e95b0811-eci1.jpg"
      },
      "response": {
        "status": 200
      }
    }
    """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "studio-folder",
          {}
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "studio-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: User upload media
    When I publish in RabbitMQ channel "async_events_studio_micro" message with json:
      """
      {
        "name": "media.event.studio.medias.uploaded",
        "payload": {
          "baseUrl": "https://payevertesting.blob.core.windows.net/builder/",
          "businessId": "{{businessId}}",
          "medias": [
            {
              "blobName": "fc45b28c-9fca-4c18-9d4c-f5e977a41ca8-eci1.jpg",
              "brightnessGradation": "default",
              "thumbnail": "fc45b28c-9fca-4c18-9d4c-f5e977a41ca8-eci1.jpg-thumbnail"
            }
          ]
        }
      }
      """
    And process messages from RabbitMQ "async_events_studio_micro" channel
    Then I look for model "UserMedia" by following JSON and remember as "userMedia":
      """
      {
        "businessId": "{{businessId}}",
        "name": "eci1",
        "mediaType": "image"
      }
      """
    And stored value "userMedia" should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "name": "eci1",
        "mediaType": "image",
        "url": "*"
      }
      """
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "studio.event.user.medias.uploaded",
          "payload": {
            "businessId": "{{businessId}}",
            "medias": [
              {
                "name": "eci1",
                "type": "jpg",
                "url": "https://payevertesting.blob.core.windows.net/builder/*-eci1.jpg"
              }
            ]
          }
        }
      ]
      """

  Scenario: User upload media Error
    When I publish in RabbitMQ channel "async_events_studio_micro" message with json:
      """
      {
        "name": "media.event.studio.medias.uploaded.error",
        "payload": {
          "businessId": "{{businessId}}",
          "error": {
            "errno": -4058,
            "syscall": "open",
            "code": "ENOENT",
            "path": "/tmp/3835703e-b722-4a64-9f27-e9ceded8cf47"
          },
          "medias": [
            "1sec.mp4"
          ]
        }
      }
      """
    And process messages from RabbitMQ "async_events_studio_micro" channel
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "studio.event.user.medias.uploaded.error",
          "payload": {
            "businessId": "{{businessId}}",
            "medias": [
              "1sec.mp4"
            ]
          }
        }
      ]
      """

  Scenario: Subscription upload media
    When I publish in RabbitMQ channel "async_events_studio_micro" message with json:
      """
      {
        "name": "media.event.studio.medias.uploaded",
        "payload": {
          "medias": [
            {
              "id": "f0c425bc-46ed-4a61-a289-6bb299275dd7",
              "url": "https://payevertesting.blob.core.windows.net/miscellaneous/6ee957e2-1077-49ec-9b40-ed54e95b0811-eci1.jpg"
            }
          ]
        }
      }
      """
    And process messages from RabbitMQ "async_events_studio_micro" channel
    Then I look for model "SubscriptionMedia" by following JSON and remember as "userMedia":
      """
      {
        "name": "eci1",
        "mediaType": "image"
      }
      """
    And stored value "userMedia" should contain json:
      """
      {
        "_id": "*",
        "name": "eci1",
        "mediaType": "image",
        "url": "*"
      }
      """
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "studio.event.subscription.medias.uploaded",
          "payload": {
            "medias": [
              {
                "name": "eci1",
                "type": "jpg",
                "url": "https://payevertesting.blob.core.windows.net/miscellaneous/*-eci1.jpg"
              }
            ]
          }
        }
      ]
      """

  Scenario: Subscribe upload media Error
    When I publish in RabbitMQ channel "async_events_studio_micro" message with json:
      """
      {
        "name": "media.event.studio.medias.uploaded.error",
        "payload": {
          "error": {
            "errno": "ECONNRESET",
            "code": "ECONNRESET",
            "syscall": "read"
          },
          "medias": [
            "eci1.jpg"
          ]
        }
      }
      """
    And process messages from RabbitMQ "async_events_studio_micro" channel
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "studio.event.subscription.medias.uploaded.error",
          "payload": {
            "medias": [
              "eci1.jpg"
            ]
          }
        }
      ]
      """
