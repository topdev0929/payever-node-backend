Feature: If contacts file was successfully parsed, task status should become "In Progress" or "Success" and imported items should be created
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "c72ea71f-1c09-4a4a-915a-145d99186f81"
      """

  Scenario: Received message with success import
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
          "name": "contact-files.event.import.success",
          "payload": {
            "fileImport": {
              "fileUrl": "http://test.com/some.xml"
            },
            "synchronization": {
              "taskId": "{{synchronizationTaskId}}"
            },
            "errors": [],

            "items": [
              {
                "email": "contact_email1",
                "type": "contact"
              },
              {
                "email": "contact_email2",
                "type": "contact"
              }
            ]
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "in_progress"
        }
      """

  Scenario: Received message with success import, but have some notices
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
        {
          "name": "contact-files.event.import.success",
          "payload": {
            "synchronization": {
              "taskId": "{{synchronizationTaskId}}"
            },
            "items": [
              {
                "email": "contact_email1",
                "type": "contact"
              }
            ],
            "errors": [
              {
                "messages": [
                  "Unable to import the images below. Please map them to your file appropriately \n [unmapedImage1.png, unmapedImage2.jpg]"
                ]
              }
            ]
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "in_progress",
          "errorsList": [
            {
              "messages": [
                "Unable to import the images below. Please map them to your file appropriately \n [unmapedImage1.png, unmapedImage2.jpg]"
              ]
            }
          ]
        }
      """

  Scenario: Received message with success import, but no items were found in file
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
        {
          "name": "contact-files.event.import.success",
          "payload": {
            "synchronization": {
              "taskId": "{{synchronizationTaskId}}"
            },
            "items": [],
            "errors": []
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
