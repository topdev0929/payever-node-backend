Feature: Contact
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
          "name": "contacts.event.contact.created",
          "payload": {
            "contact": {
              "_id": "test-1",
              "businessId": "{{businessId}}",
              "fields": [
                {
                  "field": {
                    "name": "firstName"
                  },
                  "value": "Talwinder"
                },
                {
                  "field": {
                    "name": "lastName"
                  },
                  "value": "Singh"
                },
                {
                  "field": {
                    "name": "email"
                  },
                  "value": "test@gmail.com"
                }
              ]
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "_id": "test-1",
        "title": "Talwinder Singh",
        "description": "test@gmail.com"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "contacts.event.contact.exported",
          "payload": {
            "contact": {
              "_id": "test-2",
              "businessId": "{{businessId}}",
              "fields": [
                {
                  "field": {
                    "name": "firstName"
                  },
                  "value": "Talwinder"
                },
                {
                  "field": {
                    "name": "lastName"
                  },
                  "value": "Singh"
                },
                {
                  "field": {
                    "name": "email"
                  },
                  "value": "test@gmail.com"
                }
              ]
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "_id": "test-2",
        "title": "Talwinder Singh",
        "description": "test@gmail.com"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "contacts.event.contact.updated",
          "payload": {
            "contact": {
              "_id": "test-1",
              "businessId": "{{businessId}}",
              "fields": [
                {
                  "field": {
                    "name": "firstName"
                  },
                  "value": "Talwinder"
                },
                {
                  "field": {
                    "name": "lastName"
                  },
                  "value": "Singh"
                },
                {
                  "field": {
                    "name": "email"
                  },
                  "value": "test1@gmail.com"
                }
              ]
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "title": "Talwinder Singh",
        "description": "test1@gmail.com"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "contacts.event.contact.removed",
          "payload": {
            "contact": {
              "_id": "test-1",
              "businessId": "{{businessId}}",
              "fields": [
                {
                  "field": {
                    "name": "firstName"
                  },
                  "value": "Talwinder"
                },
                {
                  "field": {
                    "name": "lastName"
                  },
                  "value": "Singh"
                },
                {
                  "field": {
                    "name": "email"
                  },
                  "value": "test@gmail.com"
                }
              ]
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

