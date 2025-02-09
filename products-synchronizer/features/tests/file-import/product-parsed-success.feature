Feature: When product was parsed it should be sent to the product service and if it has inventory to the inventory service as well
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Received product without inventory, task has no overwrite existing option
    Given I use DB fixture "file-import/synchronization-task-no-overwrite"
    Given I use DB fixture "integration/integration-events"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "product-files.event.product.imported",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "sku": 1234,
            "currency": "eur",
            "type": "physical",
            "title": "Some product",
            "description": "Some product description",
            "enabled": true,
            "hidden": false,
            "price": 100,
            "salePrice": 50,
            "barcode": "bar-code",
            "images": [
              "https://test.com/some.png",
              "https://test.com/someother.png"
            ],
            "imagesUrl": [
              "https://test.com/some.png",
              "https://test.com/someother.png"
            ],
            "categories": [],
            "channelSets": [
              "a918abc5-dbd7-405e-8cec-c4ad57f570bf"
            ],
            "attributes": [
              {
                "name": "Size",
                "value": "M",
                "type": "text"
              }
            ],
            "variantAttributes": [
              {
                "name": "Color",
                "type": "color"
              }
            ],
            "variants": []
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
         "name": "synchronizer.event.outer-product.created",
         "payload": {
           "business": {
             "id": "{{businessId}}"
           },
           "synchronizationTask": {
             "id": "{{synchronizationTaskId}}"
           },
           "payload": {
             "sku": 1234,
             "origin": "test",
             "currency": "eur",
             "type": "physical",
             "title": "Some product",
             "description": "Some product description",
             "enabled": true,
             "hidden": false,
             "price": 100,
             "salePrice": 50,
             "barcode": "bar-code",
             "images": [
               "https://test.com/some.png",
               "https://test.com/someother.png"
             ],
             "imagesUrl": [
               "https://test.com/some.png",
               "https://test.com/someother.png"
             ],
             "categories": [],
             "channelSets": [
               "a918abc5-dbd7-405e-8cec-c4ad57f570bf"
             ],
             "variants": [],
             "attributes": [
              {
                "name": "Size",
                "value": "M",
                "type": "text"
              }
            ],
            "variantAttributes": [
              {
                "name": "Color",
                "type": "color"
              }
            ]
           }
         }
        }
       ]
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
         {
           "name": "synchronizer.event.outer-stock.created"
         }
      ]
      """

  Scenario: Received product with inventory, task has no overwrite existing option
    Given I use DB fixture "file-import/synchronization-task-no-overwrite"
    Given I use DB fixture "integration/integration-events"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "product-files.event.product.imported",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "sku": 1234,
            "inventory": {
              "stock": 10,
              "reserved": 20
            }
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
           "name": "synchronizer.event.outer-product.created",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "payload": {
               "sku": 1234,
               "inventory": {
                 "stock": 10,
                 "reserved": 20
               },
               "origin": "test"
             },
             "synchronizationTask": {
               "id": "{{synchronizationTaskId}}"
             }
           }
        },
        {
           "name": "synchronizer.event.outer-stock.created",
           "payload": [
             {
               "business": {
                 "id": "{{businessId}}"
               },
               "businessId": "{{businessId}}",
               "integration": {
                 "name": "file-import"
               },
               "stock": 10,
               "synchronizationTask": {
                 "id": "{{synchronizationTaskId}}"
               },
               "origin": "test"
             }
           ]
        }

       ]
      """

  Scenario: Received product with variants inventory, task has no overwrite existing option
    Given I use DB fixture "file-import/synchronization-task-no-overwrite"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "product-files.event.product.imported",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "sku": "parent_sku",
            "variants": [
              {
                "sku": "variant_1_sku",
                "inventory": {
                  "stock": 10,
                  "reserved": 20
                },
                "attributes": [
                  {
                    "name": "Size",
                    "value": "M",
                    "type": "text"
                  }
                ]
              },
              {
                "sku": "variant_2_sku",
                "inventory": {
                  "stock": 20,
                  "reserved": 30
                }
              }
            ]
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
           "name": "synchronizer.event.outer-product.created",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "payload": {
               "sku": "parent_sku",
               "variants": [
                 {
                   "sku": "variant_1_sku",
                   "inventory": {
                     "stock": 10,
                     "reserved": 20
                   },
                   "attributes": [
                     {
                       "name": "Size",
                       "value": "M",
                       "type": "text"
                     }
                   ]
                 },
                 {
                   "sku": "variant_2_sku",
                   "inventory": {
                     "stock": 20,
                     "reserved": 30
                   }
                 }
               ]
             },
             "synchronizationTask": {
               "id": "{{synchronizationTaskId}}"
             }
           }
         },
         {
           "name": "synchronizer.event.outer-stock.created",
           "payload": [
             {
               "business": {
                 "id": "{{businessId}}"
               },
               "businessId": "{{businessId}}",
               "integration": {
                 "name": "file-import"
               },
               "stock": 10,
               "synchronizationTask": {
                 "id": "{{synchronizationTaskId}}"
               }
             }
           ]
         },
         {
           "name": "synchronizer.event.outer-stock.created",
           "payload": [
             {
               "business": {
                 "id": "{{businessId}}"
               },
               "businessId": "{{businessId}}",
               "integration": {
                 "name": "file-import"
               },
               "stock": 20,
               "synchronizationTask": {
                 "id": "{{synchronizationTaskId}}"
               }
             }
           ]
         }
       ]
      """

  Scenario: Received product without inventory, task has overwrite existing option
    Given I use DB fixture "file-import/synchronization-task-overwrite"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "product-files.event.product.imported",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "sku": 1234,
            "currency": "eur",
            "type": "physical",
            "title": "Some product",
            "description": "Some product description",
            "enabled": true,
            "hidden": false,
            "price": 100,
            "salePrice": 50,
            "barcode": "bar-code",
            "images": [
              "https://test.com/some.png",
              "https://test.com/someother.png"
            ],
            "imagesUrl": [
              "https://test.com/some.png",
              "https://test.com/someother.png"
            ],
            "categories": [],
            "channelSets": [
              "a918abc5-dbd7-405e-8cec-c4ad57f570bf"
            ],
            "variants": []
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
         "name": "synchronizer.event.outer-products.upserted.static",
         "payload": {
           "business": {
             "id": "{{businessId}}"
           },
           "synchronization": {
             "taskId": "{{synchronizationTaskId}}"
           },
           "payload": {
             "sku": 1234,
             "currency": "eur",
             "type": "physical",
             "title": "Some product",
             "description": "Some product description",
             "enabled": true,
             "hidden": false,
             "price": 100,
             "salePrice": 50,
             "barcode": "bar-code",
             "images": [
               "https://test.com/some.png",
               "https://test.com/someother.png"
             ],
             "imagesUrl": [
               "https://test.com/some.png",
               "https://test.com/someother.png"
             ],
             "categories": [],
             "channelSets": [
               "a918abc5-dbd7-405e-8cec-c4ad57f570bf"
             ],
             "variants": []
           }
         }
        }
       ]
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
         {
           "name": "synchronizer.event.outer-stock.created"
         }
      ]
      """

  Scenario: Received product with inventory, task has overwrite existing option
    Given I use DB fixture "file-import/synchronization-task-overwrite"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "product-files.event.product.imported",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "sku": 1234,
            "inventory": {
              "stock": 10,
              "reserved": 20
            }
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
           "name": "synchronizer.event.outer-products.upserted.static",
           "payload": {
             "business": {
               "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
             },
             "payload": {
               "sku": 1234,
               "inventory": {
                 "stock": 10,
                 "reserved": 20
               }
             },
             "synchronization": {
               "taskId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
             }
           }
         }
      ]
      """
      And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
           "name": "synchronizer.event.outer-stock.created",
           "payload": [
             {
               "business": {
                 "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
               },
               "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
               "integration": {
                 "name": "file-import"
               },
               "stock": 10,
               "synchronizationTask": {
                 "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
               }
             }
            ]
        }
       ]
      """

  Scenario: Received product with variants inventory, task has overwrite existing option
    Given I use DB fixture "file-import/synchronization-task-overwrite"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
      """
      {
        "name": "product-files.event.product.imported",
        "payload": {
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}"
          },
          "data": {
            "sku": "parent_sku",
            "variants": [
              {
                "sku": "variant_1_sku",
                "inventory": {
                  "stock": 10,
                  "reserved": 20
                }
              },
              {
                "sku": "variant_2_sku",
                "inventory": {
                  "stock": 20,
                  "reserved": 30
                }
              }
            ]
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
         "name": "synchronizer.event.outer-products.upserted.static",
         "payload": {
           "business": {
             "id": "{{businessId}}"
           },
           "synchronization": {
             "taskId": "{{synchronizationTaskId}}"
           },
           "payload": {
             "sku": "parent_sku",
             "variants": [
               {
                  "sku": "variant_1_sku",
                  "inventory": {
                    "stock": 10,
                    "reserved": 20
                  }
               },
               {
                  "sku": "variant_2_sku",
                  "inventory": {
                    "stock": 20,
                    "reserved": 30
                  }
               }
             ]
           }
         }
        }
      ]
      """
       
        And RabbitMQ exchange "async_events" should contain following messages:
        """
        [
        {
           "name": "synchronizer.event.outer-stock.created",
           "payload": [
             {
               "business": {
                 "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
               },
               "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
               "integration": {
                 "name": "file-import"
               },
               "stock": 10,
               "synchronizationTask": {
                 "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
               }
             }
           ]
         },
         {
           "name": "synchronizer.event.outer-stock.created",
           "payload": [
             {
               "business": {
                 "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
               },
               "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
               "integration": {
                 "name": "file-import"
               },
               "stock": 20,
               "synchronizationTask": {
                 "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
               }
             }
           ]
         }
       ]
      """
