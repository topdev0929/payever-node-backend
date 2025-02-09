Feature: If products file was successfully parsed, task status should become "In Progress" or "Success" and imported items should be created
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """

  Scenario: Received message with success import
    Given I use DB fixture "file-import/success-file-import"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
          "name": "product-files.event.import.success",
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
                "sku": "product_sku1",
                "type": "product"
              },
              {
                "sku": "product_sku1",
                "type": "inventory"
              },
              {
                "sku": "product_sku2",
                "type": "product"
              },
              {
                "sku": "product_sku3",
                "type": "inventory"
              }
            ]
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
    And look for model "SynchronizationTaskItem" by following JSON and remember as "Item1_Inventory":
      """
        {
          "sku": "product_sku1",
          "type": "inventory",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "Item1_Inventory" should contain json:
      """
      {
        "isProcessed": false
      }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "Item1_Product":
      """
        {
          "sku": "product_sku1",
          "type": "product",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "Item1_Product" should contain json:
      """
      {
        "isProcessed": false
      }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "Item2_Product":
      """
        {
          "sku": "product_sku2",
          "type": "product",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "Item2_Product" should contain json:
      """
      {
        "isProcessed": false
      }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "Item3_Inventory":
      """
        {
          "sku": "product_sku3",
          "type": "inventory",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "Item3_Inventory" should contain json:
      """
      {
        "isProcessed": false
      }
      """

  Scenario: Received message with success import, but have some notices
    Given I use DB fixture "file-import/success-file-import"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
        {
          "name": "product-files.event.import.success",
          "payload": {
            "synchronization": {
              "taskId": "{{synchronizationTaskId}}"
            },
            "items": [
              {
                "sku": "product_sku1",
                "type": "product"
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
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
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
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemProduct":
      """
        {
          "sku": "product_sku1",
          "type": "product",
          "task": "{{synchronizationTaskId}}"
        }
      """
    And stored value "ItemProduct" should contain json:
      """
      {
        "isProcessed": false
      }
      """

  Scenario: Received message with success import, but no items were found in file
    Given I use DB fixture "file-import/success-file-import"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
        {
          "name": "product-files.event.import.success",
          "payload": {
            "synchronization": {
              "taskId": "{{synchronizationTaskId}}"
            },
            "items": [],
            "errors": []
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
