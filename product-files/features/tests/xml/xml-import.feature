Feature: Handling trigger event
  Scenario: Success xml import
    Given I get file "features/fixtures/xml/file-for-success-import.xml" content and remember XML minified and JSON encoded as "importXml"
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
          "data": {
            "sku": "1234",
            "currency": "eur",
            "type": "physical",
            "title": "Some product",
            "description": "Some product description",
            "active": true,
            "price": 100,
            "sale": {
              "onSales": true,
              "saleEndDate": "2023-01-31",
              "salePercent": 50,
              "salePrice": 50,
              "saleStartDate": "2023-01-01"
            },
            "barcode": "bar-code",
            "images": [
              "https://test.com/some.png",
              "https://test.com/someother.png"
            ],
            "imagesUrl": [
              "https://test.com/some.png",
              "https://test.com/someother.png"
            ],
            "channelSets": [
              "a918abc5-dbd7-405e-8cec-c4ad57f570bf"
            ],
            "categories": [
              "Some category"
            ],
            "variants": [],
            "shipping": {
              "height": 3,
              "length": 1,
              "weight": 4,
              "width": 2
            },
            "attributes": [],
            "variantAttributes": [],
            "inventory": {
              "stock": 100,
              "reserved": 50
            }
          },
          "synchronization": {
            "taskId": "123"
          }
        }
      },
      {
        "name": "product-files.event.product.imported",
        "payload": {
          "data": {
            "sku": "456",
            "type": "digital",
            "title": "Some digital product",
            "description": "Some description",
            "active": true,
            "price": 100,
            "sale": {
              "onSales": true,
              "saleEndDate": "2023-01-31",
              "salePercent": 50,
              "salePrice": 50,
              "saleStartDate": "2023-01-01"
            },
            "barcode": "123123",
            "images": [],
            "imagesUrl": [],
            "channelSets": [],
            "categories": [],
            "variants": [],
            "attributes": [],
            "variantAttributes": [],
            "inventory": {
              "stock": 100,
              "reserved": 50
            }
          },
          "synchronization": {
            "taskId": "123"
          }
        }
      },
      {
        "name": "product-files.event.product.imported",
        "payload": {
          "data": {
            "sku": "678",
            "type": "service",
            "title": "Some service product",
            "description": "Some description",
            "active": true,
            "price": 100,
            "sale": {
              "onSales": true,
              "saleEndDate": "2023-01-31",
              "salePercent": 50,
              "salePrice": 50,
              "saleStartDate": "2023-01-01"
            },
            "barcode": "123123",
            "images": [
              "https://test.com/some.png",
              "https://test.com/someother.png"
            ],
            "imagesUrl": [
              "https://test.com/some.png",
              "https://test.com/someother.png"
            ],
            "channelSets": [],
            "categories": [],
            "variants": [
              {
                "sku": "Variant1_SKU",
                "title": "Variant 1",
                "description": "Variant 1",
                "price": 50,
                "sale": {
                  "onSales": true,
                  "saleEndDate": "2023-01-31",
                  "salePercent": 50,
                  "salePrice": 50,
                  "saleStartDate": "2023-01-01"
                },
                "barcode": "123125",
                "images": [],
                "imagesUrl": [],
                "attributes": [],
                "options": [],
                "inventory": {
                  "stock": 100,
                  "reserved": 50
                }
              },
              {
                "sku": "Variant2_SKU",
                "title": "Variant 2",
                "description": "Variant 2",
                "price": 50,
                "sale": {
                  "onSales": true,
                  "saleEndDate": "2023-01-31",
                  "salePercent": 50,
                  "salePrice": 50,
                  "saleStartDate": "2023-01-01"
                },
                "barcode": "123126",
                "images": [],
                "imagesUrl": [],
                "attributes": [],
                "options": [],
                "inventory": {
                  "stock": 50,
                  "reserved": 40
                }
              }
            ],
            "attributes": [],
            "variantAttributes": []
          },
          "synchronization": {
            "taskId": "123"
          }
        }
      },
      {
        "name": "product-files.event.import.success",
        "payload": {
          "fileImport": {
            "fileUrl": "http://test.com/some.xml"
          },
          "synchronization": {
            "taskId": "123"
          },
          "errors": [],
          "items": [
            {
              "sku": "1234",
              "type": "product"
            },
            {
              "sku": "1234",
              "type": "inventory"
            },
            {
              "sku": "456",
              "type": "product"
            },
            {
              "sku": "456",
              "type": "inventory"
            },
            {
              "sku": "678",
              "type": "product"
            },
            {
              "sku": "Variant1_SKU",
              "type": "inventory"
            },
            {
              "sku": "Variant2_SKU",
              "type": "inventory"
            }
          ]
        }
      }
    ]
    """

  Scenario: Should fail if parsing failed on XSD validation
    Given I get file "features/fixtures/xml/file-with-unknown-tag.xml" content and remember XML minified and JSON encoded as "importXml"
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
        "name": "product-files.event.import.failed",
        "payload": {
          "data": {
            "error": {
              "kind": "validation-failed",
              "data": [
                "Element 'unknownTag': This element is not expected. Expected is one of ( sku, type, title, description, images, hidden, price, currency, sale, bar-code ).\n"
              ]
            },
            "errorMessage": "[\"Element 'unknownTag': This element is not expected. Expected is one of ( sku, type, title, description, images, hidden, price, currency, sale, bar-code ).\\n\"]",
            "message": "Import with task id 123 failed"
          },
          "synchronization": {
            "taskId": "123"
          }
        }
      }
    ]
    """
