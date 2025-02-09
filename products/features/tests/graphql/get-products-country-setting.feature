Feature: Products GraphQL API
  Background:
    Given I remember as "productId" following value:
    """
      "bd49e195-26c1-4fbc-b95d-31996966cfae"
    """
    And I use DB fixture "graphql/get-products/get-products-business"
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

  Scenario: Get products country setting
    Given I use DB fixture "graphql/get-products/get-products-country-setting"
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "products",
          { }
         ],
        "result": {}
      }
      """
    When I send a GraphQL query to "/products":
      """
      {
        getProductCountrySetting(
          productId: "{{productId}}",
          country: "US"
        ) {
          active
          channelSets {
            id
            name
            type
          }
          currency
          onSales
          recommendations {
            tag
            recommendations {
              id
              name
              images
            }
          }
          price
          salePrice
          shipping {
            free
            width
            weight
          }
          vatRate
        }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "getProductCountrySetting": {
            "active": false,
            "channelSets": [],
            "currency": "USD",
            "onSales": true,
            "recommendations": {
              "tag": null,
              "recommendations": [
                {
                  "id": "0722c350-7597-4d7a-a51c-98e9dc65822f",
                  "name": "-+-+-+()()(())",
                  "images": [
                    "1aea5a01-53f8-4c84-b1fb-290988917281-Screenshot2021-09-01at13.15.17.png"
                  ]
                },
                {
                  "id": "e806f51a-393e-4e9d-80dc-a88d700e6163",
                  "name": "123123123",
                  "images": [
                    "e8f0d4fd-835e-4a15-afa9-331e854e36f1-Screenshot2021-08-09at19.11.51.png"
                  ]
                },
                {
                  "id": "cec80d89-1446-4548-803b-9805bb49bcc0",
                  "name": "123111111111",
                  "images": []
                }
              ]
            },
            "price": 78000,
            "salePrice": 58000,
            "shipping": {
              "width": 0,
              "weight": 0
            },
            "vatRate": 10
          }
        }
      }
      """
