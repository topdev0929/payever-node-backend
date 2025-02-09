Feature: Create business and sample product
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I use DB fixture "api/create-sample-product/create-sample-product"
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
          "method": "post",
          "url": "http://media-micro.url/api/image/business/{{businessId}}/products"
        },
        "response": {
          "status": 200,
          "body": "{\"blobName\": \"uploadedImage\"}"
        }
      }
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
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
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

  Scenario: Send created business message of BUSINESS_PRODUCT_RETAIL_B2C - BRANCHE_FASHION to create the products sample for the new business based on industry and product
  And I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": [ "products-folder" ] }
      """
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {
        "name": "users.event.business.created",
        "payload":{
          "_id": "{{businessId}}",
          "companyAddress": {
              "country": "DE",
              "city": "Berlin",
              "street": "some street",
              "zipCode": "1234"
          },
          "companyDetails": {
            "product": "BUSINESS_PRODUCT_RETAIL_B2C",
            "industry": "BRANCHE_FASHION"
          },
          "currency": "EUR"
        }
      }
    """
    When I process messages from RabbitMQ "async_events_products_micro" channel
    Then I look for model "SampleProducts" by following JSON and remember as "productFashion":
    """
      {
        "title": "Product 2"
      }
    """
    And stored value "productFashion" should contain json:
    """
      {
        "title": "Product 2",
        "example": true,
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      }
    """
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "products.event.sampleproduct.created",
        "payload": {
          "business": {
            "_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
          },
          "products": [
            {
              "title": "Product 2",
              "example": true,
              "businessUuid": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            }
          ]
        }
      }
    ]
    """

  Scenario: Send created business message of BUSINESS_PRODUCT_RETAIL_B2C - BRANCHE_OTHER to create the products sample for the new business based on industry and product, in case of BRANCHE_OTHER get random
    And I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": [ "products-folder" ] }
      """
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {
        "name": "users.event.business.created",
        "payload":{
          "_id": "{{businessId}}",
          "companyAddress": {
              "country": "DE",
              "city": "Berlin",
              "street": "some street",
              "zipCode": "1234"
          },
          "companyDetails": {
            "product": "BUSINESS_PRODUCT_RETAIL_B2C",
            "industry": "BRANCHE_OTHER"
          },
          "currency": "EUR"
        }
      }
    """
    When I process messages from RabbitMQ "async_events_products_micro" channel
    Then I look for model "SampleProducts" by following JSON and remember as "productOther":
    """
      {
        "title": "Product 8"
      }
    """
    And stored value "productOther" should contain json:
    """
      {
        "title": "Product 8",
        "example": true,
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      }
    """
