Feature: If uploaded images passed after file was parsed images original names must be replaced with upload urls
  Scenario: CSV import: Send file with product images should be taken from request body
    Given I get file "features/fixtures/csv/product-with-images-in-request-body.csv" content and remember JSON encoded as "importCsv"
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
          "fileUrl": "http://test.com/some.csv",
          "uploadedImages": [
            {
              "originalName": "replace_me_1.png",
              "url": "http://test.com/replaced_1.png"
            },
            {
              "originalName": "replace_me_2.jpg",
              "url": "http://test.com/replaced_2.jpg"
            }
          ]
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
           "sku": 1234,
           "type": "physical",
           "title": "Some product",
           "images": [
              "http://test.com/replaced_1.png",
              "https://test.com/dont_replace_me.png",
              "http://test.com/replaced_2.jpg"
           ]
         }
       }
      }
    ]
    """

  Scenario: CSV import: Send file with product variants images should be taken from request body
    Given I get file "features/fixtures/csv/product-with-variants-images-in-request-body.csv" content and remember JSON encoded as "importCsv"
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
          "fileUrl": "http://test.com/some.csv",
          "uploadedImages": [
            {
              "originalName": "replace_me_1.png",
              "url": "http://test.com/replaced_1.png"
            },
            {
              "originalName": "replace_me_2.jpg",
              "url": "http://test.com/replaced_2.jpg"
            }
          ]
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
            "barcode": "123123",
            "categories": [],
            "currency": "",
            "description": "Some description",
            "images": [],
            "inventory": {
              "reserved": 0,
              "stock": 0
            },
            "price": 100,
            "sale": {
              "onSales": false,
              "salePercent": null,
              "salePrice": null
            },
            "shipping": {
              "height": 0,
              "length": 0,
              "weight": 0,
              "width": 0
            },
            "sku": "678",
            "title": "Some service product",
            "type": "service",
            "variants": [
              {
                "attributes": [],
                "barcode": "123125",
                "description": "Variant 1",
                "images": [
                  "http://test.com/replaced_1.png",
                  "https://test.com/dont_replace_me.png",
                  "http://test.com/replaced_2.jpg"
                ],
                "inventory": {
                  "reserved": 50,
                  "stock": 100
                },
                "options": [],
                "price": 50,
                "sale": {
                  "onSales": false,
                  "salePercent": null,
                  "salePrice": null
                },
                "sku": "Variant1_SKU",
                "title": "Variant 1"
              },
              {
                "attributes": [],
                "barcode": "123126",
                "description": "Variant 2",
                "images": [
                  "http://test.com/replaced_1.png"
                ],
                "inventory": {
                  "reserved": 40,
                  "stock": 50
                },
                "options": [],
                "price": 50,
                "sale": {
                  "onSales": false,
                  "salePercent": null,
                  "salePrice": null
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
            "fileUrl": "http://test.com/some.csv",
            "uploadedImages": [
              {
                "originalName": "replace_me_1.png",
                "url": "http://test.com/replaced_1.png"
              },
              {
                "originalName": "replace_me_2.jpg",
                "url": "http://test.com/replaced_2.jpg"
              }
            ]
          },
          "synchronization": {
            "taskId": "123"
          },
          "errors": [],
          "items": [
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

  Scenario: CSV import: Send file without product images, but uploaded images are passed in the request body, product must be imported, but following error message should be returned too
    Given I get file "features/fixtures/csv/product-without-images.csv" content and remember JSON encoded as "importCsv"
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
          "fileUrl": "http://test.com/some.csv",
          "uploadedImages": [
            {
              "originalName": "unmapedImage1.png"
            },
            {
              "originalName": "unmapedImage2.jpg"
            }
          ]
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
            "sku": "1234"
          }
        }
      },
      {
       "name": "product-files.event.import.success",
       "payload": {
         "synchronization": {
           "taskId": "123"
         },
         "items": [{
            "sku": "1234",
            "type": "product"
          }],
         "errors": [
            {
              "messages": [
                "Unable to import the images below. Please map them to your file appropriately \n [unmapedImage1.png, unmapedImage2.jpg]"
              ]
            }
         ]
       }
      }
    ]
    """

  Scenario: CSV import: Send file with product images, but uploaded images were not passed in the request body, product must be imported, but following error message should be returned too
    Given I get file "features/fixtures/csv/product-with-images-that-not-passed-in-request.csv" content and remember JSON encoded as "importCsv"
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
           "sku": 1234,
           "images": [
              "https://test.com/dont_replace_me.png"
           ]
         }
       }
      },
      {
       "name": "product-files.event.import.success",
       "payload": {
         "synchronization": {
           "taskId": "123"
         },
         "items": [{
            "sku": "1234",
            "type": "product"
          }],
         "errors": [
            {
              "messages": [
                "Unable to find the below images to import. As there were no images uploaded. \n [where_is_the_image_1.jpg, where_is_the_image_2.png]"
              ]
            }
         ]
       }
      }
    ]
    """
