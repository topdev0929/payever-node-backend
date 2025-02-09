Feature: If contacts file was not parsed, task status should become "Failed" and email with error message should be sent
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "c72ea71f-1c09-4a4a-915a-145d99186f81"
      """
    Given I remember as "businessId" following value:
      """
      "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
      """

  Scenario: Received message with failed import
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
        "name": "contact-files.event.import.failed",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "message": "Import with task id {{synchronizationTaskId}} failed",
            "error": {
              "kind": "validation-failed",
              "data": [
                "Element 'unknownTag': This element is not expected. Expected is one of ( email, type, title, description, images, hidden, price, currency, sales-price, bar-code ).\n"
              ]
            },
            "errorMessage": "[\"Element 'unknownTag': This element is not expected. Expected is one of ( email, type, title, description, images, hidden, price, currency, sales-price, bar-code ).\\n\"]"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "failure",
          "errorsList": [
            {
              "messages": "[\"Element 'unknownTag': This element is not expected. Expected is one of ( email, type, title, description, images, hidden, price, currency, sales-price, bar-code ).\\n\"]"
            }
          ]
        }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
         {
           "name": "payever.event.business.email",
           "payload": {
             "businessId": "{{businessId}}",
             "templateName": "contacts-import-failed",
             "variables": {
               "errorsList": [
                 {
                   "messages": [
                     "[\"Element 'unknownTag': This element is not expected. Expected is one of ( email, type, title, description, images, hidden, price, currency, sales-price, bar-code ).\\n\"]"
                   ]
                 }
               ]
             }
           }
         }
      ]
      """
