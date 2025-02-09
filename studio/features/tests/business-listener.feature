Feature: Channel set API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """

  Scenario: Listening business event create
    Given I use DB fixture "sample.data"
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["studio-folder", []], "result": [] }
      """
    When I publish in RabbitMQ channel "async_events_studio_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "test",
          "currency": "eur",
          "companyAddress": {
            "country": "germany"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_studio_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "test"
      }
      """
    Then I look for model "UserMedia" by following JSON and remember as "userMedia":
      """
      {
        "businessId": "{{businessId}}",
        "name": "Sample media 1",
        "mediaType": "image"
      }
      """
    And stored value "userMedia" should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "name": "Sample media 1",
        "mediaType": "image",
        "url": "*"
      }
      """
    Then I look for model "UserMedia" by following JSON and remember as "userMedia2":
      """
      {
        "businessId": "{{businessId}}",
        "name": "Sample media 2",
        "mediaType": "image"
      }
      """
    And stored value "userMedia2" should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "name": "Sample media 2",
        "mediaType": "image",
        "url": "*"
      }
      """

  Scenario: Received business updated method
    Given I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_studio_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_studio_micro" channel
    Then model "Business" with id "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d" should contain json:
      """
      {
        "_id": "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      }
      """

  Scenario: Received business updated method
    Given I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_studio_micro" message with json:
      """
      {
        "name": "users.event.business.export",
        "payload": {
          "_id": "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_studio_micro" channel
    Then model "Business" with id "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d" should contain json:
      """
      {
        "_id": "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      }
      """

  Scenario: Listening business event remove
    Given I use DB fixture "sample.data"
    When I publish in RabbitMQ channel "async_events_studio_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_studio_micro" channel
    Then model "Business" with id "{{businessId}}" should not exist
    Then model "UserMedia" found by following JSON should not exist:
      """
      {
        "businessId": "{{businessId}}",
        "name": "Sample media 1",
        "mediaType": "image"
      }
      """
