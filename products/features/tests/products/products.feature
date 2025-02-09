Feature: Products REST API
  Background:
    Given I remember as "businessId" following value:
    """
      "21f4947e-929a-11e9-bb05-7200004fe4c0"
    """
    And I use DB fixture "graphql/get-products/get-products-business"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products",
          { }
        ],
        "result": {
          "body": {
            "hits": {
              "hits": []
            }
          }
        }
      }
      """
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "products",
          { }
        ],
        "result": {
          "body": {
            "hits": {
              "hits": []
            }
          }
        }
      }
      """
    And I mock an axios request with parameters:
    """
      {
        "request": {
          "method": "post",
          "url": "https://backend-inventory.test.devpayever.com/api/business/{{businessId}}/inventory/sku/stock"
        },
        "response": {
          "status": 200,
          "body": "{}"
        }
      }
    """
  Scenario: Get products
    Given I use DB fixture "graphql/get-products/get-products"
    When I send a GET request to "/business/{{businessId}}/products"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "products": [
        {
          "apps": ["builder"],
          "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
        },
        {
          "apps": ["builder"],
          "uuid": "e563339f-0b4c-4aef-92e7-203b9761981c"
        },
        {
          "apps": ["builder"],
          "uuid": "a482bf57-1aec-4304-8751-4ce5cea603a4"
        }
      ]
    }
    """
  Scenario: Get product by uuid
    Given I use DB fixture "graphql/get-products/get-product-by-uuid"
    When I send a GET request to "/business/{{businessId}}/products/3799bb06-929a-11e9-b5a6-7200004fe4c0"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
      "businessId": "{{businessId}}",
      "videosUrl": []
    }
    """
  Scenario: Update product
    Given I use DB fixture "graphql/get-products/get-product-by-uuid"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """
    And I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["products-folder"] }
      """
    And I mock Elasticsearch method "search" with:
      """
      { "arguments": ["products-folder"] }
      """
    When I send a PATCH request to "/business/{{businessId}}/products/3799bb06-929a-11e9-b5a6-7200004fe4c0" with json:
    """
    {
      "businessUuid": "{{businessId}}",
      "imagesUrl": [],
      "images": [],
      "title": "products controller product 2",
      "description": "products controller product desc 2",
      "price": 1000,
      "sale": {
        "onSales": false,
        "salePrice": 500
      },
      "sku": "somesku",
      "barcode": "123124",
      "categories": [],
      "type": "physical",
      "active": true,
      "channelSets": [],
      "country": "DE",
      "language": "DE"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "businessId": "{{businessId}}",
      "title": "products controller product 2",
      "description": "products controller product desc 2"
    }
    """
    Then look for model "NewProduct" by following JSON and remember as "targetProduct":
    """
    {
      "_id": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
    }
    """
    And stored value "targetProduct" should contain json:
    """
    {
      "businessId": "{{businessId}}",
      "title": "products controller product 2",
      "description": "products controller product desc 2"
    }
    """
  Scenario: Delete product
    Given I use DB fixture "graphql/get-products/get-product-by-uuid"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """
    When I send a DELETE request to "/business/{{businessId}}/products/3799bb06-929a-11e9-b5a6-7200004fe4c0"
    Then print last response
    Then the response status code should be 200
    Then model "NewProduct" with id "3799bb06-929a-11e9-b5a6-7200004fe4c0" should not exist
