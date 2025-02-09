Feature: When contact was parsed it should be sent to the contact service
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "synchronizationTaskItemId" following value:
      """
      "bf46606a-b752-4db8-9933-a70e5456f9f1"
      """
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Received contact, task has no overwrite existing option
    Given I use DB fixture "file-import/synchronization-task-no-overwrite"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
        "name": "contact-files.event.contact.imported",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "firstName": "Grün",
            "lastName": "Ampel",
            "email": "dsad@dade.de",
            "company": "",
            "addressOne": "fwfce 5",
            "addressTwo": "",
            "city": "vfsvdfv",
            "province": "",
            "provinceCode": "",
            "country": "Germany",
            "countryCode": "DE",
            "zip": "'13213",
            "phone": "",
            "acceptsMarketing": false,
            "totalSpent": "0.00",
            "totalOrders": "0",
            "tags": "",
            "note": "",
            "taxExempt": false
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "contacts-synchronizer.event.outer-contact.create",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "payload": {},
            "synchronization": {
              "taskId": "{{synchronizationTaskId}}",
              "taskItemId": "*"
            }
          }
        }
      ]
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name": "synchronizer.event.outer-stock.created"
        }
      ]
      """

  Scenario: Received contact, task has overwrite existing option
    Given I use DB fixture "file-import/synchronization-task-overwrite"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
        "name": "contact-files.event.contact.imported",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "firstName": "Grün",
            "lastName": "Ampel",
            "email": "dsad@dade.de",
            "company": "",
            "addressOne": "fwfce 5",
            "addressTwo": "",
            "city": "vfsvdfv",
            "province": "",
            "provinceCode": "",
            "country": "Germany",
            "countryCode": "DE",
            "zip": "'13213",
            "phone": "",
            "acceptsMarketing": false,
            "totalSpent": "0.00",
            "totalOrders": "0",
            "tags": "",
            "note": "",
            "taxExempt": false
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "contacts-synchronizer.event.outer-contact.upsert",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "payload": {
              "type": "person",
              "email": "dsad@dade.de",
              "fields": [
                {
                  "name": "firstName",
                  "value": "Grün"
                },
                {
                  "name": "lastName",
                  "value": "Ampel"
                },
                {
                  "name": "email",
                  "value": "dsad@dade.de"
                },
                {
                  "name": "company",
                  "value": ""
                },
                {
                  "name": "addressOne",
                  "value": "fwfce 5"
                },
                {
                  "name": "addressTwo",
                  "value": ""
                },
                {
                  "name": "city",
                  "value": "vfsvdfv"
                },
                {
                  "name": "province",
                  "value": ""
                },
                {
                  "name": "provinceCode",
                  "value": ""
                },
                {
                  "name": "country",
                  "value": "Germany"
                },
                {
                  "name": "countryCode",
                  "value": "DE"
                },
                {
                  "name": "zip",
                  "value": "'13213"
                },
                {
                  "name": "phone",
                  "value": ""
                },
                {
                  "name": "acceptsMarketing",
                  "value": false
                },
                {
                  "name": "totalSpent",
                  "value": "0.00"
                },
                {
                  "name": "totalOrders",
                  "value": "0"
                },
                {
                  "name": "tags",
                  "value": ""
                },
                {
                  "name": "note",
                  "value": ""
                },
                {
                  "name": "taxExempt",
                  "value": false
                }
              ]
            },
            "synchronization": {
              "taskId": "{{synchronizationTaskId}}",
              "taskItemId": "*"
            }
          }
        }
      ]
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name": "synchronizer.event.outer-stock.created"
        }
      ]
      """
