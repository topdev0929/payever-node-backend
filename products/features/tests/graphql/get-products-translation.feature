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

  Scenario: Get products translation
    Given I use DB fixture "graphql/get-products/get-products-translation"
    When I send a GraphQL query to "/products":
      """
      {
        getProductTranslation(
          productId: "{{productId}}",
          language: "EN"
        ) {
          attributes {
            name
            value
          }
          categories {
            id
            name
          }
          category {
            id
            title
          }
          collections {
            id
            name
          }
          description
          images
          imagesUrl
          title
          videos
          videosUrl
          variants {
            id
            title
            description
          }
          variantAttributes {
            name
            type
          }
        }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "getProductTranslation": {
            "description": "Lorem ipsum dolor sit amet En",
            "images": [
              "en.png"
            ],
            "imagesUrl": [
              "https://payevertesting.blob.core.windows.net/products/en.png"
            ],
            "title": "Test product En"
          }
        }
      }
      """
