Feature: Search and Filters for Products GraphQL API
Description: The purpose of this feature is to test Products GraphQL API serach and filters

  Background: DB has a known set of data to perform search on it
    Given I use DB fixture "graphql/get-products/get-products-background"
    Given I remember as "businessId" following value:
    """
      "21f4947e-929a-11e9-bb05-7200004fe4c0"
    """

  Scenario: Get products - simple search
    When I send a GraphQL query to "/products":
    """
    {
      getProducts(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0", paginationLimit: 10, search: "s") {
        products {
          title
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
              "title": "Salt"
            },
            {
              "title": "Sugar"
            }
          ]
        }
      }
    }
    """
  Scenario: Get products - simple filters range price
    When I send a GraphQL query to "/products":
    """
    {
      getProducts(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0", paginationLimit: 10, 
      filters: [
          {
            field: "price",
            fieldCondition: "range",
            fieldType: "nested",
            value: "2|3"
          }
        ]
      ) {
        products {
          title
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
              "title": "Salt"
            }
          ]
        }
      }
    }
    """

  Scenario: Get products - filter by id
    When I send a GraphQL query to "/products":
    """
    {
      getProducts(
        businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0",
        paginationLimit: 10,
        filters: [
          {
            field: "id",
            fieldType: "string",
            fieldCondition: "contains",
            value: "7200004fe4c0"
          }
        ]) {
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

  Scenario: Get products - filter by name
    When I send a GraphQL query to "/products":
    """
    {
      getProducts(
        businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0",
        paginationLimit: 10,
        filters: [
          {
            field: "name",
            fieldType: "string",
            fieldCondition: "startsWith",
            value: "Pe"
          }
        ]) {
        products {
          title
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
              "title": "Pepper"
            }
          ]
        }
      }
    }
    """

  Scenario: Get products - filter by price
    When I send a GraphQL query to "/products":
    """
    {
      getProducts(
        businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0",
        paginationLimit: 10,
        filters: [
          {
            field: "price",
            fieldType: "number",
            fieldCondition: "lessThan",
            value: "5"
          }
        ]) {
        products {
          title
          price
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
              "title": "Salt",
              "price": 3
            },
            {
              "title": "Sugar",
              "price": 4
            }
          ]
        }
      }
    }
    """

  Scenario: Get products - filter by channel
    When I send a GraphQL query to "/products":
    """
    {
      getProducts(
        businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0",
        paginationLimit: 10,
        filters: [
          {
            field: "channel",
            fieldType: "string",
            fieldCondition: "is",
            value: "pos"
          }
        ]) {
        products {
          title
          channelSets {
            type
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
        "getProducts": {
          "products": [
            {
              "title": "Salt",
              "channelSets": [
                {
                  "type": "pos"
                }
              ]
            }
          ]
        }
      }
    }
    """

  Scenario: Get products - filter by category
    When I send a GraphQL query to "/products":
    """
    {
      getProducts(
        businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0",
        paginationLimit: 10,
        filters: [
          {
            field: "category",
            fieldType: "string",
            fieldCondition: "doesNotContain",
            value: "suppl"
          }
        ]) {
        products {
          title
          categories {
            title
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
        "getProducts": {
          "products": [
            {
              "title": "Sugar",
              "categories": [
                {
                  "title": "food"
                }
              ]
            }
          ]
        }
      }
    }
    """

  Scenario: Get products - filter by variant name
    When I send a GraphQL query to "/products":
    """
    {
      getProducts(
        businessUuid: "{{businessId}}",
        paginationLimit: 10,
        filters: [
          {
            field: "variant_value",
            fieldType: "string",
            fieldCondition: "contains",
            value: "brown"
          }
        ]) {
        products {
          title
          variants {
            title
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
        "getProducts": {
          "products": [
            {
              "title": "Sugar",
              "variants": [
                {
                  "title": "brown sugar"
                }
              ]
            }
          ]
        }
      }
    }
    """
