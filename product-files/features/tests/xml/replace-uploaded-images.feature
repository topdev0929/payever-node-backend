Feature: If uploaded images passed after file was parsed images original names must be replaced with upload urls
  Scenario: XML import: Send file with product images should be taken from request body
    Given I get file "features/fixtures/xml/product-with-images-in-request-body.xml" content and remember XML minified and JSON encoded as "importXml"
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
          "fileUrl": "http://test.com/some.xml",
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

  Scenario: XML import: Send file with product variants images should be taken from request body
    Given I get file "features/fixtures/xml/product-with-variants-images-in-request-body.xml" content and remember XML minified and JSON encoded as "importXml"
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
          "fileUrl": "http://test.com/some.xml",
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
            "images": [],
            "imagesUrl": [],
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
                "images": [
                  "http://test.com/replaced_1.png",
                  "https://test.com/dont_replace_me.png",
                  "http://test.com/replaced_2.jpg"
                ],
                "imagesUrl": [
                  "replace_me_1.png",
                  "https://test.com/dont_replace_me.png",
                  "replace_me_2.jpg"
                ],
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
                "images": [
                  "http://test.com/replaced_1.png"
                ],
                "imagesUrl": [
                  "replace_me_1.png"
                ],
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
            "fileUrl": "http://test.com/some.xml",
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

  Scenario: XML import: Send file without product images, but uploaded images are passed in the request body, product must be imported, but following error message should be returned too
    Given I get file "features/fixtures/xml/product-without-images.xml" content and remember XML minified and JSON encoded as "importXml"
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
          "fileUrl": "http://test.com/some.xml",
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

  Scenario: XML import: Send file with product images, but uploaded images were not passed in the request body, product must be imported, but following error message should be returned too
    Given I get file "features/fixtures/xml/product-with-images-that-not-passed-in-request.xml" content and remember XML minified and JSON encoded as "importXml"
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
