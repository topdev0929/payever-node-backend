Feature: Handling trigger event
  Scenario: CSV import: Success csv import
    Given I get file "features/fixtures/csv/file-for-success-import.csv" content and remember JSON encoded as "importCsv"
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
          "data": {
            "active": true,
            "attributes": [],
            "barcode": "bar-code",
            "categories": [],
            "currency": "eur",
            "description": "Some product description",
            "images": [
              "https://test.com/some.png,https://test.com/someother.png"
            ],
            "inventory": {
              "reserved": 50,
              "stock": 100
            },
            "price": 100,
            "sale": {
              "onSales": true,
              "saleEndDate": "2023-01-11",
              "salePercent": 70,
              "salePrice": null,
              "saleStartDate": "2023-01-01"
            },
            "shipping": {
              "height": 4,
              "length": 3,
              "weight": 1,
              "width": 2
            },
            "sku": "1234",
            "title": "Some product",
            "type": "physical",
            "variants": []
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
            "active": true,
            "attributes": [],
            "barcode": "123123",
            "categories": [],
            "currency": "",
            "description": "Some description",
            "images": [
              "https://test.com/someother.png"
            ],
            "inventory": {
              "reserved": 50,
              "stock": 100
            },
            "price": 100,
            "sale": {
              "onSales": true,
              "saleEndDate": "2023-01-21",
              "salePercent": 60,
              "salePrice": null,
              "saleStartDate": "2023-01-11"
            },
            "shipping": {
              "height": 4,
              "length": 3,
              "weight": 1,
              "width": 2
            },
            "sku": "456",
            "title": "Some digital product",
            "type": "digital",
            "variants": []
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
            "active": true,
            "attributes": [],
            "barcode": "123123",
            "categories": [],
            "currency": "",
            "description": "Some description",
            "images": [
              "https://test.com/some.png"
            ],
            "inventory": {
              "reserved": 0,
              "stock": 0
            },
            "price": 100,
            "sale": {
              "onSales": true,
              "saleEndDate": "2023-01-11",
              "salePercent": 50,
              "salePrice": null,
              "saleStartDate": "2023-01-01"
            },
            "shipping": {
              "height": 4,
              "length": 3,
              "weight": 1,
              "width": 2
            },
            "sku": "678",
            "title": "Some service product",
            "type": "service",
            "variants": [
              {
                "attributes": [],
                "barcode": "123125",
                "description": "Variant 1",
                "images": [],
                "inventory": {
                  "reserved": 50,
                  "stock": 100
                },
                "options": [
                  {
                    "name": "Size",
                    "value": "Small"
                  },
                  {
                    "name": "Color",
                    "value": "Yellow"
                  }
                ],
                "price": 50,
                "sale": {
                  "onSales": true,
                  "saleEndDate": "2023-01-21",
                  "salePercent": 40,
                  "salePrice": null,
                  "saleStartDate": "2023-01-11"
                },
                "sku": "Variant1_SKU",
                "title": "Variant 1"
              },
              {
                "attributes": [],
                "barcode": "123126",
                "description": "Variant 2",
                "images": [],
                "inventory": {
                  "reserved": 40,
                  "stock": 50
                },
                "options": [
                  {
                    "name": "Size",
                    "value": "Medium"
                  },
                  {
                    "name": "Color",
                    "value": "Red"
                  }
                ],
                "price": 50,
                "sale": {
                  "onSales": true,
                  "saleEndDate": "2023-01-31",
                  "salePercent": 30,
                  "salePrice": null,
                  "saleStartDate": "2023-01-21"
                },
                "sku": "Variant2_SKU",
                "title": "Variant 2"
              }
            ]
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
            "fileUrl": "http://test.com/some.csv"
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
              "sku": "678",
              "type": "inventory"
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

  Scenario: CSV import: Trying to parse wrong csv file
    Given I get file "features/fixtures/csv/wrong-csv-file.csv" content and remember JSON encoded as "importCsv"
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
        "name": "product-files.event.import.failed",
        "payload": {
          "synchronization": {
            "taskId": "123"
          },
          "data": {
            "message": "Import with task id 123 failed",
            "error": {
              "code": "CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH",
              "record": [
                "Test_1,Some product,Some product description,Physical,false,true,1234,bar-code,100,50,100,50,eur,https://test.com/some.png",
                "https://test.com/someother.png,,1,2,3,4"
              ]
            },
            "errorMessage": "Invalid Record Length: columns length is 1, got 2 on line 2"
          }
        }
      }
    ]
    """
