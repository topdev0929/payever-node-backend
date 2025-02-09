Feature: Product categories GraphQL API
  Scenario: Get product categories
    Given I use DB fixture "graphql/product-categories/get-product-categories"
    When I send a GraphQL query to "/products":
    """
    {
      getCategories(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0") {
        title
      }
    }
    """
    Then print last response
    Then the response should contain json:
    """
    {
      "data": {
        "getCategories": [
          { "title": "Category 1" },
          { "title": "Category 2" },
          { "title": "Category 3" }
        ]
      }
    }
    """

  Scenario: Get product categories - pagination should work:
    Given I use DB fixture "graphql/product-categories/get-product-categories-pagination-should-work"
    When I send a GraphQL query to "/products":
    """
    {
      getCategories(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0", paginationLimit: 2, pageNumber: 2) {
        title
      }
    }
    """
    Then print last response
    Then the response should contain json:
    """
    {
      "data": {
        "getCategories": [
          { "title": "Category 3" }
        ]
      }
    }
    """

  Scenario: Create product category
    When I send a GraphQL query to "/products":
    """
    mutation {
      createCategory(category: {
        businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0",
        title: "New category"
      }) {
        businessUuid
        title
      }
    }
    """
    Then print last response
    Then the response should contain json:
    """
    {
      "data": {
        "createCategory": {
          "businessUuid": "21f4947e-929a-11e9-bb05-7200004fe4c0",
          "title": "New category"
        }
      }
    }
    """
    When I send a GraphQL query to "/products":
    """
    {
      getCategories(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0") {
        title
      }
    }
    """
    Then print last response
    Then the response should contain json:
    """
    {
      "data": {
        "getCategories": [
          { "title": "New category" }
        ]
      }
    }
    """