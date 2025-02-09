Feature: Business products controller
  Background:
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "merchant",
        "permissions": [
          { "businessId": "e5334cbc-fdf9-4b6d-9395-e0a8a8253006", "acls": [] },
          { "businessId": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "acls": [] }
        ]}
      ]
    }
    """

  Scenario: Get popular last week [should return products sold last week sorted by quantity]
    Given I use DB fixture "products-app/business-products/get-popular-last-week"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/popular-week"
    Then print last response
    Then the response should contain json:
    """
    [
      { "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "price":13, "salePrice":23 },
      { "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb", "price":12, "salePrice":22 }
    ]
    """

  Scenario: Get popular last week random [should return products sold last week sorted by quantity]
    Given I use DB fixture "products-app/business-products/get-popular-last-week"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/popular-week/random"
    Then print last response
    Then the response should contain json:
    """
    [
      { "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "price":13, "salePrice":23 },
      { "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb", "price":12, "salePrice":22 }
    ]
    """

  Scenario: Get popular last week should return 404 if business not found
    Given I use DB fixture "products-app/business-products/get-popular-last-week-should-return-404"
    When I send a GET request to "/products-app/business/6933eb7c-63a9-4716-b854-13fa0b1e2405/popular-week"
    Then print last response
    Then the response status code should be 404

  Scenario: Get popular last month [should return products sold last month sorted by quantity]
    Given I use DB fixture "products-app/business-products/get-popular-last-month"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/popular-month"
    Then print last response
    Then the response should contain json:
    """
    [
      { "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "price":10, "salePrice":20 },
      { "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb", "price":8, "salePrice":9  }
    ]
    """

  Scenario: Get popular last month random[should return products sold last month sorted by quantity]
    Given I use DB fixture "products-app/business-products/get-popular-last-month"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/popular-month/random"
    Then print last response
    Then the response should contain json:
    """
    [
      { "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "price":10, "salePrice":20 },
      { "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb", "price":8, "salePrice":9  }
    ]
    """

  Scenario: Get popular last total [should return products sold last total sorted by quantity]
    Given I use DB fixture "products-app/business-products/get-popular-last-month"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/popular-total"
    Then print last response
    Then the response should contain json:
    """
    [
      { "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "price":10, "salePrice":20 },
      { "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb", "price":8, "salePrice":9  }
    ]
    """

  Scenario: Get popular last total random [should return products sold last total sorted by quantity]
    Given I use DB fixture "products-app/business-products/get-popular-last-month"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/popular-total/random"
    Then print last response
    Then the response should contain json:
    """
    [
      { "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "price":10, "salePrice":20 },
      { "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb", "price":8, "salePrice":9  }
    ]
    """

  Scenario: Get popular last month [should return 404 if business not found]
    Given I use DB fixture "products-app/business-products/get-popular-last-month-should-return-404"
    When I send a GET request to "/products-app/business/6933eb7c-63a9-4716-b854-13fa0b1e2405/popular-month"
    Then print last response
    Then the response status code should be 404

  Scenario: Get last sold [should return last sold products]
    Given I use DB fixture "products-app/business-products/get-last-sold"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/last-sold"
    Then print last response
    Then the response should contain json:
    """
    [
      {
        "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb", "price":1, "salePrice":2 
      },
      {
        "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "price":3, "salePrice":4 
      },
      {
        "uuid": "8f4fa65b-c537-425e-8d83-27d399980579", "price":5, "salePrice":6 
      }
    ]
    """

  Scenario: Get last sold random [should return last sold products]
    Given I use DB fixture "products-app/business-products/get-last-sold"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/last-sold/random"
    Then print last response
    Then the response should contain json:
    """
    [
      {
        "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb", "price":1, "salePrice":2 
      },
      {
        "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405", "price":3, "salePrice":4 
      },
      {
        "uuid": "8f4fa65b-c537-425e-8d83-27d399980579", "price":5, "salePrice":6 
      }
    ]
    """
