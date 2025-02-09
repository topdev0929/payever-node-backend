Feature: Validation of parsed products
  Scenario: CSV import: Sending two products, one is invalid
    Given I get file "features/fixtures/csv/two-products-one-is-invalid.csv" content and remember JSON encoded as "importCsv"
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
            "description": "Valid product",
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
            "sku": "1234",
            "title": "Valid product",
            "type": "digital",
            "variants": []
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
          "errors": [
            {
              "messages": [
                "description should not be empty",
                "SKU \"wrong_variant_sku\": title must be a string",
                "SKU \"wrong_variant_sku\": description must be a string",
                "SKU \"wrong_variant_sku\": price must be a number conforming to the specified constraints"
              ],
              "sku": "5678"
            }
          ],
          "items": [
            {
              "sku": "1234",
              "type": "product"
            },
            {
              "sku": "1234",
              "type": "inventory"
            }
          ]
        }
      }
    ]
    """
