Feature: If product was imported successfully or with fail, synchronization task item for this product should be marked as processed and if no unprocessed items remains task should be marked as successful
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """

  Scenario: Task has only one unprocessed product item, receiving success message
    Given I use DB fixture "file-import/synchronization-task-with-one-unprocessed-product"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "products.event.product-synchronization.succeeded",
        "payload": {
          "product": {
            "sku": "{{itemSku}}"
          },
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "success"
        }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemProduct":
      """
        {
          "sku": "{{itemSku}}",
          "type": "product",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemProduct" should contain json:
      """
      {
        "isProcessed": true
      }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
         {
           "name": "payever.event.business.email",
           "payload": {
             "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
             "templateName": "products-import-successful",
             "variables": {
               "errorsList": []
             }
           }
         }
      ]
      """

  Scenario: Task has several unprocessed product items, receiving success message for one of them
    Given I use DB fixture "file-import/synchronization-task-with-several-unprocessed-products"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "products.event.product-synchronization.succeeded",
        "payload": {
          "product": {
            "sku": "{{itemSku}}"
          },
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "in_progress"
        }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemProduct":
      """
        {
          "sku": "{{itemSku}}",
          "type": "product",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemProduct" should contain json:
      """
      {
        "isProcessed": true
      }
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
         {
           "name": "payever.event.business.email",
           "payload": {
             "templateName": "products-import-successful"
           }
         }
      ]
      """

  Scenario: Task has only one unprocessed product item, receiving failure message
    Given I use DB fixture "file-import/synchronization-task-with-one-unprocessed-product"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "products.event.product-synchronization.failed",
        "payload": {
          "product": {
            "sku": "{{itemSku}}"
          },
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          },
          "errorMessage": "Some error, occurred during import"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "success"
        }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemProduct":
      """
        {
          "sku": "{{itemSku}}",
          "type": "product",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemProduct" should contain json:
      """
      {
        "isProcessed": true
      }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
         {
           "name": "payever.event.business.email",
           "payload": {
             "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
             "templateName": "products-import-successful",
             "variables": {
               "errorsList": [
                 {
                   "messages": [
                     "Some error, occurred during import"
                   ],
                   "sku": "Test_SKU"
                 }
               ]
             }
           }
         }
      ]
      """

  Scenario: Success product import message received before success file parsed message
    Given I use DB fixture "file-import/synchronization-task-in-queue"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "products.event.product-synchronization.succeeded",
        "payload": {
          "product": {
            "sku": "{{itemSku}}"
          },
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "in_queue"
        }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemProduct":
      """
        {
          "sku": "{{itemSku}}",
          "type": "product",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemProduct" should contain json:
      """
      {
        "isProcessed": true
      }
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
         {
           "name": "payever.event.business.email",
           "payload": {
             "templateName": "products-import-successful"
           }
         }
      ]
      """

  Scenario: Failed product import message received before success file parsed message
    Given I use DB fixture "file-import/synchronization-task-in-queue"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "products.event.product-synchronization.failed",
        "payload": {
          "product": {
            "sku": "{{itemSku}}"
          },
          "synchronizationTask": {
            "id": "{{synchronizationTaskId}}"
          },
          "errorMessage": "Some error, occurred during import"
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "in_queue",
          "errorsList": [
            {
              "messages" : [
                  "Some error, occurred during import"
              ],
              "sku" : "Test_SKU"
            }
          ]
        }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemProduct":
      """
        {
          "sku": "{{itemSku}}",
          "type": "product",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemProduct" should contain json:
      """
      {
        "isProcessed": true
      }
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
         {
           "name": "payever.event.business.email",
           "payload": {
             "templateName": "products-import-successful"
           }
         }
      ]
      """
