Feature: If products file was not parsed, task status should become "Failed" and email with error message should be sent
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Received message with failed import
    Given I use DB fixture "file-import/success-file-import"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "product-files.event.import.failed",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "message": "Import with task id {{synchronizationTaskId}} failed",
            "error": {
              "kind": "validation-failed",
              "data": [
                "Element 'unknownTag': This element is not expected. Expected is one of ( sku, type, title, description, images, hidden, price, currency, sales-price, bar-code ).\n"
              ]
            },
            "errorMessage": "[\"Element 'unknownTag': This element is not expected. Expected is one of ( sku, type, title, description, images, hidden, price, currency, sales-price, bar-code ).\\n\"]"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "failure",
          "errorsList": [
            {
              "messages": "[\"Element 'unknownTag': This element is not expected. Expected is one of ( sku, type, title, description, images, hidden, price, currency, sales-price, bar-code ).\\n\"]"
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
             "templateName": "products-import-failed",
             "variables": {
               "errorsList": [
                 {
                   "messages": [
                     "[\"Element 'unknownTag': This element is not expected. Expected is one of ( sku, type, title, description, images, hidden, price, currency, sales-price, bar-code ).\\n\"]"
                   ]
                 }
               ]
             }
           }
         }

      ]
      """
