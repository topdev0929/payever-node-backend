Feature: Import product
  Background:
    Given I remember as "businessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "synchronizationTaskId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """

  # Fix after cucumber-sdk updated
  # Scenario: Successfully create new product from import
  #   Given I get file "features/fixtures/json/synchronizer-event-outer-product-created.message.json" content and remember as "importMessageJsonString"
  #   And I get file "features/fixtures/json/synchronizer-event-outer-product-created.message.json" content and remember JSON object as "importMessage"
  #   And I publish in RabbitMQ channel "async_events_products_micro" message with json:
  #   """
  #     {{importMessageJsonString}}
  #   """
  #   And I mock an axios request with parameters:
  #     """
  #     {
  #       "request": {
  #         "method": "get",
  #         "url": "http://image1.url"
  #       },
  #       "response": {
  #         "status": 200,
  #         "body": "Image1 content"
  #       }
  #     }
  #     """
  #   And I mock an axios request with parameters:
  #     """
  #     {
  #       "request": {
  #         "method": "get",
  #         "url": "http://image2.url"
  #       },
  #       "response": {
  #         "status": 200,
  #         "body": "Image2 content"
  #       }
  #     }
  #     """
  #   And I mock an axios request with parameters:
  #     """
  #     {
  #       "request": {
  #         "method": "post",
  #         "url": "http://media-micro.url/api/image/business/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/products"
  #       },
  #       "response": {
  #         "status": 200,
  #         "body": "{\"blobName\": \"uploadedImage\"}"
  #       }
  #     }
  #     """
  #   When I process messages from RabbitMQ "async_events_products_micro" channel
  #   Then look for model "Product" by following JSON and remember as "importedProduct":
  #     """
  #     {
  #       "sku": "{{importMessage.payload.payload.sku}}"
  #     }
  #     """
  #   Then model "Product" with id "{{importedProduct._id}}" should contain json:
  #   """
  #     {
  #       "title": "{{importMessage.payload.payload.title}}",
  #       "businessId": "{{businessId}}",
  #       "description": "{{importMessage.payload.payload.description}}",
  #       "onSales": {{importMessage.payload.payload.onSales}},
  #       "price": "{{importMessage.payload.payload.price}}",
  #       "sku": "{{importMessage.payload.payload.sku}}",
  #       "barcode": "{{importMessage.payload.payload.barcode}}",
  #       "type": "{{importMessage.payload.payload.type}}",
  #       "active": {{importMessage.payload.payload.active}},
  #       "options": [
  #           {
  #             "name": "{{importMessage.payload.payload.options.0.name}}",
  #             "value": "{{importMessage.payload.payload.options.0.value}}"
  #           }
  #       ],
  #       "shipping": {
  #         "weight": {{importMessage.payload.payload.shipping.weight}},
  #         "width": {{importMessage.payload.payload.shipping.width}},
  #         "length": {{importMessage.payload.payload.shipping.length}},
  #         "height": {{importMessage.payload.payload.shipping.height}},
  #         "measure_mass": "{{importMessage.payload.payload.shipping.measure_mass}}",
  #         "measure_size": "{{importMessage.payload.payload.shipping.measure_size}}"
  #       },
  #       "images": ["uploadedImage", "uploadedImage"]
  #     }
  #   """
  #   And print RabbitMQ message list
  #   And RabbitMQ exchange "async_events" should contain following messages:
  #   """
  #   [
  #     {
  #       "name": "products.event.product.created",
  #       "payload": {
  #         "title": "{{importMessage.payload.payload.title}}",
  #         "businessId": "{{businessId}}",
  #         "businessUuid": "{{businessId}}",
  #         "description": "{{importMessage.payload.payload.description}}",
  #         "onSales": {{importMessage.payload.payload.onSales}},
  #         "price": "{{importMessage.payload.payload.price}}",
  #         "sku": "{{importMessage.payload.payload.sku}}",
  #         "barcode": "{{importMessage.payload.payload.barcode}}",
  #         "type": "{{importMessage.payload.payload.type}}",
  #         "active": {{importMessage.payload.payload.active}},
  #         "shipping": {
  #           "weight": {{importMessage.payload.payload.shipping.weight}},
  #           "width": {{importMessage.payload.payload.shipping.width}},
  #           "length": {{importMessage.payload.payload.shipping.length}},
  #           "height": {{importMessage.payload.payload.shipping.height}},
  #           "measure_mass": "{{importMessage.payload.payload.shipping.measure_mass}}",
  #           "measure_size": "{{importMessage.payload.payload.shipping.measure_size}}"
  #         },
  #         "images": ["uploadedImage", "uploadedImage"]
  #      }
  #     },
  #     {
  #       "name": "products.event.product-synchronization.succeeded",
  #       "payload": {
  #         "product": {
  #           "sku": "{{importMessage.payload.payload.sku}}"
  #         },
  #         "synchronizationTask": {
  #           "id": "{{synchronizationTaskId}}"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage-thumbnail",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage-blurred",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage-thumbnail",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage-blurred",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     }
  #   ]
  #   """

  Scenario: Successfully create new product from import even if media creation returned null in blobName
    Given I get file "features/fixtures/json/synchronizer-event-outer-product-created.message.json" content and remember as "importMessageJsonString"
    And I get file "features/fixtures/json/synchronizer-event-outer-product-created.message.json" content and remember JSON object as "importMessage"
    And I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {{importMessageJsonString}}
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "get",
          "url": "http://image1.url"
        },
        "response": {
          "status": 200,
          "body": "Image1 content"
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "get",
          "url": "http://image2.url"
        },
        "response": {
          "status": 200,
          "body": "Image2 content"
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://media-micro.url/api/image/business/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/products"
        },
        "response": {
          "status": 200,
          "body": "{\"blobName\": null}"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_products_micro" channel

    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "products.event.product.created",
        "payload": {
            "images": [],
            "channelSetCategories": []
          }
      }
    ]
    """
    Then look for model "Product" by following JSON and remember as "importedProduct":
      """
      {
        "sku": "{{importMessage.payload.payload.sku}}"
      }
      """
    Then model "Product" with id "{{importedProduct._id}}" should contain json:
      """
      {
        "images": [],
        "origin": "ebay",
        "channelSetCategories": []
      }
      """

  # Scenario: Successfully update product from import
  #   Given I use DB fixture "import/update-product"
  #   And I get file "features/fixtures/json/synchronizer-event-outer-product-updated.message.json" content and remember as "importMessageJsonString"
  #   And I get file "features/fixtures/json/synchronizer-event-outer-product-updated.message.json" content and remember JSON object as "importMessage"
  #   And I publish in RabbitMQ channel "async_events_products_micro" message with json:
  #   """
  #     {{importMessageJsonString}}
  #   """
  #   And I mock an axios request with parameters:
  #     """
  #     {
  #       "request": {
  #         "method": "get",
  #         "url": "http://image1.url"
  #       },
  #       "response": {
  #         "status": 200,
  #         "body": "Image1 content"
  #       }
  #     }
  #     """
  #   And I mock an axios request with parameters:
  #     """
  #     {
  #       "request": {
  #         "method": "get",
  #         "url": "http://image2.url"
  #       },
  #       "response": {
  #         "status": 200,
  #         "body": "Image2 content"
  #       }
  #     }
  #     """
  #   And I mock an axios request with parameters:
  #     """
  #     {
  #       "request": {
  #         "method": "post",
  #         "url": "http://media-micro.url/api/image/business/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/products"
  #       },
  #       "response": {
  #         "status": 200,
  #         "body": "{\"blobName\": \"uploadedImage\"}"
  #       }
  #     }
  #     """
  #   When I process messages from RabbitMQ "async_events_products_micro" channel
  #   Then look for model "Product" by following JSON and remember as "importedProduct":
  #     """
  #     {
  #       "sku": "{{importMessage.payload.payload.sku}}"
  #     }
  #     """
  #   Then model "Product" with id "{{importedProduct._id}}" should contain json:
  #   """
  #     {
  #       "title": "{{importMessage.payload.payload.title}}",
  #       "businessId": "{{businessId}}",
  #       "description": "{{importMessage.payload.payload.description}}",
  #       "onSales": {{importMessage.payload.payload.onSales}},
  #       "price": "{{importMessage.payload.payload.price}}",
  #       "sku": "{{importMessage.payload.payload.sku}}",
  #       "barcode": "{{importMessage.payload.payload.barcode}}",
  #       "type": "{{importMessage.payload.payload.type}}",
  #       "active": {{importMessage.payload.payload.active}},
  #       "shipping": {
  #         "weight": {{importMessage.payload.payload.shipping.weight}},
  #         "width": {{importMessage.payload.payload.shipping.width}},
  #         "length": {{importMessage.payload.payload.shipping.length}},
  #         "height": {{importMessage.payload.payload.shipping.height}},
  #         "measure_mass": "{{importMessage.payload.payload.shipping.measure_mass}}",
  #         "measure_size": "{{importMessage.payload.payload.shipping.measure_size}}"
  #       },
  #       "images": ["uploadedImage", "uploadedImage"]
  #     }
  #   """
  #   And print RabbitMQ message list
  #   And RabbitMQ exchange "async_events" should contain following messages:
  #   """
  #   [
  #     {
  #       "name": "products.event.product.updated",
  #       "payload": {
  #         "title": "{{importMessage.payload.payload.title}}",
  #         "businessId": "{{businessId}}",
  #         "businessUuid": "{{businessId}}",
  #         "description": "{{importMessage.payload.payload.description}}",
  #         "onSales": {{importMessage.payload.payload.onSales}},
  #         "price": "{{importMessage.payload.payload.price}}",
  #         "sku": "{{importMessage.payload.payload.sku}}",
  #         "barcode": "{{importMessage.payload.payload.barcode}}",
  #         "type": "{{importMessage.payload.payload.type}}",
  #         "active": {{importMessage.payload.payload.active}},
  #         "shipping": {
  #           "weight": {{importMessage.payload.payload.shipping.weight}},
  #           "width": {{importMessage.payload.payload.shipping.width}},
  #           "length": {{importMessage.payload.payload.shipping.length}},
  #           "height": {{importMessage.payload.payload.shipping.height}},
  #           "measure_mass": "{{importMessage.payload.payload.shipping.measure_mass}}",
  #           "measure_size": "{{importMessage.payload.payload.shipping.measure_size}}"
  #         },
  #         "images": ["uploadedImage", "uploadedImage"]
  #      }
  #     },
  #     {
  #       "name": "products.event.product-synchronization.succeeded",
  #       "payload": {
  #         "product": {
  #           "sku": "{{importMessage.payload.payload.sku}}"
  #         },
  #         "synchronizationTask": {
  #           "id": "{{synchronizationTaskId}}"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage-thumbnail",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage-blurred",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage-thumbnail",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     },
  #     {
  #       "name": "media.event.media.assigned",
  #       "payload": {
  #         "filename": "uploadedImage-blurred",
  #         "container": "products",
  #         "relatedEntity": {
  #           "id": "{{importedProduct._id}}",
  #           "type": "ProductModel"
  #         }
  #       }
  #     }
  #   ]
  #   """

  Scenario: Trying to create product which is already exists
    Given I use DB fixture "import/update-product"
    And I get file "features/fixtures/json/synchronizer-event-outer-product-created.message.json" content and remember as "importMessageJsonString"
    And I get file "features/fixtures/json/synchronizer-event-outer-product-created.message.json" content and remember JSON object as "importMessage"
    And I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {{importMessageJsonString}}
    """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "get",
          "url": "http://image1.url"
        },
        "response": {
          "status": 200,
          "body": "Image1 content"
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "get",
          "url": "http://image2.url"
        },
        "response": {
          "status": 200,
          "body": "Image2 content"
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://media-micro.url/api/image/business/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/products"
        },
        "response": {
          "status": 200,
          "body": "{\"blobName\": \"uploadedImage\"}"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_products_micro" channel
    Then model "Product" found by following JSON should not exist:
    """
      {
        "sku": "{{importMessage.payload.payload.sku}}",
        "title": "{{importMessage.payload.payload.title}}",
        "channelSetCategories": "{{importMessage.payload.payload.channelSetCategories}}"
      }
    """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
         "name": "products.event.product-synchronization.failed",
         "payload": {
           "product": {
             "sku": "testProductSku"
           },
           "errorMessage": "Product with sku already exists",
           "synchronizationTask": {
             "id": "{{synchronizationTaskId}}"
           }
         }
      }
    ]
    """

  # Scenario: Error during image download
  #   Given I get file "features/fixtures/json/synchronizer-event-outer-product-created.message.json" content and remember as "importMessageJsonString"
  #   And I get file "features/fixtures/json/synchronizer-event-outer-product-created.message.json" content and remember JSON object as "importMessage"
  #   And I publish in RabbitMQ channel "async_events_products_micro" message with json:
  #   """
  #     {{importMessageJsonString}}
  #   """
  #   And I mock an axios request with parameters:
  #     """
  #     {
  #       "request": {
  #         "method": "get",
  #         "url": "http://image1.url"
  #       },
  #       "response": {
  #         "status": 400,
  #         "body": "Error message"
  #       }
  #     }
  #     """
  #   And I mock an axios request with parameters:
  #     """
  #     {
  #       "request": {
  #         "method": "get",
  #         "url": "http://image2.url"
  #       },
  #       "response": {
  #         "status": 200,
  #         "body": "Image2 content"
  #       }
  #     }
  #     """
  #   When I process messages from RabbitMQ "async_events_products_micro" channel
  #   Then model "Product" found by following JSON should not exist:
  #     """
  #       {
  #         "sku": "{{importMessage.payload.payload.sku}}",
  #         "title": "{{importMessage.payload.payload.title}}"
  #       }
  #     """
  #   And print RabbitMQ message list
  #   And RabbitMQ exchange "async_events" should contain following messages:
  #     """
  #     [
  #       {
  #          "name": "products.event.product-synchronization.failed",
  #          "payload": {
  #            "product": {
  #              "sku": "testProductSku"
  #            },
  #            "errorMessage": "Failed downloading image: http://image1.url",
  #            "synchronizationTask": {
  #              "id": "{{synchronizationTaskId}}"
  #            }
  #          }
  #       }
  #     ]
  #     """

  Scenario: Product validation error
    Given I get file "features/fixtures/json/synchronizer-event-outer-product-created-wrong-vat-rate.message.json" content and remember as "importMessageJsonString"
    And I use DB fixture "import/wrong-vat-rate"
    And I get file "features/fixtures/json/synchronizer-event-outer-product-created-wrong-vat-rate.message.json" content and remember JSON object as "importMessage"
    And I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {{importMessageJsonString}}
    """
    When I process messages from RabbitMQ "async_events_products_micro" channel
    Then model "Product" found by following JSON should not exist:
      """
        {
          "sku": "{{importMessage.payload.payload.sku}}",
          "title": "{{importMessage.payload.payload.title}}",
          "channelSetCategories": "{{importMessage.payload.payload.channelSetCategories}}"
        }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
           "name": "products.event.product-synchronization.failed",
           "payload": {
             "product": {
               "sku": "testProductSku"
             },
             "errorMessage": "Tax rate \"50\" doesn't exists in country \"DE\"",
             "synchronizationTask": {
               "id": "{{synchronizationTaskId}}"
             }
           }
        }
      ]
      """
