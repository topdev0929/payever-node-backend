Feature: Service bus test
  Background:
    Given I remember as "businessId" following value:
    """
      "2382ffce-5620-4f13-885d-3c069f9dd9b4"
    """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{ "businessId": "{{businessId}}", "acls": []}]
        }]
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
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-category",
          {}
        ],
        "result": {}
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
    And I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
        ],
        "result": {}
      }
      """


  @run
  Scenario: create product
    And I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["products" ] }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["product-category" ] }
      """
    And I mock Elasticsearch method "search" with:
      """
      { "arguments": ["products-folder" ] }
      """
    And I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["products" ] }
      """
    When I send a GraphQL query to "/products":
      """
      mutation {
        createProduct(
          product: {
            businessUuid: "{{businessId}}"
            images: []
            title: "Product 1"
            description: "Some product"
            price: 1
            sale: {
              onSales: false
              salePrice: 2
            }
            inventory: {
              sku: "Prod1"
              quantity: 100
              stock: 100
            }
            sku: "Prod1"
            barcode: ""
            condition: "refurbished",
            brand: "brand1",
            type: "physical"
            active: true
            channelSets: []
            categories: [
              {
                id: "5cc31516a04db100139f40d4"
                slug: "basheer"
                title: "Basheer"
                businessUuid: "{{businessId}}"
              }
              {
                id: "5d10fc70eba4ba002af9180a"
                slug: "Cars"
                title: "Cars"
                businessUuid: "{{businessId}}"
              }
            ]
            variants: [
              {
                id: "45c6cb26-6c6a-4a39-b1ae-c6358d0d3930"
                images: []
                # options: [{ name: "v", value: "1" }]
                description: "Some variant"
                price: 1
                sale: {
                  salePrice: 2
                  onSales: false
                }
                sku: "prod1v1"
                barcode: ""
              }
            ]
            shipping: {
              free: false
              general: false
              weight: 1
              width: 1
              length: 1
              height: 1
            }
          }
        ) {
          title
          id
        }
      }
      """

    Then print last response
    Then the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    Then the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "products.event.product.created",
            "payload": {
               "active": true,
               "attributes": [],
               "barcode": "",
               "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
               "businessUuid": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
               "categories": [
                 {
                   "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
                   "slug": "basheer",
                   "title": "Basheer"
                 },
                 {
                   "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
                   "slug": "cars",
                   "title": "Cars"
                 }
               ],
               "channelSets": [],
               "currency": "EUR",
               "description": "Some variant",
               "enabled": true,
               "images": [],
               "imagesUrl": [],
               "options": [],
               "price": 1,
               "sale": {
                 "onSales": false,
                 "salePrice": 2
               },
               "onSales": false,
               "salePrice": 2,
               "shipping": {
                 "measure_mass": "kg",
                 "measure_size": "cm",
                 "free": false,
                 "general": false,
                 "weight": 1,
                 "width": 1,
                 "length": 1,
                 "height": 1
               },
               "sku": "prod1v1",
               "title": "Product 1",
               "type": "physical"
             }
        }
      ]
      """
