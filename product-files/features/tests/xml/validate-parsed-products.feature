Feature: Validation of parsed products
  Scenario: XML import: Sending two products, one is invalid
    Given I get file "features/fixtures/xml/two-products-one-is-invalid.xml" content and remember XML minified and JSON encoded as "importXml"
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
            "type": "digital",
            "title": "Valid product",
            "description": "Valid product",
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
            "images": [],
            "imagesUrl": [],
            "channelSets": [],
            "categories": [],
            "variants": [],
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
          "errors": [
            {
              "messages": [
                "description should not be empty",
                "description must be a string",
                "price should not be empty",
                "price must be a number conforming to the specified constraints",
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
            }
          ]
        }
      }
    ]
    """
