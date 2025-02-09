Feature: If inventory was imported successfully or with fail, synchronization task item for this inventory should be marked as processed and if no unprocessed items remains task should be marked as successful
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """

  Scenario: Task has only one unprocessed inventory item, receiving success message
    Given I use DB fixture "file-import/synchronization-task-with-one-unprocessed-inventory"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "inventory.event.inventory-synchronization.succeeded",
        "payload": {
          "inventory": {
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
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemInventory":
      """
        {
          "sku": "{{itemSku}}",
          "type": "inventory",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemInventory" should contain json:
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

  Scenario: Task has only several unprocessed inventory items, receiving success message for one of them
    Given I use DB fixture "file-import/synchronization-task-with-several-unprocessed-inventories"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "inventory.event.inventory-synchronization.succeeded",
        "payload": {
          "inventory": {
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
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemInventory":
      """
        {
          "sku": "{{itemSku}}",
          "type": "inventory",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemInventory" should contain json:
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

  Scenario: Task has only one unprocessed inventory item, receiving failure message
    Given I use DB fixture "file-import/synchronization-task-with-one-unprocessed-inventory"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "inventory.event.inventory-synchronization.failed",
        "payload": {
          "inventory": {
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
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemInventory":
      """
        {
          "sku": "{{itemSku}}",
          "type": "inventory",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemInventory" should contain json:
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

  Scenario: Success inventory import message received before success file parsed message
    Given I use DB fixture "file-import/synchronization-task-in-queue"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "inventory.event.inventory-synchronization.succeeded",
        "payload": {
          "inventory": {
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
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemInventory":
      """
        {
          "sku": "{{itemSku}}",
          "type": "inventory",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemInventory" should contain json:
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

  Scenario: Failed inventory import message received before success file parsed message
    Given I use DB fixture "file-import/synchronization-task-in-queue"
    And I remember as "itemSku" following value:
      """
      "Test_SKU"
      """
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "inventory.event.inventory-synchronization.failed",
        "payload": {
          "inventory": {
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
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemInventory":
      """
        {
          "sku": "{{itemSku}}",
          "type": "inventory",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemInventory" should contain json:
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
