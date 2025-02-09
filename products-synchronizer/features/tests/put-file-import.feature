Feature: Put file import
  Background:
    Given I use DB fixture "put-file-import/background"
    Given I remember as "businessId" following value:
      """
      "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
      """
    Given I remember as "fileUrl" following value:
      """
      "https://test.com/some.xml"
      """

  Scenario: Create a task for file import request
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "product-files.event.import.requested",
        "payload": {
          "businessId": "{{businessId}}",
          "fileImport": {
            "fileUrl": "{{fileUrl}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel

    Then model "SynchronizationTask" found by following JSON should exist:
      """
      {        
        "businessId": "{{businessId}}",
        "kind": "file-import",
        "direction": "inward",
        "status": "in_queue"
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "synchronizer.event.file-import.triggered",
          "payload": {
            "business": {},
            "synchronization": {
              "taskId": "*"
            },
            "fileImport": {
              "overwriteExisting": false,
              "fileUrl": "{{fileUrl}}"
            }
          }
        }
      ]
      """
