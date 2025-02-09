Feature: Variants attributes should be parsed and passed to synchronizer
  Scenario: XML import: Sending xml with variants attributes
    Given I get file "features/fixtures/xml/product-with-three-variants.xml" content and remember XML minified and JSON encoded as "importXml"
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "get",
          "url": "http://test.com/some.xml"
        },
        "response": {
          "status": 200,
          "body": {{importXml}}
        }
      }
      """
    When I publish in RabbitMQ channel "async_events_product_files_micro" message with json:
    """
    {
      "name": "synchronizer.event.file-import.triggered",
      "payload": {
        "fileImport": {
          "fileUrl": "http://test.com/some.xml"
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