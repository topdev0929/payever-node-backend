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

  Scenario: Business Create
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
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Business Updated
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {
        "name": "users.event.business.updated",
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
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Business export
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {
        "name": "users.event.business.export",
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
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: Business Delete
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {
        "name": "users.event.business.removed",
        "payload":{
          "_id": "{{businessId}}"
        }
      }
    """
    When I process messages from RabbitMQ "async_events_products_micro" channel
    And model "Business" with id "{{businessId}}" should not exist
