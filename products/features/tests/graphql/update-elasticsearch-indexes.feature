Feature: Updating elasticsearch indexes when product being changed
  Background:
    Given I remember as "businessId" following value:
    """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    """
    And I remember as "productId" following value:
    """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
    """
    And I remember as "variantId" following value:
    """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """
    And I remember as "productData" following value:
      """
      {
        "businessUuid": "{{businessId}}",
        "title": "test product",
        "description": "test",
        "sale": {
          "onSales": false,
          "salePrice": 500
        },
        "price": 1000,
        "sku": "somesku",
        "barcode": "123124",
        "type": "physical",
        "active": true,
        "country": "DE",
        "language": "DE"
      }
      """

  Scenario: Creating product without variants, must update index at elasticsearch
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products",
          {
            "businessUuid": "{{productData.businessUuid}}",
            "sku": "{{productData.sku}}"
          }
         ],
        "result": {}
      }
      """
    
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products",
          "product"
         ],
        "result": {}
      }
      """

    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products-folder"
         ],
        "result": {}
      }
      """

    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """
    When I send a POST request to "/products" with json:
    """
    {
      "operationName": "createProduct",
      "variables": {
        "product": {
          "businessUuid": "{{productData.businessUuid}}",
          "channelSets": [],
          "imagesUrl": [],
          "images": [],
          "title": "{{productData.title}}",
          "description": "{{productData.description}}",
          "price": {{productData.price}},
          "sale": {
            "onSales": {{productData.sale.onSales}},
            "salePrice": {{productData.sale.salePrice}}
          },
          "sku": "{{productData.sku}}",
          "barcode": "{{productData.barcode}}",
          "categories": [],
          "type": "{{productData.type}}",
          "active": {{productData.active}},
          "country": "{{productData.country}}"
        }
      },
      "query": "mutation createProduct($product: ProductInput!) {\n  createProduct(product: $product) {\n    title\n    uuid\n  }\n}\n"
    }

    """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "data": {
        "createProduct": {
          "title": "{{productData.title}}"
        }
      }
    }
    """
