Feature: Appointment
  Background:
    Given I remember as "businessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "spotlight",
          {
            "businessId": "{{businessId}}"
          }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "spotlight",
          {}
         ],
        "result": {}
      }
      """

  Scenario: CRUD
    Given I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "appointments.event.appointment.created",
          "payload": {
            "_id": "test-1",
            "businessId": "{{businessId}}",
            "note": "note",
            "date": "25/10/2019"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "_id": "test-1",
        "title": "25/10/2019",
        "description": "note"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "appointments.event.appointment.export",
          "payload": {
            "_id": "test-2",
            "businessId": "{{businessId}}",
            "note": "note",
            "date": "25/10/2019"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "_id": "test-2",
        "title": "25/10/2019",
        "description": "note"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "appointments.event.appointment.updated",
          "payload": {
            "_id": "test-1",
            "businessId": "{{businessId}}",
            "note": "note-1",
            "date": "25/10/2019"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "title": "25/10/2019",
        "description": "note-1"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "appointments.event.appointment.removed",
          "payload": {
            "_id": "test-1",
            "businessId": "{{businessId}}",
            "note": "note-1",
            "date": "25/10/2019"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

