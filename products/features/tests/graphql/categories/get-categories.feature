Feature: Categories GraphQL API
  Background:
    Given I remember as "categoryId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "rootCategoryId" following value:
      """
        "00000000-0000-0000-0000-000000000000"
      """
    Given I remember as "firstLevelCategoryId" following value:
      """
        "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "secondLevelCategoryId" following value:
      """
        "22222222-2222-2222-2222-222222222222"
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-category",
          {
          }
        ]
      }
      """

  Scenario: Get root category
    Given I use DB fixture "graphql/get-categories/get-root-category"
    When I send a GraphQL query to "/categories":
      """
      {
        getCategory(categoryId: "{{categoryId}}") {
          id
          business {
            id
          }
          name
          attributes {
            name
            type
          }
          slug
          parent {
            id
            business {
              id
            }
            description
            name
            slug
            image
          }
          ancestors {
            id
            business {
              id
            }
            description
            name
            slug
            image
          }
          image
          description
          inheritedAttributes {
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
          "getCategory": {
            "id": "{{categoryId}}",
            "business": {
              "id": "{{businessId}}"
            },
            "name": "Category 1",
            "attributes": [],
            "slug": "category_1",
            "ancestors": [],
            "inheritedAttributes": []
          }
        }
      }
      """

  Scenario: Get child category
    Given I use DB fixture "graphql/get-categories/get-child-category"
    When I send a GraphQL query to "/categories":
      """
      {
        getCategory(categoryId: "{{categoryId}}") {
          id
          business {
            id
          }
          name
          attributes {
            name
            type
          }
          slug
          parent {
            id
            business {
              id
            }
            description
            name
            slug
            image
          }
          ancestors {
            id
            business {
              id
            }
            description
            name
            slug
            image
          }
          image
          description
          inheritedAttributes {
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
          "getCategory": {
            "id": "{{categoryId}}",
            "business": {
              "id": "{{businessId}}"
            },
            "name": "Category",
            "attributes": [
              {
                "name": "Category Option",
                "type": "text"
              }
            ],
            "slug": "category",
            "parent": {
              "id": "{{secondLevelCategoryId}}",
              "business": {
                "id": "{{businessId}}"
              },
              "name": "Second level",
              "slug": "second-level"
            },
            "ancestors": [
              {
                "id": "{{rootCategoryId}}",
                "business": {
                  "id": "{{businessId}}"
                },
                "name": "Root",
                "slug": "root"
              },
              {
                "id": "{{firstLevelCategoryId}}",
                "business": {
                  "id": "{{businessId}}"
                },
                "name": "First level",
                "slug": "first-level"
              },
              {
                "id": "{{secondLevelCategoryId}}",
                "business": {
                  "id": "{{businessId}}"
                },
                "name": "Second level",
                "slug": "second-level"
              }
            ],
            "inheritedAttributes": [
              {
                "name": "Root Option",
                "type": "text"
              },
              {
                "name": "Second Level Option 1",
                "type": "text"
              },
              {
                "name": "Second Level Option 2",
                "type": "text"
              }
            ]
          }
        }
      }
      """
