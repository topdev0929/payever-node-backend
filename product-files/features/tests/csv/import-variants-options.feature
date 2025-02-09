Feature: Variants attributes should be parsed and passed to synchronizer
  Scenario: CSV import: Sending csv with variants attributes
    Given I get file "features/fixtures/csv/product-with-three-variants.csv" content and remember JSON encoded as "importCsv"
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "get",
          "url": "http://test.com/some.csv"
        },
        "response": {
          "status": 200,
          "body": {{importCsv}}
        }
      }
      """
    When I publish in RabbitMQ channel "async_events_product_files_micro" message with json:
    """
    {
      "name": "synchronizer.event.file-import.triggered",
      "payload": {
        "fileImport": {
          "fileUrl": "http://test.com/some.csv"
        },
        "synchronization": {
          "taskId": "123"
        }
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_product_files_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
       "name": "product-files.event.product.imported",
       "payload": {
         "synchronization": {
           "taskId": "123"
         },
         "data": {
           "sku": "sku1234",
           "variants": [
             {
               "sku": "sku12345",
               "attributes": [
                  {
                    "name": "Test attribute1",
                    "value": "Test value1",
                    "type": "text"
                  },
                  {
                    "name": "Test attribute2",
                    "value": "Test value2",
                    "type": "text"
                  }
               ]
             },
             {
               "sku": "sku123456",
               "attributes": [
                  {
                    "name": "Test attribute1",
                    "value": "Test value1",
                    "type": "text"
                  }
               ]
             },
             {
               "sku": "sku1234567"
             }
           ]
         }
       }
      }
    ]
    """