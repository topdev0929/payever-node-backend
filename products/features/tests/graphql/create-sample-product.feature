Feature: Create product
  Background:
    Given I remember as "businessId" following value:
    """
      "a560407c-b98d-40eb-8565-77c0d7ae23ea"
    """
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
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Updating to real product
    Given I use DB fixture "graphql/product-sample/product-sample"
    When I send a GraphQL query to "/products":
      """
      mutation {
      updateProduct(product: {
      id: "3799bb06-929a-11e9-b5a6-7200004fe4c0"
      businessUuid: "{{businessId}}"
      title: "test real product",
      description: "test real product",
      imagesUrl: [],
      images: [],
      attributes: [
        {
          type: "text",
          name: "test_name1",
          value: "test_value1"
        }
      ],
      price: 2000,
      sale: {
        onSales: true,
        salePrice: 900,
        salePercent: 50,
        saleEndDate: "2014-04-01",
        saleStartDate: "2014-04-01"
      },
      sku: "someothersku",
      barcode: "54321",
      type: "service",
      deliveries: [
        {
          name: "fedex",
          duration: 3,
          measure_duration: "month"
        }
      ],
      active: false,
      categories: [],
      country: "DE",
      language: "DE"
      }) {
      id
      uuid
      title
      description
      price
      attributes {
        name
        type
        value
      }
      sale {
        onSales
        salePrice
        salePercent
        saleEndDate
        saleStartDate
      }
      deliveries {
        name
        duration
        measure_duration
      }
      sku
      barcode
      type
      active
      }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "updateProduct": {
            "id": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
            "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0",
            "title": "test real product",
            "description": "test real product",
            "price": 2000,
            "sale": {
              "onSales": true,
              "salePrice": 1000,
              "salePercent": 50,
              "saleEndDate": "2014-04-01T00:00:00.000Z",
              "saleStartDate": "2014-04-01T00:00:00.000Z"
            },
            "attributes": [
              {
                  "type": "text",
                  "name": "test_name1",
                  "value": "test_value1"
              }
            ],
            "sku": "someothersku",
            "barcode": "54321",
            "type": "service",
            "active": false,
			"deliveries": [
              {
                "name": "fedex",
                "duration": 3,
                "measure_duration": "month"
              }
			]
          }
        }
      }
      """
    When I send a GraphQL query to "/products":
      """
      {
      getProducts(businessUuid: "a560407c-b98d-40eb-8565-77c0d7ae23ea", paginationLimit: 10) {
      products {
      uuid
      }
      }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "getProducts": {
            "products": [
              {
                "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
              }
            ]
          }
        }
      }
      """
