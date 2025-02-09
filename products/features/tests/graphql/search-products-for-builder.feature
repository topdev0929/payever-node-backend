Feature: Products For Builder GraphQL API
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I get file "features/tests/data-json/product-es-mock.json" content and remember as "result" with placeholders
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products",
          {
          }
        ],
        "result": {
          "body": {{result}}
        }
      }
      """
    Given I get file "features/tests/data-json/product-category-es-mock.json" content and remember as "resultCategory" with placeholders
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "product-category",
          {
          }
        ],
        "result": {
          "body": {{resultCategory}}
        }
      }
      """
    Given I get file "features/tests/data-json/product-collection-es-mock.json" content and remember as "resultCollection" with placeholders
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "product-collection",
          {
          }
        ],
        "result": {
          "body": {{resultCollection}}
        }
      }
      """

  Scenario: Search products
    When I send a GraphQL query to "/products":
      """
      {
        searchForBuilder(business: "{{businessId}}", search: "weight", offset: 0, limit: 1) {
          result {
            _id
            businessUuid
            title
            description
            collections {
              name
              description
            }
            attributes {
              name
              value
            }
            category {
              title
            }
            variants {
              options {
                name
                value
              }
            }
          }
        }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "searchForBuilder": {
            "result": [
              {
                "_id": null,
                "businessUuid": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                "title": "Product 1",
                "description": "Some product",
                "collections": [],
                "attributes": [],
                "category": {
                  "title": "Cars"
                },
                "variants": []
              }
            ]
          }
        }
      }
      """

  Scenario: Search products category
    When I send a GraphQL query to "/categories":
      """
      {
        searchCategoriesForBuilder(business: "{{businessId}}", search: "arts", offset: 0, limit: 1) {
          result {
            businessUuid
            name
            slug
          }
        }
      }

      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "searchCategoriesForBuilder": {
            "result": [
              {
                "businessUuid": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                "name": "Arts & Crafts",
                "slug": "arts_and_crafts"
              }
            ]
          }
        }
      }
      """

  Scenario: Search products category
    When I send a GraphQL query to "/categories":
      """
      {
          searchCollectionForBuilder(
            business: "{{businessId}}"
            search: "all"
            offset: 0
            limit: 1
          ) {

          result {
            name
          }
        }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "searchCollectionForBuilder": {
            "result": [
              {
                "name": "All"
              }
            ]
          }
        }
      }
      """
